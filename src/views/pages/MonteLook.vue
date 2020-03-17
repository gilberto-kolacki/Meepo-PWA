<template>
    <div id="page-customer">
        <div class="vx-row">
                <div class="vx-col w-3/4 mt-4">
                    <monte-look-item 
                        :produtos="produtos"
                        :segmento="segmento"
                    />
                </div>
            <div class="vx-col w-1/4">
                <div class="vx-row mt-4">
                    <vx-card>
                        <div class="vx-row" v-for="(produto, index) in produtos" :key="index">
                            <h6><b>Produto {{index+1}}: </b>{{produto.nome}}</h6>
                        </div>
                        <div class="vx-row">
                            <div class="btn-group centex mt-2 w-full">
                                <vs-button class="w-full" color="primary" icon="add_circle"></vs-button>
                                <vs-button class="w-full" color="rgb(123, 123, 123)" size="36px" icon="attach_money"></vs-button>
                            </div>
                        </div>
                    </vx-card>
                </div>
                <div class="vx-row mt-4">
                    <vx-card>
                        <div class="vx-row" v-for="(produto, index) in produtos" :key="index">
                            <div class="vx-col w-full mb-2">
                                <label for="segmentoFiltro" class="vs-input--label">Categorias Produto {{index + 1}}</label>
                                <v-select
                                    @input="searchFindProduto(produto)"
                                    multiple 
                                    id="categoriaFiltro" 
                                    name="segmento"
                                    v-model="produto.categoriasSelecionadas"
                                    label="nome" 
                                    :options="getCategoriasSearch"
                                />
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col w-full mt-6">
                                <vs-button class="w-full" color="primary" icon="add_circle">Acessório</vs-button>
                            </div>
                        </div>
                    </vx-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import MonteLookItem  from '../../rapidsoft/components/MonteLookItem';
    import CategoriaDB from '../../rapidsoft/db/categoriaDB';
    import ProdutoDB from '../../rapidsoft/db/produtoDB';
    import vSelect from 'vue-select';
    import _ from 'lodash';

    export default {
        data: () => ({
            segmento: null,
            produtos:[
                {},
                {},
            ],
            categoriasFiltro: [],
            categoriasSelecionadas: [],
            listaProdutosPesquisa: [],
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
            searchFindProduto(produto) {
                const idsCategorias = produto.categoriasSelecionadas.map((categoria) => {return categoria.id})
                ProdutoDB.getProdutosSearch(idsCategorias).then((result) => {
                    this.listaProdutosPesquisa = result;
                    produto.listaProdutosCategoria = this.listaProdutosPesquisa;
                });
            },
            searchCategorias() {
                this.categoriasSelecionadas = [];
                CategoriaDB.getAllBySegmento(this.segmento).then((categorias) => {
                    this.categoriasFiltro = _.cloneDeep(categorias);
                    this.$vs.loading.close('#div-with-loading-search > .con-vs-loading');
                });
            },
            carregaItensTela() {
                return new Promise((resolve) => {
                    resolve();
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
            this.segmento = 3;
            this.searchCategorias();
        },
        mounted() {
            console.log('mounted');
        },    
}

</script>

<style lang="scss">
    html {
        position: fixed;
        width: 100%; 
        height: 100%
    }
    .produto-image-scroll{
        overflow-x: hidden;
        overflow-y: scroll;
        flex-wrap: nowrap;    
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