<template>
    <div id="page-customer">
        <div class="vx-row">
            <!-- Produtos -->
            <div class="vx-col w-3/4 mt-4">
                
                    <div>
                        <vx-card>
                            <h4 v-b-toggle="'look'" class="m-1">Produtos do Look</h4>
                            <b-collapse :id="'look'" visible accordion="my-accordion" role="tabpanel">
                                <div v-for="(produto, index) in produtos" :key="index">
                                    <monte-look-item
                                        v-if="idSegmento && index != 2"
                                        @atualiza-produtos="atualizarProdutos"
                                        @mostrar-produtos-categorias="mostrarProdutosCategorias"
                                        @set-cor-produto="setCorProduto"
                                        :produto="produtos[index]"
                                        :produtoSeq="index"
                                    />
                                </div>
                            </b-collapse>
                        </vx-card>
                        <vx-card v-if="acessorioView" class="mt-4">
                            <h3 v-b-toggle="'acessorio'" class="m-1">Acessórios</h3>
                            <b-collapse :id="'acessorio'" visible accordion="my-accordion" role="tabpanel">
                                <div>
                                    <monte-look-item
                                        v-if="idSegmento"
                                        @atualiza-produtos="atualizarProdutos"
                                        @mostrar-produtos-categorias="mostrarProdutosCategorias"
                                        @set-cor-produto="setCorProduto"
                                        :produto="produtos[2]"
                                        :produtoSeq="2"
                                    />
                                </div>
                            </b-collapse>
                        </vx-card>
                    </div>
                
            </div>
            <!-- informações -->
            <div class="vx-col w-1/4">
                <div class="vx-row mt-4">
                    <vx-card>
                        <div class="vx-row" v-for="(produto, index) in produtos" :key="index">
                            <h6 v-if="index != 2"><b>Produto {{index+1}}: </b>{{produto.nome}}</h6>
                        </div>
                        <div class="vx-row" v-if="acessorioView">
                            <h6><b>Produto 3: </b>{{produtos[2].nome}}</h6>
                        </div>
                        <div class="vx-row">
                            <div class="btn-group centex mt-2 w-full">
                                <vs-button @click="addProduto" class="w-full" color="primary" icon="add_circle"></vs-button>
                                <vs-button @click="popupPrecoRef=true" class="w-full" color="rgb(123, 123, 123)" size="36px" icon="attach_money"></vs-button>
                            </div>
                        </div>
                    </vx-card>
                </div>
                <div class="vx-row mt-4">
                    <vx-card>
                        <div class="vx-row" v-for="(produto, index) in produtos" :key="index">
                            <div class="vx-col w-full mb-2" v-if="index != 2">
                                <label for="segmentoFiltro" class="vs-input--label">Categorias Produto {{index + 1}}</label>
                                <v-select
                                    @input="searchFindProduto(produto,index)"
                                    multiple 
                                    id="categoriaFiltro"
                                    name="segmento"
                                    v-model="categoriasSelecionadas[index]"
                                    label="nome"
                                    :options="getCategoriasSearch"
                                />
                            </div>
                        </div>
                        <div class="vx-row" v-if="acessorioView">
                            <div class="vx-col w-full mb-2">
                                <label for="segmentoFiltro" class="vs-input--label">Categorias Produto 3</label>
                                <v-select
                                    @input="searchFindProduto(produtos[2],2)"
                                    multiple 
                                    id="categoriaFiltro"
                                    name="segmento"
                                    v-model="categoriasSelecionadas[2]"
                                    label="nome"
                                    :options="getCategoriasSearch"
                                />
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col w-full mt-6">
                                <vs-button @click="acessorioView = !acessorioView" class="w-full" color="primary" :icon="!acessorioView ? 'add_circle':'remove_circle'">Acessório</vs-button>
                            </div>
                        </div>
                    </vx-card>
                </div>
            </div>
        </div>
        <!-- popup Preço Referências -->
        <vs-popup title="Preço das Referências" :active.sync="popupPrecoRef" :button-close-hidden="false">
            <table style="width:100%" class="border-collapse">
                <tr>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Ref.</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Nome</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sell In</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sell Out</th>
                </tr>
                <tr v-for="(produto, index) in produtos" :key="index">
                    <td v-if="produto.referencia" class="p-2 border border-solid d-theme-border-grey-light">{{produto.referencia}}</td>
                    <td v-if="produto.nome" class="p-2 border border-solid d-theme-border-grey-light">{{produto.nome}}</td>
                    <td v-if="produto.corSelecionada" class="p-2 border border-solid d-theme-border-grey-light text-right">{{produto.corSelecionada ? produto.corSelecionada.precoCusto : ''}}</td>
                    <td v-if="produto.corSelecionada" class="p-2 border border-solid d-theme-border-grey-light text-right">{{produto.corSelecionada ? produto.corSelecionada.precoVenda : ''}}</td>
                </tr>
            </table>
        </vs-popup>
        <!-- popup Escolha o Segmento -->
        <vs-popup title="Escolha o Segmento" :active.sync="popupSegmento" :button-close-hidden="false">
            <div class="vx-row flex justify-center">
                <div class="vx-col w-2/5" @click="setSegmento(segmento)" v-for="(segmento,index) in listaSegmentos" :key="index">
                    <vx-card color="rgb(123, 123, 123)" style="background-color:rgb(123, 123, 123);color:#fff" class="flex justify-center">
                        <h1 style="color:#fff">{{segmento.nome}}</h1>
                    </vx-card>
                </div>
            </div>
        </vs-popup>
        <!-- popup produtos -->
        <vs-popup title="Escolha o Produto" :active.sync="popupProdutosCategoria" :button-close-hidden="false">
            <div class="vx-row flex justify-center">
                <div class="vx-row mt-6 ml-2">
                    <div class="mr-2 vx-row w-full produto-image-gallery" style="height: auto;">
                        <div class="vx-col px-1 lg:w-2/5 md:w-1/5 sm:w-1/3 mb-4" @click="setProduto(produto)" v-for="(produto, index) in listaProdutosPesquisa[posicaoProduto]" :key="index">
                            <vx-card class="w-full text-center cursor-pointer; height:100%;">
                                <b-card-text style="display:flex;align-items:center;justify-content:center;">
                                    <b-img-lazy :src="produto.imagemPrincipal ? produto.imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)" class="rounded user-latest-image responsive img-popup product-img"/>
                                </b-card-text >
                                <b-card-text style="padding:10px">
                                    <span class="vx-row" style="font-weight:bold">{{'Ref: ' + produto.referencia}}</span>
                                    <span class="vx-row" style="max-width: 10ch; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{produto.nome}}</span>
                                </b-card-text>
                            </vx-card>
                        </div>
                    </div>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>

    import MonteLookItem  from '../../rapidsoft/components/MonteLookItem';
    import CategoriaDB from '../../rapidsoft/db/categoriaDB';
    import ProdutoDB from '../../rapidsoft/db/produtoDB';
    import Segmento from '../../rapidsoft/db/segmentoDB';
    import vSelect from 'vue-select';
    import _ from 'lodash';

    export default {
        data: () => ({
            idSegmento: null,
            produtos:[{},{},{}],
            categoriasFiltro: [],
            categoriasSelecionadas: [],
            listaProdutosPesquisa: [],
            listaCores: [],
            popupPrecoRef: false,
            popupSegmento: false,
            popupProdutosCategoria: false,
            popupCorProduto: false,
            listaSegmentos: [],
            mostrarCoresDisponiveis:false,
            posicaoProduto:null,
            acessorioView: false,
        }),
        components: {
            'v-select': vSelect,
            MonteLookItem,
        },
        computed: {
            getCategoriasSearch() {
                return this.categoriasFiltro.map((categoria) => {
                    return categoria;
                });
            },
        },
        methods: {
            setCorProduto(produto) {
                this.produtos[this.posicaoProduto] = produto;
                this.popupCorProduto = false;
            },
            setProduto(produto) {
                this.produtos[this.posicaoProduto] = produto;
                this.produtos[this.posicaoProduto].corSelecionada = this.produtos[this.posicaoProduto].cores[0];
                this.popupProdutosCategoria = false;
            },
            mostrarProdutosCategorias(produtoSeq) {
                this.popupProdutosCategoria = true;
                this.posicaoProduto = produtoSeq;
            },
            setSegmento(segmento) {
                this.idSegmento = segmento.id;
                this.popupSegmento = false;
                this.searchCategorias();
            },
            atualizarProdutos(produtos) {
                this.produtos = produtos;
                this.$forceUpdate();
            },
            addProduto() {
                
                const produtoA = this.produtos[0];
                const produtoB = this.produtos[1] && this.produtos[1].nome ? this.produtos[1] : undefined;
                const produtoC = this.produtos[2] && this.produtos[2].nome ? this.produtos[2] : undefined;
                const produtos = [produtoA,produtoB,produtoC];
                const pag = {pag: 1,produtoA: produtoA,produtos: produtos}
                this.$router.push({ name: 'carrinhoAdd', 
                    params: {produtos: produtos, tela: 'monteLook', pag: pag, paginas: {},viewCompleteLook: false}
                });
            },
            searchFindProduto(produto,index) {
                this.$vs.loading();
                const idsCategorias = this.categoriasSelecionadas[index].map((categoria) => {return categoria.id})
                ProdutoDB.getProdutosMonteLook(idsCategorias).then((result) => {
                    this.listaProdutosPesquisa[index] = result;
                    this.$vs.loading.close();
                });
            },
            searchCategorias() {
                this.categoriasSelecionadas = [];
                CategoriaDB.getAllBySegmento(this.idSegmento).then((categorias) => {
                    this.categoriasFiltro = _.cloneDeep(categorias);
                    this.$vs.loading.close('#div-with-loading-search > .con-vs-loading');
                });
            },
            carregaItensTela() {
                return new Promise((resolve) => {
                    Segmento._getAll().then((segmentos) => {
                        this.listaSegmentos = segmentos;
                        resolve();
                    });
                });
            },
            scrollUp() {
                const gallery = document.getElementById("produto-image-gallery");
                gallery.scrollTop = gallery.scrollTop - 80;
            },
            scrollDown() {
                const gallery = document.getElementById("produto-image-gallery");
                gallery.scrollTop = gallery.scrollTop + 80;
            },
        },
        created() {
            this.popupSegmento = true;
            this.carregaItensTela();
        },
        mounted() {
        },    
}

