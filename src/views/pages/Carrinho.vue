<template>
	<div>
		<div id="page-carrinho-edit" v-if="this.showEditProduto">
			<add-item-carrinho @show-add-carrinho="showAddCarrinho" :produtoAdd="this.produtoAdd"></add-item-carrinho>
		</div>
		<div v-else-if="this.showCarrinho">
			<div id="page-carrinho" class="page-carrinho">
				<vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-arrow-down" @click="showPedidos()">Pedidos</vs-button>
				<vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltar()" icon="icon-x">Voltar</vs-button>
				<b-tabs content-class="mt-5" justified v-if="this.showCarrinho">
					<b-tab active lazy>
						<template v-slot:title>
							<strong>
								<feather-icon icon="BoxIcon" style="color:warning;" class="cursor-pointer"/>
								Embarques
							</strong>
						</template>
						<embarque-item v-model="this.embarques" />
					</b-tab>
					<b-tab v-for="(segmento, indexSegmento) in this.segmentos" :key="indexSegmento">
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
							:produtos="getProdutosSegmento(segmento.id)"/>
					</b-tab>
				</b-tabs>
			</div>
		</div>
		<div v-else>
		</div>
	</div>
</template>
<script>
// import _ from "lodash";
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import SegmentoDB from "../../rapidsoft/db/segmentoDB";
import ErrorDB from "../../rapidsoft/db/errorDB";
import AddItemCarrinho from "../../rapidsoft/components/AddItemCarrinho";
import CarrinhoItem from "../../rapidsoft/components/CarrinhoItem";
import EmbarqueItem from "../../rapidsoft/components/EmbarqueItem";
import ProdutoUtils from "../../rapidsoft/utils/produtoUtils";
// import Storage from "../../rapidsoft/utils/storage";
import PedidoUtils from '../../rapidsoft/utils/pedidoUtils';

export default {
	data: () => ({
		selected: [],
		segmentos: [],
		embarques: [],
		itensCarrinho: [],
		produtosSegmento: null,
		showCarrinho: false,
		showEditProduto: false,
		showPedido: false,
		produtoAdd: {
			produtoA: {
				cores:[]
			},
			produtoB: {
				cores:[]
			}
		},
	}),
	watch: {

    },
	components: {
		AddItemCarrinho,
		CarrinhoItem,
		EmbarqueItem,
	},
	computed: {
		getEmbarquesCarrinho() {
			return this.itensCarrinho
		}
	},
    methods: {
		getProdutosSegmento(segmentoId) {
			return this.produtosSegmento.get(segmentoId);
		},
		showAddCarrinho() {
			this.gerenciaVisualizacao(1);
			this.produtoAdd=null;
		},
		showPedidos() {
			PedidoUtils.setEmbarqueItensCarrinho(this.itensCarrinho).then(() => {
				this.$router.push({ name: 'carrinhoPedido'});
			});
		},
		showEditCarrinho(produto) {
			this.produtoAdd = produto;
			this.gerenciaVisualizacao(3);
		},
		atulizaEmbarques() {
			EmbarqueDB.getInfosEmbarques(this.itensCarrinho).then((embarques) => {
				this.embarques = embarques
				this.$forceUpdate();
			});  
		},
		voltar() {
			this.$router.go(-1);
		},	
		voltarCarrinho() {
			this.gerenciaVisualizacao(1);
		},
		// 1 - carrinho, 2 - pedido, 3 - edit
		gerenciaVisualizacao(tipo=1) {
			switch (tipo) {
				case 1:
					this.showCarrinho = true;
					this.showPedido = false;
					this.showEditProduto = false;
					break;				
				case 3:
					this.showEditProduto = true;
					this.showPedido = false;
					this.showCarrinho = false;
					break;			
				default:
					break;
			}
		},
		carregaItensTela() {
			return new Promise((resolve) => {
				ProdutoUtils.getCarrinho().then(carrinho => {
					this.itensCarrinho = carrinho;
					EmbarqueDB.getInfosEmbarques(carrinho).then((embarques) => {
						this.embarques = embarques;

						console.log(embarques);
						
						SegmentoDB.getSegmentosCarrinho().then(segmentos => {
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
		},
	},
	beforeCreate() {
		
	},
	async created() {
		await this.carregaItensTela();
	},
    async mounted() {
        
	},
	updated() {
		// this.gerenciaVisualizacao();
	},

	errorCaptured(err, vm, info) {
        ErrorDB.criarLog({ err, vm, info });
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