<template>
	<vx-card title="Imagens de clientes">
		<!-- <carousel :data="imagens"></carousel> -->
		<!-- <carousel :data="['Slide 1', 'Slide 2', 'Slide 3']"></carousel> -->

		<b-carousel
			id="carousel-1"
			v-model="slide"
			no-animation
			controls
			indicators
			background="#ababab"
			
			style="text-shadow: 1px 1px 2px #333;"
			@sliding-start="onSlideStart"
			@sliding-end="onSlideEnd"
		>			
			<b-carousel-slide v-for="(imagem, index) in imagens" :key="`segmento-cliente-${index}`" v-bind:img-src="imagem.src" v-bind:max-height="'500'"></b-carousel-slide>
		</b-carousel>
			
    </vx-card>


</template>

<script>

import ClienteDB from '../rapidsoft/db/clienteDB'
import _ from 'lodash'

export default {

	data() {
		return {			
			imagens: [],
			slide: 0,
        	sliding: null,
		}
	},
	components: {
		
	},
	methods: {
		onSlideStart(slide) {
			this.sliding = true
		},
		onSlideEnd(slide) {
			this.sliding = false
		}
	},

	created() { 

		ClienteDB.listar().then(resposta => {
			let clientes = _.clone(resposta);

			clientes.forEach(cliente => {
				cliente.imagensCliente.forEach(imagem => {
					this.imagens.push(_.clone(imagem));
				});
			});
		})

	}

}		

</script>

<style lang="scss" scoped>
  .swiper-slide {
    background-position: center;
    background-size: cover;
    &.slide-1 {
      background-image:url('/static/images/surmon-1.jpg')
    }
    &.slide-2 {
      background-image:url('/static/images/surmon-6.jpg')
    }
    &.slide-3 {
      background-image:url('/static/images/surmon-8.jpg')
    }
    &.slide-4 {
      background-image:url('/static/images/surmon-9.jpg')
    }
    &.slide-5 {
      background-image:url('/static/images/surmon-10.jpg')
    }
  }
</style>