</script>

<style lang="scss">
    html {
        position: fixed;
        width: 100%; 
        height: 100%
    }
    
    // .produto-image-scroll{
    //     overflow-x: hidden;
    //     overflow-y: scroll;
    //     flex-wrap: nowrap;    
    // }
    .vx-navbar-wrapper {
        z-index: 0;
    }
    .input_filter{
        background-color: rgb(228,28,64);
        color:rgb(228,255,255);
        padding: 10px;
        border-radius: 5px;
        border:1.5px solid rgb(228, 28, 64); 
        font-size: x-small;
        font-weight: bold;
        cursor: pointer;
        display: inline-block;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        width:70%;
        min-width:80%
    }

    .notHaveFilter{
        color: rgb(228,28,64);
        background-color:rgb(255,255,255);
        padding: 10px;
        border-radius: 5px;
        border:1.5px solid rgb(228, 28, 64); 
        font-size: x-small;
        font-weight: bold;
        cursor: pointer;
        display: inline-block;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        width:70%
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

    .card-img-principal {
        width: 50vh;
        -webkit-animation: rebound .4s;
        animation: rebound .4s;
        -webkit-box-pack: center !important;
        -ms-flex-pack: center !important;
        justify-content: center !important
    }

    @media only screen and (max-width: 768px) {
        .card-img-principal {
            // max-width: 50vh;
            width: 45vh;
        }
    }

    // .scroll-page {
    //     overflow-x: scroll;
    //     overflow-y: scroll;
    // }

    .title-ref {
        text-transform: uppercase;
    }

    .produto-image-gallery {
        height: 32vh;
        overflow-x: hidden;
        overflow-y: scroll;    
    }

    .produto-image-gallery-item {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin: 0 -1rem;
        -webkit-box-pack: center !important;
        -ms-flex-pack: center !important;
        justify-content: center !important;
        -webkit-box-align: center !important;
        -ms-flex-align: center !important;
        align-items: center !important;

        .selected {
            border-radius: 2%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border-bottom: 2px solid #e41c40;
        }
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

    .categoria-filter {
        height: 42vh;
        overflow-x: hidden;
        overflow-y: scroll;  
    }

    .categoria-filter-item {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin: 0 -1rem;
        -webkit-box-pack: center !important;
        -ms-flex-pack: center !important;
        justify-content: center !important;
        -webkit-box-align: center !important;
        -ms-flex-align: center !important;
        align-items: center !important;

        .selected {
            border-radius: 2%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border-bottom: 2px solid #e41c40;
        }
    }

    .page-catalogo {
        top: 2rem;
    }

</style>