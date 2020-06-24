<template>
    <div id="page-montelook">
        <div class="vx-row" v-show="idSegmento">
            <!-- Produtos -->
            <div class="vx-col w-3/4">
                <vx-card>
                    <h4 v-b-toggle="'look'" class="m-1">Produtos do Look</h4>
                    <b-collapse :id="'look'" visible accordion="my-accordion" role="tabpanel">
                        <div v-for="(produto, index) in produtos" :key="index">
                            <monte-look-item
                                v-if="index != 2"
                                @atualiza-produtos="atualizarProdutos"
                                @mostrar-produtos-categorias="mostrarProdutosCategorias"
                                @set-cor-produto="setCorProduto"
                                v-model="produtos[index]"
                                :produtoSeq="index"
                                :disabledProdutos="categoriasSelecionadas[index].length <= 0"
                            />
                        </div>
                    </b-collapse>
                </vx-card>
                <vx-card v-if="acessorioView" class="mt-4">
                    <h3 v-b-toggle="'acessorio'" class="m-1">Acessórios</h3>
                    <b-collapse :id="'acessorio'" visible accordion="my-accordion" role="tabpanel">
                        <div>
                            <monte-look-item
                                @atualiza-produtos="atualizarProdutos"
                                @mostrar-produtos-categorias="mostrarProdutosCategorias"
                                @set-cor-produto="setCorProduto"
                                v-model="produtos[2]"
                                :produtoSeq="2"
                                :disabledProdutos="categoriasSelecionadas[2].length <= 0"
                            />
                        </div>
                    </b-collapse>
                </vx-card>
            </div>
            <!-- informações -->
            <div class="vx-col w-1/4">
                <div class="vx-row">
                    <vs-button color="dark" type="filled" class="w-full" icon="menu" @click.stop="showSidebar"></vs-button>
                    <vx-card class="mt-2">
                        <div class="vx-row" v-for="(produto, index) in produtos" :key="index">
                            <h6 v-if="index != 2"><b>Produto {{index+1}}: </b>{{produto.nome}}</h6>
                        </div>
                        <div class="vx-row" v-if="acessorioView">
                            <h6><b>Produto 3: </b>{{produtos[2].nome}}</h6>
                        </div>
                        <div class="vx-row">
                            <div class="btn-group centex mt-2 w-full">
                                <vs-button @click="addProduto" class="w-full" color="primary" icon="shopping_cart"></vs-button>
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
                                    :searchable=false
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
                                    :searchable=false
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
                    <td v-if="produto.corSelecionada" class="p-2 border border-solid d-theme-border-grey-light text-right">{{getPrecoRef(produto, 1) | moneyy}}</td>
                    <td v-if="produto.corSelecionada" class="p-2 border border-solid d-theme-border-grey-light text-right">{{getPrecoRef(produto, 2) | moneyy}}</td>
                </tr>
            </table>
        </vs-popup>
        

        <!-- popup Escolha o Segmento -->
        <fun-modal title="Escolha o Segmento" :active.sync="showModalSegmento" :button-close-hidden="true" :footer-hidden="true">
            <div slot="body">
                <div class="vx-row flex justify-center">
                    <div class="vx-col w-2/5" @click="setSegmento(segmento)" v-for="(segmento,index) in listaSegmentos" :key="index">
                        <vx-card color="rgb(123, 123, 123)" style="background-color:rgb(123, 123, 123);color:#fff" class="flex justify-center">
                            <h1 style="color:#fff">{{segmento.nome}}</h1>
                        </vx-card>
                    </div>
                </div>
            </div>
        </fun-modal>

        <!-- popup produtos -->
        <fun-modal title="Escolha o Produto" :active.sync="popupProdutosCategoria" :footer-hidden="true" :fullscreen="true">
            <div slot="body">
                <div class="vx-row flex justify-center">
                    <div class="vx-row ml-2">
                        <div class="mr-2 vx-row w-full montelook-lista-produtos" style="height: 85vh;">
                            <div class="vx-col px-1 lg:w-1/5 md:w-1/5 sm:w-1/4 mb-4" @click="setProduto(produto)" v-for="(produto, index) in listaProdutosPesquisa[posicaoProduto]" :key="index">
                                <vx-card class="w-full text-center cursor-pointer; height:100%;">
                                    <div slot="no-body" style="padding: 15px;">
                                        <b-card-text style="display:flex;align-items:center;justify-content:center;">
                                            <b-img-lazy :src="produto.imagemPrincipal ? produto.imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)" class="rounded user-latest-image responsive img-popup product-img"/>
                                        </b-card-text >
                                        <b-card-text style="padding:10px">
                                            <span class="vx-row" style="font-weight:bold">{{'Ref: ' + produto.referencia}}</span>
                                            <span class="vx-row" style="max-width: 10ch; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{produto.nome}}</span>
                                        </b-card-text>
                                    </div>
                                </vx-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fun-modal>
    </div>
