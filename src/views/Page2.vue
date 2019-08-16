<template>
	<div id="demo-basic-card">
		<vs-button color="primary" type="filled" @click="carregarItens">Carregar</vs-button>
        <div class="vx-row">
            <div class="vx-col w-full sm:w-1/2 lg:w-1/3 mb-base" :key="index" :src="item.imagem" v-for="(item, index) in itens">
                <vx-card>
                    <div slot="no-body">
                        <img :src="item.imagem" alt="content-img" class="responsive card-img-top">
                    </div>
                    <h5 class="mb-2">{{ item.name }}</h5>
                    <p class="text-grey">{{ item.brand }}</p>
                    <div class="flex justify-between flex-wrap">
                        <vs-button class="mt-4 shadow-lg" type="gradient" color="#7367F0" gradient-color-secondary="#CE9FFC">Download</vs-button>
                        <vs-button class="mt-4" type="border" color="#b9b9b9">View All</vs-button>
                    </div>
                </vx-card>
            </div>
        </div>
    </div>


</template>

<script>

import ProdutoDB from '@/db/produtoDb'

export default {

	data() {
		return {
			email: 'demo@demo.com',
			itens: []
		}
	},

	methods: {

		carregarItens() {
			this.$vs.loading();

			var nomeImagem = 1;
			var produtos = [];
			for (let index = 0; index <= 1001; index++) {
				if (nomeImagem > 5) {
					nomeImagem = 1;
				}

				let teste = {};
				teste.name = "Teste "+index;
				teste._id = 'produto_'+index;				
				produtos.push(teste);
				nomeImagem++;
			}

			ProdutoDB.salvarLista(produtos).then((result) => {
				console.log(result);
				
				this.$vs.loading.close();
			}).catch((erro) => {
				console.log(erro);
				
				this.$vs.loading.close();
			})
			
		},

		toBase64() {

		},

		toDataUrl(url) {
			return new Promise((resolve) => {
				var httpRequest = new XMLHttpRequest();
				httpRequest.onload = function() {
					var fileReader = new FileReader();
					fileReader.onloadend = function() {
						// resolve(fileReader.result.replace('data:text/html', 'data:image/jpeg'));
						console.log(fileReader);
						
						resolve(fileReader.result);
					}
					fileReader.readAsDataURL(httpRequest.response);
				};
				httpRequest.open('GET', url);
				httpRequest.responseType = 'blob';
				httpRequest.send();
			});
		},

	},

	created() { 

		ProdutoDB.listar().then(resposta => {
			this.itens = resposta;
		})

	}

}		


</script>