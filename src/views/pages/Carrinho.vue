<template>
	<div id="page-carrinho-edit" v-if="this.popupAddProduto">
		<add-item-carrinho @show-add-carrinho="showAddCarrinho(false)" :produtoAdd="this.produtoAdd"></add-item-carrinho>
	</div>
    <div v-else-if="this.popupCarrinho">
		<div id="page-carrinho" class="page-carrinho" v-if="this.showCarrinho">
			<vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="gerarPedidos()">Finalizar</vs-button>
			<vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltar()" icon="icon-x">Voltar</vs-button>
			<div class="mt-5">
				<vs-tabs alignment="fixed">
					<vs-tab :label="segmento.nome" v-for="(segmento, indexSegmento) in this.segmentos" :key="indexSegmento" icon-pack="feather" icon="icon-shopping-bag">
						<carrinho-item 
							@show-add-carrinho="showAddCarrinho"
							@edicao-item-carrinho="setPopupAddProduto"
							:segmento="segmento">
						</carrinho-item>
					</vs-tab>
					<vs-tab label="Embarques" icon-pack="feather" icon="icon-box">
					</vs-tab>
				</vs-tabs>
			</div>
		</div>
    </div>
	<div v-else>
		<div id="page-pedidos-revisao" class="page-pedidos-revisao">
			<vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="gerarPedidos()">Finalizar</vs-button>
			<vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltar()" icon="icon-x">Voltar</vs-button>
			<div class="demo-alignment">
				<div class="dropdown-button-container">
					<vs-dropdown>
						<vs-button class="btn-drop" type="filled" icon="expand_more">Ações</vs-button>
						<vs-dropdown-menu>
							<vs-dropdown-item>
								<span class="flex items-center">
									<feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
									<span @click="deleteItemsChart">Deletar</span>
								</span>
							</vs-dropdown-item>
						</vs-dropdown-menu>
					</vs-dropdown>
				</div>
			</div>
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

export default {
	data: () => ({
		selected: [],
		segmentos: [],
		showCarrinho: false,
		embarques: [],
		popupCarrinho: true,
		popupAddProduto: false,
		produtoAdd: {
			produtoA: {
				cores:[]
			},
			produtoB: {
				cores:[]
			}
		},
	}),
	components: {
		AddItemCarrinho,
		CarrinhoItem,
	},
	computed: {
 
	},
    methods: {		
		showAddCarrinho() {
			this.popupAddProduto = false;
			this.popupCarrinho = true;
			this.produtoAdd=null;
		},
		voltar() {
			this.$router.go(-1);
		},
		setPopupAddProduto(produto){
			this.produtoAdd = produto;
			this.popupAddProduto = true;
			this.popupCarrinho = false;
		},
		gerarPedidos() {
			this.popupCarrinho = false;
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