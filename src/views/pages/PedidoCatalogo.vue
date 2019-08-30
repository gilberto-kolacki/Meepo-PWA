<template>
	<vx-card title="Imagens de clientes">
		<b-carousel
			id="carousel-1"
			v-model="slide"
			:interval="0"
			controls
			indicators
			background="#ababab"
			
			style="text-shadow: 1px 1px 2px #333;"
			@sliding-start="onSlideStart"
			@sliding-end="onSlideEnd"
		>			
			<b-carousel-slide v-for="(imagem, index) in imagens" :key="`segmento-cliente-${index}`" v-bind:img-src="getBase64(imagem)" v-bind:max-height="'500'"></b-carousel-slide>
		</b-carousel>
			
    </vx-card>


</template>

<script>

import ClienteDB from '../../rapidsoft/db/clienteDB'
import _ from 'lodash'

export default {

	data() {
		return {			
			imagens: [],
			slide: 0,
        	sliding: null
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
		},
		getBase64(imagem) {
            return URL.createObjectURL(imagem.file);
        },
		
	},

	created() { 

		ClienteDB.listar().then(resposta => {
			let clientes = _.clone(resposta);

			clientes.forEach(cliente => {
				cliente.imagensClienteBlob.forEach(imagem => {
					console.log(imagem);
					
					this.imagens.push(_.clone(imagem));
				});
			});
		})

	}

}		

</script>

<style lang="scss" scoped>
  
.carousel-inner {
	border-radius: .5rem!important;
}
  
</style>