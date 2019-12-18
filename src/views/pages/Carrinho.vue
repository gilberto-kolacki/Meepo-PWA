<template>
	<div class="page-carrinho">
		<div id="page-carrinho-edit" v-if="this.showEditProduto">
			<add-item-carrinho @show-add-carrinho="showAddCarrinho" :produtoAdd="this.produtoAdd"></add-item-carrinho>
		</div>
		<div v-else-if="this.showCarrinho">
			<div id="page-carrinho">
				<vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-arrow-down" @click="showPedidos()">Pedidos</vs-button>
				<vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltar()" icon="icon-x">Voltar</vs-button>
				<div class="mt-5">
					<vs-tabs alignment="fixed">
						<vs-tab :label="segmento.nome" v-for="(segmento, indexSegmento) in this.segmentos" :key="indexSegmento" icon-pack="feather" icon="icon-shopping-bag">
							<carrinho-item 
								@show-add-carrinho="showAddCarrinho"
								@edicao-item-carrinho="showEditCarrinho"
								:segmento="segmento">
							</carrinho-item>
						</vs-tab>
						<vs-tab label="Embarques" icon-pack="feather" icon="icon-box">
							<embarque-item></embarque-item>
						</vs-tab>
					</vs-tabs>
				</div>
			</div>
		</div>
		<div v-else-if="this.showPedido">
			<div id="page-pedidos-revisao" class="page-pedidos-revisao">
				<carrinho-pedido @voltar-carrinho="voltarCarrinho"></carrinho-pedido>			
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
import CarrinhoPedido from "../../rapidsoft/components/CarrinhoPedido";
import EmbarqueItem from "../../rapidsoft/components/EmbarqueItem";

export default {
	data: () => ({
		selected: [],
		segmentos: [],
		embarques: [],
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
        // showCarrinho(val) {
		// 	this.showEditProduto = false;
		// 	this.showPedido = false;
		// 	console.log(val);
		// },
		// showEditProduto(val) {
		// 	this.showCarrinho = false;
		// 	this.showPedido = false;
		// 	console.log(val);
		// },
		// showPedido(val) {
		// 	this.showCarrinho = false;
		// 	this.showEditProduto = false;
		// 	console.log(val);
        // }
    },
	components: {
		AddItemCarrinho,
		CarrinhoItem,
		CarrinhoPedido,
		EmbarqueItem,
	},
	computed: {
 
	},
    methods: {		
		showAddCarrinho() {
			this.gerenciaVisualizacao(1);
			this.produtoAdd=null;
		},
		showPedidos() {
			this.gerenciaVisualizacao(2);
		},
		showEditCarrinho(produto) {
			this.produtoAdd = produto;
			this.gerenciaVisualizacao(3);
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
				case 2:
					this.showPedido = true;
					this.showCarrinho = false;
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
		}
	},
	beforeCreate() {
		
	},
	created() {
		EmbarqueDB._getAll().then(embarques => {
			this.embarques = embarques;
			SegmentoDB.getSegmentosCarrinho().then(segmentos => {
				this.segmentos = segmentos;
				this.showCarrinho = true;
			})
		});
	},
    mounted() {
        
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
}
</style>