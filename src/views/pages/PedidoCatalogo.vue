<template>
    <div id="page-catalogo" class="page-catalogo">
        <div v-if="this.isShowing">
            <vs-button
                @click.stop="next"
                color="primary"
                type="filled"
                class="btn-left"
                icon-pack="feather"
                icon="icon-chevron-left"
            ></vs-button>
            <vs-button
                @click.stop="prev"
                color="primary"
                type="filled"
                class="btn-right"
                icon-pack="feather"
                icon="icon-chevron-right"
            ></vs-button>
        </div>
        <vs-col
            vs-type="block"
            vs-justify="center"
            vs-align="center"
            vs-w="12"
            style="margin-bottom: 2rem;"
        >
            <div class="vx-row">
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5 h-12" style="z-index: 50;">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button
                                color="dark"
                                type="filled"
                                icon-pack="feather"
                                class="w-full"
                                icon="icon-menu"
                                @click.stop="showSidebar"
                            ></vs-button>
                        </div>
                    </div>
                </div>
                <div class="vx-col w-full lg:w-3/5 sm:w-3/5 h-12">
                    <div
                        class="vx-row items-center justify-center"
                        style="margin-bottom: 2rem;"
                        v-if="this.isShowing"
                    >
                        <h1>{{this.catalogos[this.slide].nome}}</h1>
                    </div>
                </div>
                <div class="vx-col w-full sm:w-1/5 h-12">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button
                                color="primary"
                                type="filled"
                                icon-pack="feather"
                                class="w-full"
                                icon="icon-search"
                                @click.stop="abrirPesquisaCliente()"
                            ></vs-button>
                        </div>
                    </div>
                </div>
            </div>
        </vs-col>
        <div class="vx-col w-full h-12">
            <div class="vx-row justify-center">
                <div class="flex w-full items-center justify-center lg:w-1/2 md:w-full">
                    <div class="carousel-inner">
                        <div
                            id="carouselExampleIndicators"
                            class="carousel slide"
                            data-ride="carousel"
                            v-if="this.isShowing"
                        >
                            <b-carousel
                                no-animation
                                v-model="slide"
                                indicators
                                :interval="0"
                                ref="carrossel_catalogo"
                                style="width:100%; border-radius: 0.5rem !important;"
                            >
                                <b-carousel-slide 
                                    v-for="(catalogo, index) in getCatalogos" :key="`slide-to-${index}`" 
                                    style="width:100%" 
                                    class="img-catalogo responsive img-ref"
                                >
                                    <b-img slot="img" class="d-block img-fluid w-100" :src="catalogo.base64" alt="image slot" @click="selecionarCatalogo(catalogo)" fluid></b-img>
                                </b-carousel-slide>
                            </b-carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <search-cliente @search-selected="selectSearchCliente" :id="idPopUpSearch"></search-cliente>
    </div>
</template>

<script>

// import _ from 'lodash'
import SearchCliente  from '../../rapidsoft/components/SearchCliente'
import CatalogoDB from '../../rapidsoft/db/catalogoDB'
import ErrorDB from '../../rapidsoft/db/errorDB'
import GrupoClienteDB from '../../rapidsoft/db/grupoClienteDB'
import Storage from '../../rapidsoft/utils/storage'

export default {

	data() {
		return {
            isShowing: false,
			idPopUpSearch: 'popup-cliente-search',
			catalogos: [],
            grupoClientePadrao: null,
            slide: 0
		}
	},
	components: {
		SearchCliente,
	},
	computed: {
		getCatalogos() {
			return this.catalogos;
		}
	},
	methods: {
        prev() {
            this.titulo = this.catalogos[this.slide].nome;
            this.$refs.carrossel_catalogo.prev();
        },
        next() {
            this.titulo = this.catalogos[this.slide].nome;
            this.$refs.carrossel_catalogo.next();
        },
		selecionarCatalogo(catalogo) {
            this.isShowing = false;
            document.getElementById('loading-bg').style.display = null;
			const clientePedido = Storage.getClienteCarrinho();
			if (clientePedido && clientePedido.grupoCliente) {
                GrupoClienteDB.getById(clientePedido.grupoCliente).then((grupoCliente) => {
					Storage.setGrupoCarrinho(grupoCliente);
					this.carregarCatalogo(catalogo);
				});
			} else {
                Storage.setGrupoCarrinho(this.grupoClientePadrao);
				this.carregarCatalogo(catalogo);
			}
		},
		carregarCatalogo(catalogo) {
            Storage.setCatalogo(catalogo);
            setTimeout(() => {
				this.$router.push({ name: 'catalogoItem', params: {idCatalogo: catalogo.idCatalogo, idSegmento: catalogo.idSegmento }});
			}, 10);
		},
		showSidebar() {
            return this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
		abrirPesquisaCliente() {
			this.$bvModal.show(this.idPopUpSearch);
		},
		selectSearchCliente() {
			
        },
        buscaGrupoPadrao() {
            return new Promise((resolve) => {
                GrupoClienteDB.getGrupoPadrao().then((grupoClientePadrao) => {
                    this.grupoClientePadrao = grupoClientePadrao;
                    resolve();
                });
            });
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                CatalogoDB._getAll().then((catalogos) => {
                    this.catalogos = catalogos;
                    if (!Storage.existeClienteCarrinho()) {
                        this.abrirPesquisaCliente();
                    }
                    this.isShowing = true;
                    document.getElementById('loading-bg').style.display = "none";
                    resolve();
                });
            });
        }
	},
	beforeCreate() {
		document.getElementById('loading-bg').style.display = null;
	},
	async created() {
        await this.carregaItensTela();
	},
	beforeMount() {
        },
	async mounted() {
        await this.buscaGrupoPadrao();
	},
	updated() {
		
	},
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    }
}
</script>

<style lang="scss" scoped>
.carousel-inner {
    border-radius: 0.5rem !important;
}

.carousel-indicators-catalog {
    position: absolute;
    right: 0;
    top: 0;
    left: 0;
    z-index: 15;
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-pack: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding-left: 0;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
}

.carousel-indicators-catalog li {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    -ms-flex: 0 1 auto;
    -webkit-box-flex: 0;
    flex: 0 1 auto;
    width: 30px;
    height: 3px;
    margin-right: 3px;
    margin-left: 3px;
    text-indent: -999px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: 0.5;
    -webkit-transition: opacity 0.6s ease;
    transition: opacity 0.6s ease;
}

.carousel-indicators-catalog .active {
    opacity: 1;
    background-color: #ec1e1e;
}

.img-catalogo {
    max-height: 80vh;
    width: auto;
}

.title-catalog {
    font-family: inherit;
    font-weight: 500;
    line-height: 1.2;
    color: #ece6e6;
    font-size: 28px;
    text-shadow: 1px 0 0 #504f4f;
}
</style>
