<template>
    <div id="page-customer">
        <div class="vx-row">
            <div class="vx-col w-3/4 mt-4">
                <monte-look-item
                    @atualiza-produtos="atualizarProdutos"
                    :produtos="produtos"
                    :segmento="segmento"
                    :listaProdutosCategoria="listaProdutosPesquisa"
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
                                <vs-button @click="addProduto" class="w-full" color="primary" icon="add_circle"></vs-button>
                                <vs-button @click="popupPrecoRef=true" class="w-full" color="rgb(123, 123, 123)" size="36px" icon="attach_money"></vs-button>
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
                        <div class="vx-row">
                            <div class="vx-col w-full mt-6">
                                <vs-button class="w-full" color="primary" icon="add_circle">Acessório</vs-button>
                            </div>
                        </div>
                    </vx-card>
                </div>
            </div>
        </div>
        <vs-popup title="Preço das Referências" :active.sync="popupPrecoRef" :button-close-hidden="false">
            <table style="width:100%" class="border-collapse">
                <tr>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Ref.</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Nome</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sell In</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sell Out</th>
                </tr>
                <tr>
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{produtos[0].referencia}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{produtos[0].nome}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{produtos[0].corSelecionada ? produtos[0].corSelecionada.precoCusto : ''}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{produtos[0].corSelecionada ? produtos[0].corSelecionada.precoVenda : ''}}</td>
                </tr>
            </table>
        </vs-popup>
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
            produtos:[{},{},],
            categoriasFiltro: [],
            categoriasSelecionadas: [],
            listaProdutosPesquisa: [],
            popupPrecoRef: false,
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
            atualizarProdutos(produtos) {
                this.produtos = produtos;
                this.$forceUpdate();
            },
            addProduto() {
                const produtos = [this.produtos[0]];
                console.log('this.$route.params ',this.$route.params);
                const paginaAtual = this.$route.params.pag;
                const paginas = this.$route.params.paginas
                console.log('Add Produto ',produtos);
                this.$router.push({ name: 'carrinhoAdd', 
                    params: {produtos: produtos, tela: 'catalogoItem', pag: paginaAtual, paginas: paginas}
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
            this.segmento = this.$route.params.segmento;
            this.searchCategorias();
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