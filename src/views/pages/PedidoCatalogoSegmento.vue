<template>
    <div id="page-catalogo">
        <vs-button @click.stop="prevRef()" color="primary" type="filled" radius class="btn-left" icon-pack="feather" icon="icon-chevron-left"></vs-button>
        <vs-button @click.stop="nextRef()" color="primary" type="filled" radius class="btn-right" icon-pack="feather" icon="icon-chevron-right"></vs-button>
        <vs-col vs-order="3" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-row">
                
                <div class="vx-col w-full sm:w-1/5 h-12">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="dark" type="filled" icon-pack="feather" class="w-full" icon="icon-menu" @click.stop="showSidebar"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row">
                        <vs-divider position="left" border-style="dashed" color="primary">Imagens</vs-divider>
                        <vx-card>
                            <div slot="no-body">
                                <div class="vx-row pt-2 items-center justify-center" v-for="(imagem, index) in getImagensCorProduto" :key="index">
                                    <img :src="require(`@/assets/images/rapidsoft/produtos/${getImagemCorProduto(imagem)}.png`)" alt="latest-upload" class="rounded mb-4 user-latest-image responsive img-ref">
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <div class="vx-row">
                        <vs-divider position="left" border-style="dashed" color="primary">Cores</vs-divider>
                        <vx-card style="width: 18rem;">
                            <div class="vx-row items-center justify-center"  v-for="(cor, index) in getCoresProduto" :key="index">
                                <img :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.nome}.png`)" alt="latest-upload" class="rounded mb-4 user-latest-image responsive img-cor">
                            </div>
                        </vx-card>
                    </div>
                </div>
                <vs-col vs-type="flex" vs-justify="center" vs-align="baseline" vs-lg="7" vs-sm="7" vs-xs="12">
                    <img :src="require(`@/assets/images/rapidsoft/produtos/${activeProductImgUp}`)" class="card-img-top card-img-principal">
                </vs-col>
                <div class="vx-col w-full md:w-1/5 h-12">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="primary" type="filled" icon-pack="feather" class="w-full" icon="icon-search" @click.stop="abrirListaPodutos()"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row">
                        <vs-divider position="right" border-style="dashed" color="primary">Ações</vs-divider>
                        <span>Ref A: {{produtoA.referencia}}</span>
                        <div class="btn-group centex mt-base-top1">
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-plus" @click.stop="addCarrinho()"></vs-button>
                            <vs-button class="w-full" type="border" color="primary" icon-pack="feather" icon="icon-book-open" @click.stop="addCarrinho()"></vs-button>
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-dollar-sign" @click.stop="addCarrinho()"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top2" v-if="produtoB">
                        <span>Ref B: {{produtoB.referencia}}</span>
                        <div class="flex w-full items-center justify-center">
                            <div class="flex w-full items-center justify-center">
                                <vs-button color="success" radius type="filled" icon-pack="feather" class="mr-2" icon="icon-plus-circle" @click.stop="addCarrinho()"></vs-button>
                                <vs-button color="success" radius type="filled" icon-pack="feather" class="mr-2" icon="icon-plus-circle" @click.stop="addCarrinho()"></vs-button>
                                <vs-button color="success" radius type="filled" icon-pack="feather" class="mr-2" icon="icon-plus-circle" @click.stop="addCarrinho()"></vs-button>
                            </div>
                        </div>
                    </div>                     
                    <div class="vx-row">
                        <vs-divider position="right" border-style="dashed" color="primary">Categorias</vs-divider>
                        <vx-card>
                            <ul class="leftx">
                                <li v-for="(categoria, index) in categorias" :key="index" style="margin-bottom: 0.5rem;">
                                    <vs-radio v-model="filtro.categoria" :vs-value="categoria.codigo">{{categoria.nome}}</vs-radio>
                                </li>
                            </ul>
                            <!-- <div class="flex w-full items-center justify-center">
                                <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus" @click="abrirListaPodutos()">Lista</vs-button>
                            </div> -->
                        </vx-card>
                    </div>
                    <!-- <div class="vx-row">
                        <vs-divider position="right" border-style="dashed" color="primary"></vs-divider>
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="success" radius type="border" icon-pack="feather" icon="icon-shopping-cart"></vs-button>
                            <vs-button color="success" radius type="border" icon-pack="feather" icon="icon-shopping-cart"></vs-button>
                        </div>
                    </div> -->
                </div>
            </div>
            <vs-popup class="popup-produto" fullscreen title="Pesquisa " :active.sync="popupListaProdutos">
                
                <div class="flex flex-wrap-reverse items-center">
                    <div v-for="(categoria, index) in getCategoriasCardPesquisa" :key="index" style="padding: 2px;">
                        <vs-button v-show="categoria.check"
                            type="filled"
                            color="primary" 
                            icon-pack="feather" 
                            v-on:click.stop="categoria.check = !categoria.check"
                            icon="icon-check">
                            {{categoria.nome}}
                        </vs-button>
                        <vs-button v-show="!categoria.check"
                            type="border"
                            color="primary" 
                            icon-pack="feather" 
                            v-on:click.stop="categoria.check = !categoria.check"
                            icon="icon-x">
                            {{categoria.nome}}
                        </vs-button>
                    </div>
                </div>
                <!-- <div v-hammer:swipe.left="prevRef()"></div> -->
                <!-- <div v-hammer:swipe.right="nextRef()"></div> -->

                <vs-table ref="table" v-model="selected" search :data="getProdutosPesquisa">
                    <!-- <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    </div> -->
                    <template slot="thead">
                        <vs-th>Image</vs-th>
                        <vs-th sort-key="referencia">Referencia</vs-th>
                        <vs-th sort-key="nome">Nome</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <tbody>
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].imagem">
                                    <img :src="require(`@/assets/images/rapidsoft/produtos/${getImage(tr)}`)" class="rounded mb-4 user-latest-image responsive img-popup product-img" />
                                </vs-td>
                                <vs-td :data="data[indextr].referencia">
                                    <p class="product-name font-medium">{{ tr.referencia }}</p>
                                </vs-td>
                                <vs-td :data="data[indextr].nome">
                                    <p class="product-category">{{ tr.nome }}</p>
                                </vs-td>
                            </vs-tr>
                        </tbody>
                    </template>
                </vs-table>
            </vs-popup>

            <vs-popup class="popup-produto" fullscreen title="Referencia " :active.sync="popupAddCarrinho">
                
            </vs-popup>
        </vs-col>
    </div>
    
    
</template>
<script>

import _ from 'lodash'
import produtoDB from '../../rapidsoft/db/produtoDb'


export default {

    data() {
        return {
            selected: [],
            produtoA: null,
            produtoB: null,
            popupListaProdutos: false,
            popupAddCarrinho: false,
            categorias: [],
            filtro:{
                categoria: 0
            },
            corSelecionada: 0,
            imagens: [

            ],
            produtos: []

        }
    },
    components: {
    },
    computed: {
        getProdutosPesquisa() {
            return this.produtos.filter((produto) => {
                return this.getCategoriasCardPesquisa.some((categoria) => {
                    return categoria.check && produto.hasOwnProperty('categoria') && produto.categoria.hasOwnProperty('codigo') && produto.categoria.codigo == categoria.codigo;
                });
            });
        },
        getCategoriasCardPesquisa() {
            return this.categorias.filter((categoria) => {
                return categoria.codigo != 0;
            });
        },
        getImagensCorProduto() {
            if (this.produtoA) {
                return this.produtoA.cores[this.corSelecionada].imagens
            } else {
                return [];
            }
        },        
        getCoresProduto() {
            if (this.produtoA) {
                return this.produtoA.cores
            } else {
                return [];
            }
        },
        activeProductImgUp() {
            return this.produtoA.imagem;
        }
    },
    methods: {
        getImagemCorProduto(imagem) {
            var cor = _.cloneDeep(this.produtoA.cores[this.corSelecionada]);
            if (cor.nome) {
                return this.produtoA.referencia +'_'+ cor.nome +'_'+ imagem;
            } else {
                return this.produtoA.referencia +'_'+ imagem;
            }
        },
        prevRef() {
            let anterior = this.produtos.indexOf(this.produtoA)-1;
            if (anterior >= 0) {
                this.produtoA = this.produtos[this.produtos.indexOf(this.produtoA)-1];
            } else {
                this.produtoA = this.produtos[this.produtos.length-1];
            }
            this.corSelecionada = 0;
        },
        nextRef() {
            let proxima = this.produtos.indexOf(this.produtoA)+1;
            if (proxima < this.produtos.length) {
                this.produtoA = this.produtos[this.produtos.indexOf(this.produtoA)+1];
            } else {
                this.produtoA = this.produtos[0];
            }
            this.corSelecionada = 0;
        },
        showSidebar() {
            this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
        getPopularityColor(num) {
            if(num > 90) return "success"
            if(num >70) return "primary"
            if(num >= 50) return "warning"
            if(num < 50) return "danger"
            return "primary"
        },
        getProdutoNome(produto) {
            return produto.referencia +"-"+ produto.nome;
        },
		getImage(produto) {
			return produto.imagem;
        },
        handleWindowResize(event) {
            this.windowWidth = event.currentTarget.innerWidth
            this.setSidebarWidth()
        },
        setSidebarWidth() {
            if(this.windowWidth < 992) {
                this.isFilterSidebarActive = this.clickNotClose = false
            }else {
                this.isFilterSidebarActive = this.clickNotClose = true
            }
        },
        abrirListaPodutos() {
            this.popupListaProdutos=true
        },
        addCarrinho() {
            this.popupAddCarrinho = true;
        }
    },
    created() {
        this.produtos = produtoDB.getProdutos();
        this.categorias = produtoDB.getCategorias()
        this.categorias.forEach(categoria => {
            categoria.check = true;
        });
        this.produtoA = this.produtos[0];
        this.corSelecionada = 0;
        if(this.produtoA.tipo === 2) {
            this.produtoDown = this.produtos[1];
        }
    },
    mounted() {
        
    },
    
}
</script>

<style lang="scss" scoped>

.mt-base-bottom {
    margin-bottom: 2rem !important
}

.mt-base-top2 {
    margin-top: 1.2rem !important
}
.mt-base-top1 {
    margin-top: 0.6rem !important
}

.vs-divider--text {
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    white-space: nowrap;
    background: #fff0;
    padding-left: 12px;
    padding-right: 12px;
    font-size: .9375em;
}

.img-ref {
    max-height: 6rem;
    width: auto;
    /* max-width: 10rem; */
}

.img-cor {
    max-height: 4rem;
    max-width: 6rem;
}

@media only screen and (min-width: 992px) {
    .card-img-principal {
        max-width: 24rem;
    }
}

.img-popup {
    max-height: 7rem;
    max-width: 4rem;
}

.btn-left{
    position: fixed;
    top:50%;
    left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    z-index: 50000;

    .vs-icon{
        animation: spin 1.5s linear infinite;
    }
}

.btn-right {
    position: fixed;
    top:50%;
    right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 50000;

    .vs-icon{
        animation: spin 1.5s linear infinite;
    }
}

</style>