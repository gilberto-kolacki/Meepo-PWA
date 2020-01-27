<template>
	<div id="page-catalogo-add" class="page-catalogo-add">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Voltar</vs-button>
        <div v-if="this.isShow"> 
            <add-carrinho-item v-for="(prodduto, indexProd) in this.produtos" :key="indexProd"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                :idColapse="'accordion-ref-'+indexProd" 
                :toggle="indexProd == 0 ? true : false" 
                :title="'Referencia '+(indexProd+1)" 
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
        replicarTodasGrades(produto) {

            this.$forceUpdate();

            return new Promise(() => {
                // const done = _.after(Object.keys(this.produtoAdd).length, () => resolve(this.update()));
                
                for (const key in this.produtoAdd) {
                    
                    // const done = _.after(this.produtoAdd[key].cores.length, () => resolve(this.update()));
                    
                    if (this.produtoAdd.hasOwnProperty(key)) {
                        
                        this.produtoAdd[key].cores.forEach((itemCor,indexCor) => {
                            const listaProdutosCores = _.find(produto.cores, function(cor) { return cor.idCor == itemCor.idCor; });
                            if (listaProdutosCores) {
                                itemCor.tamanhos.forEach((itemTamanho,indexTamanho) => {

                                    const listaProdutosTamanhos = _.find(listaProdutosCores.tamanhos, function(tam) { 
                                        return tam.codigo == itemTamanho.codigo; 
                                    });
                                    itemTamanho.quantidade = listaProdutosTamanhos ? _.clone(listaProdutosTamanhos.quantidade) : 0;
                                    this.atualizarGrade(indexCor,indexTamanho,key)
                                    // done();
                                })
                            }
                        });
                        
                    }
                    //  done();
                }
            
                setTimeout(() => {this.$forceUpdate()}, 1000);
            
            });
            

        },

        update() {
            console.log("done");
            this.$forceUpdate();
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