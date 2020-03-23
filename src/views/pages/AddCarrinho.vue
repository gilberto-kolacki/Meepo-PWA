<template>
	<div id="page-catalogo-add" class="page-catalogo-add">
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Voltar</vs-button>
        <vs-button @click.stop="abrirCarrinho()" color="warning" type="filled" class="btn-carrinho" :disabled="!this.existeCarrinho" icon="shopping_cart"></vs-button>

        <div v-if="this.isShow"> 
            <div class="vx-row items-center justify-center" v-if="this.carrinho.cliente.nome">
                <div class="truncate">
                    <h6>CLIENTE: {{this.carrinho.cliente.nome}}</h6>
                </div>
            </div>
            <add-carrinho-item v-for="(prodduto, indexProd) in this.produtos" :key="indexProd"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                :idColapse="'accordion-ref-'+indexProd" 
                title="Referencia:" 
                :index="indexProd"
                :totalProdutos="produtos.length"
                v-model="produtos[indexProd]"
                @replica-todas-grades='replicarTodasGrades'
            >
            </add-carrinho-item>
        </div>
        <h2 class='mt-5' style="display:flex;justify-content: center;" v-if="this.produtosDoLook.length > 0">Complete o Look</h2>
        <div class='flex justify-center w-full' v-if="this.produtosDoLook.length > 0">
            <div class="produto-image-gallery vx-row mt-6" style="width:95%" id="content-produtos">
                <div class="vx-col px-1 lg:w-1/4 md:w-1/4 sm:w-1/3 mb-4" v-for="(produtoLook, indextr) in this.produtosDoLook" :key="indextr" style="min-width: 13rem;">
                    <vx-card class="w-full text-center cursor-pointer; height:100%;">
                        <b-card-text style="display:flex;align-items:center;justify-content:center;">
                            <b-img-lazy :src="produtoLook.img ? produtoLook.img : require(`@/assets/images/rapidsoft/no-image.jpg`)" class="rounded user-latest-image responsive img-popup product-img"/>
                        </b-card-text >
                        <b-card-text style="padding:5px">
                            <span class="vx-row" style="font-weight:bold">{{'Ref: ' + produtoLook.id}}</span>
                            <span class="vx-row" style="max-width: 15ch; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{produtoLook.nome}}</span>
                        </b-card-text>
                        <div class="vx-row items-center justify-center mt-3">
                            <div class="btn-group centex w-full">
                                <vs-button class="w-full" color="primary" icon="add_circle" @click.stop="openGradeLookSelecionado(produtoLook.produto)"></vs-button>
                                <vs-button class="w-full" color="rgb(123, 123, 123)" icon="shopping_cart" @click.stop="openLook(produtoLook.produto)"></vs-button>
                            </div>
                        </div>
                    </vx-card>
                </div>
            </div>
        </div>
    </div> 
</template>
<script>

import ErrorDB from "../../rapidsoft/db/errorDB";
import _ from 'lodash';
import AddCarrinhoItem  from '../../rapidsoft/components/AddCarrinhoItem';
import ProdutoUtils  from '../../rapidsoft/utils/produtoUtils';
import ProdutoDB from '../../rapidsoft/db/produtoDB';
import CarrinhoDB from '../../rapidsoft/db/carrinhoDB';
import Storage from '../../rapidsoft/utils/storage';

export default {
	data: () => ({
        carrinho: null,
        produtos: [],
        isShow: false,
        produtosDoLook: [],
    }),
    components: {
        AddCarrinhoItem,
    },
    computed: {   
        existeCarrinho() {
            return Storage.existeCarrinho();
        },    
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
            this.$router.push({ name: 'catalogoItem',
                params: {pag: {pag:0,produtoA:{id: produto.id, ref:produto.referencia, seq:1}}}
            });
        },
        openGradeLookSelecionado (produtoLookSelecionado) {
            CarrinhoDB.setCarrinho(this.carrinho).then(() => {
                const produtosLook = [produtoLookSelecionado]
                ProdutoUtils.createProdutosAddCarrinho(produtosLook).then((produtos) => {
                    this.produtos = produtos;
                    ProdutoDB.getProdutosLook(produtos[0].produtosLook).then((produtosLook) => {
                        this.produtosDoLook = produtosLook;
                        this.isShow = true;
                        this.$forceUpdate();
                    });
                });
            });
        },
        cancelarAdd () {
            this.voltarCatalogo();
        },
        addReferenciaCarrinho() {
            this.carrinho.valorTotal = _.round(this.carrinho.itens.reduce((total, item) => {
                return total = total + (item.quantidade * ProdutoUtils.calcularPreco(item));
            }, 0), 2);
        },
        voltarCatalogo() {
            this.$router.push({ name: this.$route.params.tela, 
                params: {pag: this.$route.params.pag, edit: this.$route.params.edit ? true : false, segmento:this.produtos[0].segmento[0]}
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
            this.addReferenciaCarrinho();
        },
        abrirCarrinho() {
            this.$router.push({ name: 'carrinho', params: {tela: 'catalogoItem'} });
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                CarrinhoDB.getCarrinho().then((carrinho) => {
                    this.carrinho = carrinho;
                    ProdutoUtils.createProdutosAddCarrinho(this.$route.params.produtos).then((produtos) => {
                        this.produtos = produtos;
                        ProdutoDB.getProdutosLook(produtos[0].produtosLook).then((produtosLook) => {
                            this.produtosDoLook = produtosLook;
                            this.isShow = true;
                            document.getElementById('loading-bg').style.display = "none";
                            resolve();
                        });
                    });
                });
            });
        }
    },
    beforeCreate() {       
        
    },
    created() {        
    
    },
    async mounted() {
        await this.carregaItensTela();
    },
	errorCaptured(err, vm, info) {
        ErrorDB._criarLog({ err, vm, info });
        return true;
    },
    async beforeDestroy() {
        return new Promise((resolve) => {
            CarrinhoDB.setCarrinho(this.carrinho).then(() => {
                resolve();
            });
        });
    }

};
</script>

<style lang="scss">

.page-catalogo-add {
    margin-top: -15px;
}

.produto-image-gallery {
    overflow-x: scroll;
    overflow-y: hidden;
    flex-wrap: nowrap;    
}

.produto-image-gallery-button {
    width: 100% !important;
    cursor: pointer;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;        
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    border-radius: .5rem !important;
    background-color: #fff;
}

.produto-image-gallery-button-up {
    margin-bottom: 10px;
}

</style>