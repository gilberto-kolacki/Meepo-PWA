<template>
	<div id="page-catalogo-add" class="page-catalogo-add">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Voltar</vs-button>
        <div class='vx-row'>
            <div class='w-full sm:w-1/2.5 mr-2' v-if="showPrevia">
                <vx-card class="mb-6" style="padding 5px">
                    <div slot="no-body">
                        <div class='vx-row flex justify-between pr-6 pl-6'>
                            <div class="p-6 flex justify-end flex-row">
                                <div class="vx-row mr-8">
                                    <vs-avatar class="mr-3" @click="somaPreviaValores()" style="margin:auto" color="success" icon-pack="feather" icon="icon-dollar-sign" />
                                    <div class="truncate">
                                        <span>Prévia Total:</span>
                                        <h3 class="mb-1 font-bold" v-if="this.previaTotal > 0">{{previaTotal | moneyy}}</h3>
                                        <h3 class="mb-1 font-bold" v-else >R$ 0,00</h3>
                                    </div>
                                </div>
                                <div class="vx-row ml-5 mr-5">
                                    <vs-avatar class="mr-3" @click="somaPreviaValores()" style="margin:auto" color="warning" icon-pack="feather" icon="icon-layers" />
                                    <div class="truncate">
                                        <span>Total Itens:</span>
                                        <h3 class="mb-1 font-bold" v-if="this.previaTotal > 0">{{totalItens}}</h3>
                                        <h3 class="mb-1 font-bold" v-else>0</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
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
            <!-- <complete-look v-if="this.isShow" @open-grade-look-selecionado="openGradeLookSelecionado" @produto-look="openLook" :produtoPrincipal="produtos[0]"/> -->
        </div>
        
        <div class='flex justify-center w-full' v-if="this.produtosDoLook.length > 0">
            <div class="produto-image-gallery vx-row mt-6" style="width:95%" id="content-produtos">
                <div class="vx-col px-2 lg:w-1/4 md:w-1/4 sm:w-1/3 mb-4" :key="indextr" v-for="(produtoLook, indextr) in this.produtosDoLook">
                    <vx-card class="w-full text-center cursor-pointer;height:100%;">
                        <b-card-text style="display:flex;align-items:center;justify-content:center;">
                            <b-img-lazy :src="produtoLook.img" class="rounded user-latest-image responsive img-popup product-img" v-if="produtoLook.img"/>
                            <b-img-lazy :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="rounded user-latest-image responsive img-popup product-img" v-else />
                        </b-card-text >
                        <b-card-text style="padding:5px">
                            <span class="vx-row" style="font-weight:bold">{{'Ref: ' + produtoLook.id}}</span>
                            <span class="vx-row" style="max-width: 15ch; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{produtoLook.nome}}</span>
                        </b-card-text>
                        <div class="flex justify-center flex-wrap">
                            <vs-button 
                                class="mt-1 mr-2 shadow-lg" 
                                type="gradient" 
                                color="primary" 
                                gradient-color-secondary="#FFFFFF"
                                icon-pack="feather" 
                                icon="icon-external-link"
                                @click="openLook(produtoLook.produto)" 
                            />
                            <vs-button 
                                class="mt-1" 
                                type="border" 
                                color="primary"
                                icon-pack="feather" 
                                icon="icon-shopping-cart"
                                @click="openGradeLookSelecionado(produtoLook.produto)"
                            />
                        </div>
                    </vx-card>
                </div>
            </div>
        </div>
        <div class="flex justify-center" v-if="this.produtosDoLook.length > 0 && isShow"> 
            <div style="width:95%" class="vx-row flex justify-center">
                <vs-button 
                    class="mt-1 mr-4 shadow-lg w-1/5" 
                    color="primary" 
                    gradient-color-secondary="#FFFFFF"
                    icon-pack="feather" 
                    icon="icon-chevron-left"
                    @click="scrollLeft()" 
                />
                <vs-button 
                    class="mt-1 shadow-lg w-1/5" 
                    color="primary" 
                    gradient-color-secondary="#FFFFFF"
                    icon-pack="feather" 
                    icon="icon-chevron-right"
                    @click="scrollRight()" 
                />
            </div>
        </div>
    </div> 
</template>
<script>

import ErrorDB from "../../rapidsoft/db/errorDB";
import _ from 'lodash';
import AddCarrinhoItem  from '../../rapidsoft/components/AddCarrinhoItem';
import Storage  from '../../rapidsoft/utils/storage';
import ProdutoUtils  from '../../rapidsoft/utils/produtoUtils';
import ProdutoDB from '../../rapidsoft/db/produtoDB';

export default {
	data: () => ({
        carrinho: null,
        produtos: [],
        isShow: false,
        produtosDoLook: [],
        showPrevia: false,
        previaTotal: 0,
        totalItens: 0,
    }),
    components: {
        AddCarrinhoItem,
    },
    computed: {

    },
    methods: {
        
        somaPreviaValores() {
            if (this.carrinho.itens.length > 0) {
                ProdutoUtils.calcularCarrinho(this.carrinho).then((carrinhoResult) => {
                    this.previaTotal = carrinhoResult.valorTotal;
                });
                console.log('car ',this.carrinho);
                
                this.getTotalItens(this.carrinho.itens);
            } else {
                this.previaTotal = 0;
            }
        },
        getTotalItens(carrinhoItens) {
            this.totalItens = carrinhoItens.reduce(( itemAnterior, itemAtual ) => {
                return _.toInteger(itemAnterior) + itemAtual.quantidade;
            }, 0 );
        },
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

        scrollRight() {
            document.getElementById("content-produtos").scrollLeft += 247;
        },

        scrollLeft() {
            document.getElementById("content-produtos").scrollLeft -= 247;
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
                params: {pag: {pag:0,produtoA:{id: produto.id,ref:produto.referencia,seq:1}}}
            });
        },
        openGradeLookSelecionado (produtoLookSelecionado) {
            this.catalogo = Storage.getCatalogo();
            this.carrinho = Storage.getCarrinho();
            const produtosLook = [produtoLookSelecionado]
            ProdutoUtils.createProdutosAddCarrinho(produtosLook).then((produtos) => {
                ProdutoDB.getProdutosLook(produtos[0].produtosLook).then((produtosLook) => {
                    this.produtosDoLook = produtosLook;
                    this.produtos = produtos;
                    this.isShow = true;
                });
            });
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
            this.somaPreviaValores();
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                this.catalogo = Storage.getCatalogo();
                this.carrinho = Storage.getCarrinho();
                ProdutoUtils.createProdutosAddCarrinho(this.$route.params.produtos).then((produtos) => {
                    ProdutoDB.getProdutosLook(produtos[0].produtosLook).then((produtosLook) => {
                        this.produtosDoLook = produtosLook;
                        this.produtos = produtos;
                        this.showPrevia = true
                        this.somaPreviaValores();
                        this.isShow = true;
                        resolve();
                    });
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