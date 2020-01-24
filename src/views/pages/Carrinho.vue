<template>
	<div id="page-carrinho" class="page-carrinho">
		<vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-arrow-down" @click="showPedidos()">Pedidos</vs-button>
		<vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltar()" icon="icon-x">Voltar</vs-button>
		<b-tabs content-class="mt-5" justified v-if="this.showCarrinho" lazy no-fade >
			<b-tab id="tab-embarques">
				<template v-slot:title>
					<strong>
						<feather-icon icon="BoxIcon" style="color:warning;" class="cursor-pointer"/>
						Embarques
					</strong>
				</template>
				<embarque-item 
					v-model="this.embarques" 
					@change-data-embarque="atualizaDataItensEmbarque"
					:embarquesOption="this.embarquesOption" 
				/>
			</b-tab>
			<b-tab v-for="(segmento, indexSegmento) in this.segmentos" :key="indexSegmento" :id="'tab-item-'+segmento.id">
				<template v-slot:title>
					<strong>
						<feather-icon icon="ServerIcon" style="color:warning;" class="cursor-pointer"/>
						{{segmento.nome}}
					</strong>
				</template>
				<carrinho-item
					@show-add-carrinho="showAddCarrinho"
					@edicao-item-carrinho="showEditCarrinho"
					@atuliza-embarques="atulizaEmbarques"
					:segmento="segmento"
					:embarques="getEmbarquesSegmento(segmento)"
					:produtos="getProdutosSegmento(segmento)"/>
			</b-tab>
		</b-tabs>
	</div>
</template>
<script>
// import _ from "lodash";
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import SegmentoDB from "../../rapidsoft/db/segmentoDB";
import PeriodoDB from "../../rapidsoft/db/periodoDB";
import ErrorDB from "../../rapidsoft/db/errorDB";
import CarrinhoItem from "../../rapidsoft/components/CarrinhoItem";
import EmbarqueItem from "../../rapidsoft/components/EmbarqueItem";
import ProdutoUtils from "../../rapidsoft/utils/produtoUtils";
import CarrinhoUtils from "../../rapidsoft/utils/carrinhoUtils";

export default {
	data: () => ({
		selected: [],
		segmentos: [],
		embarques: [],
		embarquesOption: [],
		itensCarrinho: [],
		produtosSegmento: null,
		showCarrinho: false,
	}),
	watch: {

    },
	components: {
		CarrinhoItem,
		EmbarqueItem,
	},
	computed: {

	},
    methods: {
		getEmbarquesSegmento(segmento) {
			return this.embarquesOption.filter((embarque) => {
                return embarque.idSegmento == segmento.id;
            }).reduce((map, embarque) => {
				map[embarque.id] = embarque;
				return map;
			}, {});
		},
		getProdutosSegmento(segmento) {
			return this.produtosSegmento.get(segmento.id);
		},
		showAddCarrinho() {
			this.gerenciaVisualizacao(1);

			this.produtosAdd=null;
		},
		showPedidos() {
			CarrinhoUtils.setEmbarqueItensCarrinho(this.itensCarrinho).then(() => {
				this.$router.push({ name: 'carrinhoPedido'});
			});
		},
		showEditCarrinho(produto) {
            this.$router.push({ name: 'carrinhoAdd', params: {produtos: [produto]}});
		},
		atulizaEmbarques() {
			EmbarqueDB.getInfosEmbarques(this.itensCarrinho).then((embarques) => {
				PeriodoDB.getPeriodosToEmbarque(embarques).then((embarques) => {
					this.embarques = embarques;
					this.$forceUpdate();
				});
			});  
		},
		atualizaDataItensEmbarque(embarque) {
			const produtos = this.produtosSegmento.get(embarque.segmento);
			produtos.forEach(produto => {
				if (produto.embarque.id === embarque.id) {
					produto.dataEmbarque = embarque.dataEmbarque;
				}
			});
		},
		voltar() {
			this.$router.go(-1);
		},	
		voltarCarrinho() {
			this.gerenciaVisualizacao(1);
		},
		carregaItensTela() {
			return new Promise((resolve) => {
				CarrinhoUtils.getCarrinho().then(carrinho => {
					this.itensCarrinho = carrinho;
					EmbarqueDB.getInfosEmbarques(carrinho).then((embarques) => {
						this.embarquesOption = embarques;
						PeriodoDB.getPeriodosToEmbarque(embarques).then((embarques) => {
							this.embarques = embarques;
							SegmentoDB.getSegmentosCarrinho(this.itensCarrinho).then((segmentos) => {
								this.segmentos = segmentos;
								ProdutoUtils.getProdutosSegmentos(segmentos, carrinho).then((produtosSegmento) => {
									this.produtosSegmento = produtosSegmento;
									this.showCarrinho = true;
									resolve();
								});
							});
						});
					});
				});
			});
		},
	},
	async created() {
		await this.carregaItensTela();
	},
    async mounted() {
        
	},
	updated() {
		
	},

	errorCaptured(err, vm, info) {
        ErrorDB._criarLog({ err, vm, info });
        return true;
    }

};
</script>

<style lang="scss">
.dropdown-button-container {
  display: flex;
  align-items: center;

  .btnx {
    border-radius: 5px;
  }

  .btn-drop {
    border-radius: 5px;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.page-carrinho {
  margin-top: -15px !important;
  margin-left: 1px !important;
  margin-right: 1px !important;
}
</style>