</template>

<script>

    import MonteLookItem  from '../../rapidsoft/components/MonteLookItem';
    import CategoriaDB from '../../rapidsoft/db/categoriaDB';
    import ProdutoDB from '../../rapidsoft/db/produtoDB';
    import ProdutoUtils from '../../rapidsoft/utils/produtoUtils';
    import Segmento from '../../rapidsoft/db/segmentoDB';
    import vSelect from 'vue-select';

    
    export default {
        data: () => ({
            idSegmento: null,
            produtos:[{},{},{}],
            categoriasFiltro: [],
            categoriasSelecionadas: [[],[],[]],
            listaProdutosPesquisa: [],
            listaCores: [],
            popupPrecoRef: false,
            popupProdutosCategoria: false,
            popupCorProduto: false,
            listaSegmentos: [],
            mostrarCoresDisponiveis:false,
            posicaoProduto:null,
            acessorioView: false,
            showModalSegmento: false,
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
            showSidebar() {
                return this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
            },
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
                this.showModalSegmento = false;
                this.searchCategorias();
            },
            atualizarProdutos(produtos) {
                this.produtos = produtos;
                this.$forceUpdate();
            },
            addProduto() {
                const produtoA = this.produtos[0] && this.produtos[0].nome ? this.produtos[0] : undefined;
                const produtoB = this.produtos[1] && this.produtos[1].nome ? this.produtos[1] : undefined;
                const produtoC = this.produtos[2] && this.produtos[2].nome ? this.produtos[2] : undefined;
                const produtos = [produtoA,produtoB,produtoC];
                const pag = {pag: 1,produtoA: produtoA,produtos: produtos}
                if (produtoA !== undefined) {
                    this.$router.push({ name: 'carrinhoAdd', 
                        params: {produtos: produtos, tela: 'monteLook', pag: pag, paginas: {},viewCompleteLook: false}
                    });
                }
            },
            searchFindProduto(produto, index) {
                this.$vs.loading();
                const idsCategorias = this.categoriasSelecionadas[index].map((categoria) => categoria.id)
                ProdutoDB.getProdutosMonteLook(idsCategorias).then((result) => {
                    this.listaProdutosPesquisa[index] = result;
                    this.$vs.loading.close();
                });
            },
            searchCategorias() {
                this.categoriasSelecionadas = [[],[],[]];
                CategoriaDB.getAllBySegmento(this.idSegmento).then((categorias) => {
                    this.categoriasFiltro = this.lodash.cloneDeep(categorias);
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
                const gallery = document.getElementById("montelook-lista-produtos");
                gallery.scrollTop = gallery.scrollTop - 80;
            },
            scrollDown() {
                const gallery = document.getElementById("montelook-lista-produtos");
                gallery.scrollTop = gallery.scrollTop + 80;
            },
            getPrecoRef(produto, tipo) {
                return ProdutoUtils.calcularPreco(produto.cores[0], tipo)
            },
        },
        created() {
            this.showModalSegmento = true;
            this.carregaItensTela();
        },
        mounted() {
        },    
}

</script>

<style lang="scss">
    // html {
    //     position: fixed;
    //     width: 100%; 
    //     height: 100%
    // }
    
    // .produto-image-scroll{
    //     overflow-x: hidden;
    //     overflow-y: scroll;
    //     flex-wrap: nowrap;    
    // }

    .title-ref {
        text-transform: uppercase;
    }

    .montelook-lista-produtos {
        height: 32vh;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .page-montelook {
        margin-top: 2px;
    }

</style>