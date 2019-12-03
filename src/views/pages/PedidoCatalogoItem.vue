<template>
    <!-- Adicao de itens -->
    <div id="page-catalogo-add" class="page-catalogo-add" v-if="popupAddProduto">
        <add-item-carrinho @show-add-carrinho="showAddCarrinho(false)" :produtoAdd="this.produtoAdd"></add-item-carrinho>
    </div>
    <div id="page-catalogo" class="page-catalogo" v-else>
        <div v-if="this.produtoA">
            <vs-button @click.stop="prevRef" color="primary" type="filled" class="btn-left" icon="chevron_left"></vs-button>
            <vs-button @click.stop="nextRef" color="primary" type="filled" class="btn-right" icon="chevron_right"></vs-button>
            <vs-button @click.stop="abrirCarrinho" color="warning" type="filled" class="btn-carrinho" icon="card_travel"></vs-button>
        </div>
        <vs-col vs-type="block" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-row">
                
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5 h-12" style="z-index: 50;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="dark" type="filled" icon-pack="feather" class="w-full" icon="icon-menu" @click.stop="showSidebar"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top2">
                        <vx-card>
                            <div class="vx-row items-center justify-center">
                                <h6>{{this.produtoA.cores[this.corSelecionada].nome}}</h6>
                            </div>
                            <feather-icon icon="ChevronUpIcon" class="produto-image-gallery-button produto-image-gallery-button-up" @click="scrollUp" style="margin-top: -10px" />
                            <div id="produto-image-gallery" class="produto-image-gallery" v-if="getImagensCorProduto.length > 0">
                                <div class="produto-image-gallery-item" v-for="(imagem, index) in getImagensCorProduto" :key="index" @click="selectSequenciaImagemProduto(index)">
                                    <img :src="imagem.base64" :id="'produto-image-gallery-item-'+imagem.seq" class="mb-4 responsive img-ref">
                                </div>
                            </div>
                            <div id="produto-image-gallery" class="produto-image-gallery" v-else>
                                <div class="produto-image-gallery-item">
                                    <img :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="mb-4 responsive img-ref">
                                </div>
                            </div>
                            <feather-icon icon="ChevronDownIcon" class="produto-image-gallery-button produto-image-gallery-button-down" @click="scrollDown" style="margin-bottom: -10px; margin-top: 10px" />
                        </vx-card>
                    </div>
                    <div class="vx-row items-center justify-center mt-base-top3">
                        <div class="mr-2" v-for="(cor, index) in getCoresProduto" :key="index">
                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="cor.imagemCor" size="36px" @click="selectCorImagemProduto(index)" v-if="cor.imagemCor" style="border: 0.9px solid #7b7b7b;"/>
                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" size="36px" @click="selectCorImagemProduto(index)" style="border: 0.9px solid #7b7b7b;" v-else/>
                        </div>
                    </div>
                    <div class="vx-row items-center justify-center mt-base-top2">
                        <div class="btn-group centex w-full" >
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-youtube" @click.stop="showVideo()" v-if="this.produtoA.video && false"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-zoom-in" @click.stop="showZoom()"></vs-button>
                        </div>
                    </div>
                </div>
                <!-- IMAGEM PRINCIPAL -->
                <div class="vx-col w-full lg:w-3/5 sm:w-3/5 h-12" style="z-index: 10;" v-if="this.produtoA">
                    <div class="vx-row items-center justify-center" style="z-index: 15; margin-bottom: 2rem;">
                        <h6 class="title-ref">{{produtoA.referencia}} - {{produtoA.nome}}</h6>
                    </div>
                    <Vue2InteractDraggable
                        class="vx-row items-center justify-center"
                        @draggedLeft="nextRef"
                        @draggedRight="prevRef"
                        interact-lock-y-axis
                        :interact-max-rotation="8"
                        :interact-out-of-sight-x-coordinate="1000"
                        :interact-x-threshold="120"                         
                        v-if="isShowing">
                        <div>
                            <img :src="imagemProdutoPrincipal" class="card-img-principal" id="produto-swipe-area" v-if="imagemProdutoPrincipal"/>
                            <img :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="card-img-principal" v-else>
                        </div>
                    </Vue2InteractDraggable>
                    <div class="vx-row items-center justify-center" style="z-index: 15; margin-top: 2rem;" v-if="this.produtoB">
                        <h6 class="title-ref">{{produtoB.referencia}} - {{produtoB.nome}}</h6>
                    </div>
                </div>
                <div class="vx-col w-full md:w-1/5 h-12" style="z-index: 50;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="primary" type="filled" icon-pack="feather" class="w-full" icon="icon-search" @click.stop="abrirPesquisaPodutos()"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top3">
                        <h6 class="title-ref" v-if="this.produtoA">Ref A: {{produtoA.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoB">Ref B: {{produtoB.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoC">Ref C: {{produtoC.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoD">Ref D: {{produtoD.referencia}}</h6>
                        <div class="btn-group centex mt-base-top1 w-full">
                            <vs-button class="w-full" color="primary" icon="add_circle" @click.stop="addProduto()"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" size="36px" icon="attach_money" @click.stop="viewPreco()"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top2">
                    </div>
                </div>
            </div>

        </vs-col>
        <search-produto @search-selected="selectSearchProduto" :id="idPopUpSearch"></search-produto>
        <div id="zoom-produto" v-if="this.produtoZoomShow">
            <zoom-produto @zoom-closed="hideZoom" :produtoZoom="this.produtoZoom" :produtoImagens="this.produtoZoom.cores[this.corSelecionada].imagens" :id="idPopUpZoom"></zoom-produto>
        </div>
    </div>    
</template>
<script>

import { Vue2InteractDraggable } from "vue2-interact";
import _ from 'lodash'
import ProdutoDB from '../../rapidsoft/db/produtoDB'
import ImagemDB from '../../rapidsoft/db/imagemDB'
import ProdutoUtils from '../../rapidsoft/utils/produtoUtils'
import Storage from '../../rapidsoft/utils/storage'
import UtilMask from '../../rapidsoft/utils/utilMask'
import AddItemCarrinho  from '../../rapidsoft/components/AddItemCarrinho'
import SearchProduto  from '../../rapidsoft/components/SearchProduto'
import ZoomProduto  from '../../rapidsoft/components/ZoomProduto'
import ErrorDB from '../../rapidsoft/db/errorDB'

export default {

    data() {
        return {
            idSegmento: null,
            clientePedido: null,
            imagemProdutoPrincipal: null,
            produtoA: null,
            produtoB: null,
            produtoC: null,
            produtoD: null,
            produtoSearch: null,
            popupAddProduto: false,
            produtoAdd: {
                produtoA: {
                    cores:[]
                },
                produtoB: {
                    cores:[]
                }
            },
            produtoAddOpen: false,
            filtro:{
                categoria: 0
            },
            corSelecionada: 0,
            imagens: [],
            paginaAtual: null,
            paginas: [],
            paginasProduto: [],
            produtosFiltro: [],
            isShowing: true,
            produtoZoom: null,
            popupZoomProduto: false,
            disabledInputCor: [],
            disabledInputTamanho: [],
            listaProdutosPesquisa: [],
            idPopUpSearch: 'popup-produto-search',
            idPopUpZoom: 'popup-produto-zoom',
            produtoZoomShow: false,
            grupoCliente: null,
        }
    },
    components: {
        Vue2InteractDraggable,
        AddItemCarrinho,
        SearchProduto,
        ZoomProduto,
    },
    watch: {
    },
    computed: {
        // getProdutosPesquisa() {
        //     return this.produtos.filter((produto) => {
        //         return this.getCategoriasCardPesquisa.some((categoria) => {
        //             return categoria.check && produto.hasOwnProperty('categoria') && produto.categoria.hasOwnProperty('codigo') && produto.categoria.codigo == categoria.codigo;
        //         });
        //     });
        // },
        getSegmentosSearch() {
            return this.segmentosFiltro.map((segmento) => {
                return segmento;
            });
        },
        getCategoriasSearch() {
            return this.categoriasFiltro.map((categoria) => {
                return categoria;
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
    },
    methods: {
        // tela
        viewPreco() {
            let texto = 'REF A: ' +this.calcularPrecoProduto(this.produtoA);
            if (this.produtoB) {
                texto += '<br> REF B: ' +this.calcularPrecoProduto(this.produtoB);
            }

            this.$vs.notify({
                title: 'Preço Referência',
                text: texto,
                color:'dark',
                time: 4000,
                iconPack: 'feather',
                icon:'icon-dollar-sign'
            })
        },
        calcularPrecoProduto(produto) {
            const percentual = _.toNumber(this.grupoCliente.porcentagem);
            const precoProduto = produto.cores[this.corSelecionada].precoVenda;
            const preco = _.round(precoProduto + ((percentual/100) * precoProduto), 2)
            return UtilMask.getMoney(preco, true);

        },
        selectCorImagemProduto(indexCor) {
            this.corSelecionada = indexCor;
            this.selectSequenciaImagemProduto(0);
        },
        selectSequenciaImagemProduto(imagemSelecionada) {        
            this.imagemProdutoPrincipal = this.getImagemCorProduto(imagemSelecionada);
        },
        getImagemCorProduto(imagem) {
            var cor = _.cloneDeep(this.produtoA.cores[this.corSelecionada]);
            return cor.imagens[imagem].base64;
        },
        scrollUp() {
            let gallery = document.getElementById("produto-image-gallery");
            gallery.scrollTop = gallery.scrollTop - 80;
        },
        scrollDown() {
            let gallery = document.getElementById("produto-image-gallery");
            gallery.scrollTop = gallery.scrollTop + 80;
        },
        hideCard() {
            setTimeout(() => {
                this.isShowing = false;
            }, 100);
            setTimeout(() => {
                this.isShowing = true;
            }, 110);
            this.$forceUpdate();
        },
        prevRef() {
            const anterior = _.findIndex(this.paginas, (pagina) => { return pagina.pag === this.paginaAtual.pag })-1;
            if (anterior >= 0) {
                this.selectProduto(this.paginas[anterior]);
            } else {
                this.selectProduto(this.paginas[this.paginas.length-1]);
            }
            document.getElementById("produto-image-gallery").scrollTop = 0;
            this.corSelecionada = 0;
            this.hideCard();
        },
        nextRef() {
            const proxima = _.findIndex(this.paginas, (pagina) => { return pagina.pag === this.paginaAtual.pag })+1;
            if (proxima < this.paginas.length) {
                this.selectProduto(this.paginas[proxima]);
            } else {
                this.selectProduto(this.paginas[0]);
            }
            document.getElementById("produto-image-gallery").scrollTop = 0;
            this.corSelecionada = 0;
            this.hideCard();
        },
        showSidebar() {
            return this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
        showZoom() {
            this.produtoZoom = _.cloneDeep(this.produtoA);
            this.produtoZoomShow = true;
            setTimeout(() => {
                this.$bvModal.show(this.idPopUpZoom)
            }, 150);
        },
        hideZoom() {
            this.produtoZoomShow = false;
        },
        showVideo() {

        },
        abrirPesquisaPodutos() {
            this.produtoSearch = null;
            this.popupSearchProdutos=true
            this.$bvModal.show(this.idPopUpSearch);
        },
        addProduto() {
            this.produtoAdd = {
                produtoA: this.produtoA,
                produtoB: this.produtoB
            };
            this.popupAddProduto = true;
        },
        showAddCarrinho(show) {
            this.popupAddProduto = show;
            this.produtoAdd=null;
        },
        selectProduto(pagina) {
            this.$vs.loading();
            this.paginaAtual = pagina;
            ProdutoDB.getProdutoPaginaCatalogo(pagina).then((result) => {
                this.popupSearchProdutos = false;
                this.produtoA = result.produtoA;
                this.produtoB = result.produtoB;
                ImagemDB.getFotoPrincipal(this.produtoA).then((result) => {
                    this.imagemProdutoPrincipal = result;
                    this.corSelecionada = 0;
                    this.$vs.loading.close();
                })
            })
        },
        selectSearchProduto(produto) {
            ProdutoUtils.addProdutoSearchFromPages(this.paginas, produto).then((paginas) => {
                this.$bvModal.hide(this.idPopUpSearch);
                this.paginas = paginas;                
                this.selectProduto(this.paginas[this.paginas.length-1]);
            })
        },
        abrirCarrinho() {
            this.$router.push({ name: 'carrinho'});
        },
    },
    beforeCreate() {
        if (this.$route.params.idCatalogo) {
            document.getElementById('loading-bg').style.display = null;
            ProdutoDB.getPaginasCatalogo(this.$route.params.idCatalogo).then(paginas => {
                this.paginas = paginas;
                this.selectProduto(paginas[0]);
                document.getElementById('loading-bg').style.display = "none";
            });
        } else {
            this.$router.push('/catalogo');
        }
    },
    created() {
        console.log('created');
    },
    beforeMount() {
        this.grupoCliente = _.clone(Storage.getGrupoCarrinho());
        console.log('beforeMount');
    },
    mounted() {
        // document.getElementById('loading-bg').style.display = "none";
        document.getElementById("page-catalogo").ontouchmove = (e) => {
            if(!(e.target.className == "produto-image-gallery-item" || e.target.className == "mb-4 responsive img-ref")) {
                e.preventDefault();
            }
        }       
    },

    errorCaptured(err, vm, info) {
        ErrorDB.criarLog({err, vm, info});
        return true;
    }
}
</script>

<style lang="scss" scoped>

html {
  position: fixed;
  width: 100%; 
  height: 100%
}

// .page-catalogo{
//   -webkit-overflow-scrolling: touch;
// }

.mt-base-bottom {
    margin-bottom: 2rem !important
}

.mt-base-top3 {
    margin-top: 2rem !important
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

.produto-image-gallery::-webkit-scrollbar-track
{
	background-color: #fff;
}

.produto-image-gallery::-webkit-scrollbar
{
	width: 4px;
    height: 10px;
	background-color: #fff;
}

.produto-image-gallery::-webkit-scrollbar-thumb
{
	background-color: #fff;    
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

.page-catalogo {
    top: 2rem;
}


</style>