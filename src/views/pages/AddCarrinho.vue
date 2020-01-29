<template>
	<div id="page-catalogo-add" class="page-catalogo-add">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Voltar</vs-button>
        <div v-if="this.isShow"> 
            <add-carrinho-item v-for="(prodduto, indexProd) in this.produtos" :key="indexProd"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                :idColapse="'accordion-ref-'+indexProd" 
                :title="'Referencia '+(indexProd+1)" 
                :index="indexProd"
                v-model="produtos[indexProd]"
                @replica-todas-grades='replicarTodasGrades'
            >
            </add-carrinho-item>
            <complete-look v-if="this.isShow" @produto-look="openLook" :produtoA="produtos[0]"/>
        </div>
    </div> 
</template>
<script>

import ErrorDB from "../../rapidsoft/db/errorDB";
import _ from 'lodash';
import AddCarrinhoItem  from '../../rapidsoft/components/AddCarrinhoItem';
import Storage  from '../../rapidsoft/utils/storage';
import ProdutoUtils  from '../../rapidsoft/utils/produtoUtils';
import CompleteLook  from '../../rapidsoft/components/CompleteLook';

export default {
	data: () => ({
        carrinho: null,
        produtos: [],
        isShow: false,
    }),
    components: {
        AddCarrinhoItem,
        CompleteLook,
    },
    computed: {

    },
    methods: {
        replicarTodasGrades(index) {
            const quantidades = this.produtos[index].produtoAddCores.reduce((map, corAdd) => {
                map[corAdd.codigo] = corAdd.produtoAddTamanhos.reduce((map, tamanhoAdd) => {
                    map[tamanhoAdd.codigo] = tamanhoAdd.quantidade ? tamanhoAdd.quantidade : 0;
                    return map;
                },{});
                return map;
            },{});

            const addCarrinhoItens = this.$children.filter(component => component.$options.name === "add-carrinho-item");
            addCarrinhoItens.forEach(addCarrinhoItem => {
                if (addCarrinhoItem.index !== index) {
                    addCarrinhoItem.replicarGradeRefs(quantidades);
                }
            });
        },
        atualizarGrade(indexCor, indexTamanho,key) {
            const tamanho = this.criaTamanho(indexCor, indexTamanho,key);
            tamanho.quantidade = _.isNil(tamanho.quantidade) ? 
                0 : (tamanho.quantidade === 0 ? 0 :tamanho.quantidade);
            this.atualizaQuantidadeItens(_.clone(tamanho))
        },

        criaTamanho(indexCor, indexTamanho, key) {
            const tamanho = this.produtoAdd[key].cores[indexCor].tamanhos[indexTamanho];
            tamanho.ref = this.produtoAdd[key].referencia;
            tamanho.cor = this.produtoAdd[key].cores[indexCor].idCor;
            tamanho.precoCusto = this.produtoAdd[key].cores[indexCor].precoCusto;
            tamanho.idProduto = this.produtoAdd[key].cores[indexCor].idProduto;
            tamanho.idSegmento = this.produtoAdd[key].segmento;
            return tamanho
        },

        openLook(produto) {
            this.$emit('search-selected', produto.produtoA);
        },
        cancelarAdd () {
            this.voltarCatalogo();
        },
        addReferenciaCarrinho() {
            ProdutoUtils.calcularCarrinho(this.carrinho).then((carrinhoResult) => {
                Storage.setCarrinho(carrinhoResult);
				this.voltarCatalogo();
            });
        },
        voltarCatalogo() {
            this.$router.push({ name: this.$route.params.tela, 
                params: {pag: this.$route.params.pag}
            });
        },
        atualizaQuantidadeItens(tamanho) {
            const itens = _.remove(this.carrinho.itens, (item) => item.id != tamanho.id );
            if (tamanho.quantidade) {
                if (tamanho.ativo && tamanho.quantidade > 0) {
                    delete tamanho['ativo'];
                    delete tamanho['estoque'];
                    itens.push(tamanho);
                }
            }
            this.carrinho.itens = itens;
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                this.catalogo = Storage.getCatalogo();
                this.carrinho = Storage.getCarrinho();
                ProdutoUtils.createProdutosAddCarrinho(this.$route.params.produtos).then((produtos) => {
                    this.produtos = produtos;
                    this.isShow = true;
                    resolve();
                });
            });
        }
    },
    beforeCreate() {       
        
    },
    async created() {        
        await this.carregaItensTela();
    },
    mounted() {
        
    },
	errorCaptured(err, vm, info) {
        ErrorDB._criarLog({ err, vm, info });
        return true;
    }

};
</script>

<style lang="scss">


</style>