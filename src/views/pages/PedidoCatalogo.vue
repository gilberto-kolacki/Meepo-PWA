<template>
		<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
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
					<img :src="require(`@/assets/images/rapidsoft/catalogo/`+ getImage(catalogo))" class="d-block w-100 img-catalogo" :alt="catalogo.titulo">
				</div>
			</div>
			<a class="carousel-control-prev" href="#" role="button" data-slide="prev" v-on:click.stop="prevSlide()">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="sr-only">Previous</span>
			</a>
			<a class="carousel-control-next" href="#" role="button" data-slide="next" v-on:click.stop="nextSlide()">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="sr-only">Next</span>
			</a>
		</div>
</template>

<script>

import ClienteDB from '../../rapidsoft/db/clienteDB'
import _ from 'lodash'

export default {

	data() {
		return {						
			catalogos: [
				{
					_id: '1',
					segmento: 'fitness',
					titulo: 'Fitness',
					imagem: 'fitness.png'
				},
				{
					_id: '2',
					segmento: 'beach',
					titulo: 'Beach',
					imagem: 'beach.png'
				},
				{
					_id: '3',
					segmento: 'campanha',
					titulo: 'Campanha',
					imagem: 'campanha.png'
				}
			]
		}
	},
	components: {		
	},
	computed: {
	},
	methods: {
		getImage(catalogo) {
			return catalogo.imagem;
		},
		abrirCatalogo(catalogo) {
			this.$router.push({ name: 'catalogoSegmento', params: {linha: catalogo.segmento } });
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

	created() {
	},
	mounted() {
		this.setActiveItemCarousel(0);
	},
}		
</script>

<style lang="scss" scoped>
  
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
	max-height: 58rem;
	// max-width: 50rem;
}
  
</style>