<template>
	<div id="page-catalogo" class="page-catalogo">
		<vs-button @click.stop="prevSlide" color="primary" type="filled" radius class="btn-left" icon-pack="feather" icon="icon-chevron-left" v-if="isShowing"></vs-button>
        <vs-button @click.stop="nextSlide" color="primary" type="filled" radius class="btn-right" icon-pack="feather" icon="icon-chevron-right" v-if="isShowing"></vs-button>
		<div class="vx-col w-full h-12">
			<div class="flex w-full items-center justify-center">
				<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" v-if="catalogos.length > 0">
					<ol class="carousel-indicators-catalog">
						<li
							data-target="#carouselExampleIndicators"
							:data-slide-to="index"
							:id="'carousel-slide-'+index"
							v-for="(catalogo, index) in catalogos" :key="`slide-to-${index}`">
						</li>
					</ol>
					<div class="carousel-inner">
						<div class="carousel-item" :id="'carousel-item-'+index" v-for="(catalogo, index) in catalogos" :key="`catalogo-${index}`" v-on:click.once="abrirCatalogo(catalogo)">
							<img :src="catalogo.base64" class="img-catalogo responsive img-ref" :alt="catalogo.nome">
							<div class="carousel-caption">
								<div class="title-catalog">{{catalogo.nome}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

// import ClienteDB from '../../rapidsoft/db/clienteDB'
import _ from 'lodash'
import CatalogoDB from '../../rapidsoft/db/catalogoDB'
import { timeout } from 'q';

export default {

	data() {
		return {
			isShowing: false,
			catalogos: []
		}
	},
	components: {
	},
	computed: {
	},
	methods: {
		abrirCatalogo(catalogo) {
			this.$router.push({ name: 'catalogoItem', params: {idCatalogo: catalogo.idCatalogo}});
		},
		setActiveItemCarousel(indexNew) {
			for (let index = 0; index < this.catalogos.length; index++) {
				document.getElementById("carousel-item-"+index).classList.remove("active");
				document.getElementById("carousel-slide-"+index).classList.remove("active");
			}
			document.getElementById("carousel-item-"+indexNew).classList.add("active");
			document.getElementById("carousel-slide-"+indexNew).classList.add("active");
		},
		prevSlide() {
			for (let index = 0; index < this.catalogos.length; index++) {
				if (document.getElementById("carousel-item-"+index).classList.contains("active")) {
					const element = this.catalogos[index];
					if (index === 0) {
						this.setActiveItemCarousel(this.catalogos.length-1);
						break;
					} else {
						this.setActiveItemCarousel(index-1);
						break;
					}
				}
			}
		},
		nextSlide() {
			for (let index = 0; index < this.catalogos.length; index++) {
				if (document.getElementById("carousel-item-"+index).classList.contains("active")) {
					const element = this.catalogos[index];
					if (index === this.catalogos.length-1) {
						this.setActiveItemCarousel(0);
						break;
					} else {
						this.setActiveItemCarousel(index+1);
						break;
					}
				}
			}
		},
	},
	beforeCreate() {
		document.getElementById('loading-bg').style.display = null;
	},
	created() {
	},
	beforeMount() {
        CatalogoDB.getAll().then((catalogos) => {
			this.catalogos = _.cloneDeep(catalogos);
		})
    },
	mounted() {
	},
	updated() {
		setTimeout(() => {
			this.setActiveItemCarousel(0);
			this.isShowing = true;
			document.getElementById('loading-bg').style.display = "none";
		}, 300)
	}
}
</script>

<style lang="scss" scoped>

// html {
//   position: fixed;
//   width: 100%; 
//   height: 100%
// }

.carousel-inner {
	border-radius: .5rem!important;
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
    opacity: .5;
    -webkit-transition: opacity 0.6s ease;
    transition: opacity 0.6s ease;
}

.carousel-indicators-catalog .active {
    opacity: 1;
	background-color: #ec1e1e;
}

.img-catalogo {
	max-height:80vh;
	width: auto;
}

.btn-left{
    position: fixed;
    top:50%;
    left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    z-index: 1000;

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
    z-index: 1000;

    .vs-icon{
        animation: spin 1.5s linear infinite;
    }
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
