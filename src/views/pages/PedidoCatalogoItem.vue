<template>
    <!-- Adicao de itens -->
    <div id="page-catalogo" class="page-catalogo">
        <div v-if="this.produtoA">
            <vs-button @click="$refs.CardProduto.decide('prev')" color="primary" type="filled" class="btn-left" icon="chevron_left"></vs-button>
            <vs-button @click="$refs.CardProduto.decide('next')" color="primary" type="filled" class="btn-right" icon="chevron_right"></vs-button>
            <vs-button @click.stop="abrirCarrinho" color="warning" type="filled" class="btn-carrinho" :disabled="existeCarrinho" icon="shopping_cart"></vs-button>
        </div>
        <vs-col vs-type="block" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-row">
                
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5 h-12" style="z-index: 60;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="dark" type="filled" icon-pack="feather" class="w-full" icon="icon-menu" @click.stop="showSidebar"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-4">
                        <vx-card>
                            <div class="vx-row items-center justify-center">
                                <h6>{{this.produtoA.cores[this.corSelecionada].nome}}</h6>
                            </div>
                            <feather-icon icon="ChevronUpIcon" class="produto-image-gallery-button mt-2 mb-2" @click="scrollUp" style="margin-top: -10px" />
                            <transition name="fade" mode="out-in">
                                <div id="produto-image-gallery" class="produto-image-gallery on-scroll" v-if="getImagensCorProduto.length > 0">
                                    <div class="produto-image-gallery-item" v-for="(imagem, index) in getImagensCorProduto" :key="index" @click="selectSequenciaImagemProduto(index)">
                                        <b-img-lazy :src="imagem.base64" :id="'produto-image-gallery-item-'+imagem.seq" class="mb-4 responsive img-ref"/>
                                    </div>
                                </div>
                                <div id="produto-image-gallery" class="produto-image-gallery on-scroll" v-else>
                                    <div class="produto-image-gallery-item">
                                        <b-img-lazy :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="mb-4 responsive img-ref"/>
                                    </div>
                                </div>
                            </transition>
                            <feather-icon icon="ChevronDownIcon" class="produto-image-gallery-button" @click="scrollDown" style="margin-bottom: -10px; margin-top: 10px" />
                        </vx-card>
                    </div>
                    <div class="vx-row items-center justify-center mt-6">
                        <div class="mr-2" v-for="(cor, index) in getCoresProduto" :key="index">
                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="cor.imagemCor ? cor.imagemCor : require(`@/assets/images/rapidsoft/no-image.jpg`)" size="36px" @click="selectCorImagemProduto(index)" style="border: 0.9px solid #7b7b7b;"/>
                        </div>
                    </div>
                    <div class="vx-row items-center justify-center mt-4">
                        <div class="btn-group centex w-full" >
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-youtube" @click.stop="showVideo()" v-if="this.produtoA.video && false"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-zoom-in" @click.stop="showZoom()"></vs-button>
                        </div>
                    </div>
                </div>
                <!-- IMAGEM PRINCIPAL -->
                <div class="vx-col w-full lg:w-3/5 sm:w-3/5 h-12" style="z-index: 5;" v-if="this.produtoA">
                    <div class="vx-row items-center justify-center" v-if="this.cliente">
                        <div class="truncate">
                            <h6>CLIENTE: {{this.cliente.nome}}</h6>
                        </div>
                    </div>
                    <div class="vx-row items-center justify-center" style="z-index: 15; margin-bottom: 2rem;">
                        <h6 class="title-ref">{{produtoA.referencia}} - {{produtoA.nome}}</h6>
                    </div>
                        <div id="pass-image">
                            <CardProduto
                                ref="CardProduto"
                                key-name="id"
                                :queue.sync="imagemPass"
                                :max="1"
                                :offset-y="5"
                                @submit="onSubmit">
                                <template slot-scope="scope">
                                    <div v-if="scope.data.base64 !== null">
                                        <b-img-lazy center :src="scope.data.base64" class="card-img-principal"/>
                                    </div>
                                    <div v-else>
                                        <b-img-lazy center :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="card-img-principal"/>
                                    </div>
                                </template>
                            </CardProduto>
                        </div>
                    <div class="vx-row items-center justify-center" style="z-index: 15; margin-top: 2rem;" v-if="this.produtoB">
                        <h6 class="title-ref">{{produtoB.referencia}} - {{produtoB.nome}}</h6>
                        <h6 class="title-ref" v-if="this.produtoC">{{produtoC.referencia}} - {{produtoC.nome}}</h6>
                    </div>
                </div>
                <!-- IMAGEM PRINCIPAL FIM -->
                <div class="vx-col w-full md:w-1/5 sm:w-1/5 h-12" style="z-index: 60;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="primary" type="filled" icon-pack="feather" class="w-full" icon="icon-search" @click.stop="abrirPesquisaPodutos()"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-6">
                        <h6 class="title-ref" v-if="this.produtoA">Ref: {{produtoA.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoB">Ref: {{produtoB.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoC">Ref: {{produtoC.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoD">Ref: {{produtoD.referencia}}</h6>
                        <div class="btn-group centex mt-2 w-full">
                            <vs-button class="w-full" color="primary" icon="shopping_cart" @click.stop="addProduto()"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" size="36px" icon="attach_money" @click="popupPrecoRef=true"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-6">
                        <vx-card>
                            <div slot="no-body">
                                <div class="vx-row items-center justify-center mt-3 mb-2" role="tab" v-b-toggle.accordion-1> 
                                    <feather-icon icon="FilterIcon" class="cursor-pointer mr-1" svgClasses='h-4 w-4'/>
                                    Categorias
                                </div>
                                <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                                    <feather-icon icon="ChevronUpIcon" class="produto-image-gallery-button mt-2" @click="scrollUpCategoria" />
                                    <div id="categoria-filter" class="categoria-filter on-scroll">
                                        <div class="categoria-filter-item">
                                            <div class="mt-2 flex justify-center" style="width:77%">
                                                <button class="w-full" :class="filtro.categoria ? 'notHaveFilter' : 'input_filter'" @click.stop="categoriasSelecionadas(null)">
                                                    <p class="flex justify-center" style="margin:auto">Todos</p>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="categoria-filter-item" v-for="(categoria, index) in getCategoriasCatalogo" :key="index">
                                            <div class="mt-2 flex justify-center" style="width:77%">
                                                <button class="w-full" :class="categoria.id === filtro.categoria ? 'input_filter' : 'notHaveFilter'" @click.stop="categoriasSelecionadas(categoria.id)">
                                                    <p class="flex justify-center" style="margin:auto">{{categoria.nome}}</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <feather-icon icon="ChevronDownIcon" class="produto-image-gallery-button mt-2 mb-2" @click="scrollDownCategoria" />
                                </b-collapse>
                            </div>
                        </vx-card>
                    </div>
                </div>
            </div>
        </vs-col>
        <search-produto @search-selected="selectSearchProduto" :id="idPopUpSearch"></search-produto>
        <div id="zoom-produto" v-if="this.produtoZoomShow">
            <zoom-produto @zoom-closed="hideZoom" :produtoZoom="this.produtoZoom" :produtoImagens="this.produtoZoom.cores[this.corSelecionada].imagens" :id="idPopUpZoom"></zoom-produto>
        </div>
        <vs-popup title="Preço das Referências" :active.sync="popupPrecoRef" :button-close-hidden="false">
            <table style="width:100%" class="border-collapse">
                <tr>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Ref.</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Nome</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sell In</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sell Out</th>
                </tr>
                <tr v-if="this.produtoA">
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{this.produtoA.referencia}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{this.produtoA.nome}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{this.getPrecoRef(this.produtoA, 1) | moneyy}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{this.getPrecoRef(this.produtoA, 2) | moneyy}}</td>
                </tr>
                <tr v-if="this.produtoB">
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{this.produtoB.referencia}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{this.produtoB.nome}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{this.getPrecoRef(this.produtoB, 1) | moneyy}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{this.getPrecoRef(this.produtoB, 2) | moneyy}}</td>
                </tr>
                <tr v-if="this.produtoC">
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{this.produtoC.referencia}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{this.produtoC.nome}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{this.getPrecoRef(this.produtoC, 1) | moneyy}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{this.getPrecoRef(this.produtoC, 2) | moneyy}}</td>
                </tr>
            </table>
        </vs-popup>
    </div>    
</template>
<script>

import CardProduto from '../../components/vue-tinder/Tinder.vue';
import ProdutoDB from '../../rapidsoft/db/produtoDB';
import ImagemDB from '../../rapidsoft/db/imagemDB';
import ProdutoUtils from '../../rapidsoft/utils/produtoUtils';
import Storage from '../../rapidsoft/utils/storage';
import ErrorDB from '../../rapidsoft/db/errorDB';
import vSelect from 'vue-select';

export default {

    data() {
        return {
            idSegmento: null,
            produtoA: null,
            produtoB: null,
            produtoC: null,
            produtoD: null,
            produtoSearch: null,
            produtoAddOpen: false,
            filtro: {
                categoria: null,
            },
            corSelecionada: 0,
            imagens: [],
            paginaAtual: null,
            paginas: [],
            produtoZoom: null,
            popupZoomProduto: false,
            disabledInputCor: [],
            disabledInputTamanho: [],
            listaProdutosPesquisa: [],
            idPopUpSearch: 'popup-produto-search',
            idPopUpZoom: 'popup-produto-zoom',
            produtoZoomShow: false,
            grupoCliente: null,
            cliente: null,
            popupPrecoRef: false,

            imagemPass: [],
        }
    },
    components: {
        'v-select': vSelect,
        CardProduto,
        SearchProduto: () => ({
            component: import('../../rapidsoft/components/SearchProduto'),
            delay: 1000,
            timeout: 3000
        }),
        ZoomProduto: () => ({
            component: import('../../rapidsoft/components/ZoomProduto'),
            delay: 500,
            timeout: 3000
        }),
    },
    watch: {
        
    },
    computed: {
        getSegmentosSearch() {
            return this.segmentosFiltro.map((segmento) => {
                return segmento;
            });
        },
        getCategoriasCatalogo() {
            return this.paginas.categorias.map((categoria) => {
                return categoria;
            });
        },
        getImagensCorProduto() {
            if (this.produtoA && this.produtoA.cores[this.corSelecionada].imagens.length > 0) {
                return this.produtoA.cores[this.corSelecionada].imagens;
            } else {
                return [];
            }
        },        
        getCoresProduto() {
            if (this.produtoA) {
                return this.produtoA.cores;
            } else {
                return [];
            }
        },        
         existeCarrinho() {
            return !Storage.existeCarrinho();
        },

    },
    methods: {
        // tela
        async onSubmit(item) {
            if (item.type === "prev") {
                 const anterior = this.paginas.findIndex((pagina) => pagina.pag === this.paginaAtual.pag )-1;
                if (anterior >= 0) await this.selectProduto(this.paginas[anterior],item.type);
                else await this.selectProduto(this.paginas[this.paginas.length-1],item.type);
            } else if (item.type === "next") {
                const proxima = this.paginas.findIndex((pagina) => pagina.pag === this.paginaAtual.pag )+1;
                if (proxima < this.paginas.length) await this.selectProduto(this.paginas[proxima],item.type);
                else await this.selectProduto(this.paginas[0],item.type);
            } else {
                this.addProduto();
            }
        },
        async categoriasSelecionadas(idCategoria) {
            this.setFiltroCategoria(idCategoria);
            await this.carregaItensTela();
        },
        getPrecoRef(produto, tipo) {
            return ProdutoUtils.calcularPreco(produto.cores[0], tipo)
        },       
        selectCorImagemProduto(indexCor) {
            this.corSelecionada = indexCor;
            this.selectSequenciaImagemProduto(0);
        },
        selectSequenciaImagemProduto(imagemSelecionada) {        
            this.imagemPass = [{id: 1, base64: this.getImagemCorProduto(imagemSelecionada)}];
        },
        getImagemCorProduto(imagem) {
            var cor = Object.assign(this.produtoA.cores[this.corSelecionada]);
            if (cor.imagens.length > 0) {
                return cor.imagens[imagem].base64;
            } else {
                return null;
            }

        },
        scrollUp() {
            const gallery = document.getElementById("produto-image-gallery");
            gallery.scrollTop = gallery.scrollTop - 80;
        },
        scrollDown() {
            const gallery = document.getElementById("produto-image-gallery");
            gallery.scrollTop = gallery.scrollTop + 80;
        },
        scrollUpCategoria() {
            const gallery = document.getElementById("categoria-filter");
            gallery.scrollTop = gallery.scrollTop - 80;
        },
        scrollDownCategoria() {
            const gallery = document.getElementById("categoria-filter");
            gallery.scrollTop = gallery.scrollTop + 80;
        },
        showSidebar() {
            return this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
        showZoom() {
            this.produtoZoom = Object.assign(this.produtoA);
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
            this.setFiltroCategoria(this.filtro.categoria);
            const produtos = [this.produtoA, this.produtoB, this.produtoC];
            this.$router.push({ name: 'carrinhoAdd', 
                params: {produtos: produtos, tela: 'catalogoItem', pag: this.paginaAtual, paginas: this.paginas}
            });
        },
        selectProduto(pagina, sentido="next") {
            return new Promise((resolve) => {
                this.$vs.loading();
                setTimeout(() => {
                    try{
                        this.paginaAtual = pagina;
                        ProdutoDB.getProdutoPaginaCatalogo(pagina).then((result) => {
                            this.popupSearchProdutos = false;
                            this.produtoA = result.produtoA;
                            this.produtoB = result.produtoB;
                            this.produtoC = result.produtoC;
                            ImagemDB.getFotoPrincipal(this.produtoA).then((result) => {
                                this.imagemPass = [{id: 1, base64: result}];
                                this.corSelecionada = 0;
                                document.getElementById("produto-image-gallery").scrollTop = 0;
                            });
                        }).catch((error) => {
                            console.log('catch',error,pagina);
                            this.$vs.notify({
                                title: `Erro ao acessar a página ${pagina.pag} do catalogo.`,
                                text: error,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                position:'bottom-center'
                            });
                            if (sentido === "prev") {
                                const anterior = this.paginas.findIndex((pagina) => pagina.pag === this.paginaAtual.pag )-1;
                                if (anterior >= 0) this.selectProduto(this.paginas[anterior],sentido);
                                else this.selectProduto(this.paginas[this.paginas.length-1],sentido);
                            } else if (sentido === "next") {
                                const proxima = this.paginas.findIndex((pagina) => pagina.pag === this.paginaAtual.pag )+1;
                                if (proxima < this.paginas.length) this.selectProduto(this.paginas[proxima],sentido);
                                else this.selectProduto(this.paginas[0],sentido);
                            }
                        });
                    } finally {
                        this.$vs.loading.close();
                        resolve();
                    }
                }, 100);
            });
        },
        selectSearchProduto(produto) {
            this.popupAddProduto = false;
            ProdutoUtils.addProdutoSearchFromPages(this.paginas, produto).then((paginas) => {
                this.$bvModal.hide(this.idPopUpSearch);
                this.paginas = paginas;  
                this.selectProduto(this.paginas[this.paginas.length-1]);
            });
        },
        abrirCarrinho() {
            this.$router.push({ name: 'carrinho', params: {tela: 'catalogoItem'}});
        },
        setFiltroCategoria(idCategoria) {
            this.filtro.categoria = idCategoria ? idCategoria : null;
            localStorage.setItem("filtro_categoria", JSON.stringify(this.filtro.categoria));
        },
        getFiltroCategoria() {
            const filtroCategoria = JSON.parse(localStorage.getItem("filtro_categoria"));
            this.filtro.categoria = filtroCategoria ? filtroCategoria : null;
            return this.filtro.categoria;
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                this.paginaAtual = this.$route.params.pag ? this.$route.params.pag : null;
                ProdutoDB.getPaginasCatalogo(this.getFiltroCategoria()).then((paginas) => {
                    this.cliente = Storage.getClienteCarrinho();
                    this.paginas = paginas;
                    this.paginaAtual = this.paginaAtual ? this.paginaAtual : paginas[0];
                    this.$route.params.pag = null;
                    this.selectProduto(this.paginaAtual).then(() => {
                        document.getElementById('loading-bg').style.display = "none";
                        resolve();
                    });
                });
            });
        }
    },
    beforeCreate() {
        
    },
    created() {
        this.paginaAtual = this.$route.params.pag ? this.$route.params.pag : null;
        const catalogo = Storage.getCatalogo();
        if (catalogo == null || catalogo.idCatalogo == null) {
            this.$router.push('/catalogo');
        }
    },
    beforeMount() {
        
    },
    async mounted() {
        this.grupoCliente = Storage.getGrupoCarrinho();
        await this.carregaItensTela();
        document.getElementById("page-catalogo").ontouchmove = (e) => {
            if(!(e.target.className == "no-scroll" || e.target.className == "mb-4 responsive img-ref")) {
                e.preventDefault();
            }
        }       
    },
    beforeDestroy() {
        
    },    
    async errorCaptured(err, vm, info) {
        await ErrorDB._criarLog({err, vm, info});
        return true;
    }
}
</script>

<style lang="scss" scoped>


#pass-image .vue-tinder {
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  top: 5.5rem;
  margin: auto;
  width: 60vw;
  height: 75vh;
  min-width: 300px;
  max-width: 470px;
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