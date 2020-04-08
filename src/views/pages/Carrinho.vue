<template>
	<div id="page-carrinho" class="page-carrinho">
		<vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-arrow-down" @click="showPedidos()">Continuar</vs-button>
		<vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltar()" icon="icon-x">Voltar</vs-button>
		<b-tabs content-class="mt-5" justified v-if="this.showScreen" lazy no-fade >
			<b-tab v-for="(segmento, indexSegmento) in this.segmentos" :key="indexSegmento" :active="isEdit && segmento.id === segmentoSelecionado" :id="'tab-item-'+segmento.id">
				<template v-slot:title>
					<div class="itens-center font-bold"> Embarques {{segmento.nome}} </div>
				</template>
				<carrinho-item
					@show-add-carrinho="showAddCarrinho"
					@edicao-item-carrinho="showEditCarrinho"
					:cliente="cliente"
					:segmento="segmento"
					:produtos="getProdutosSegmento(segmento)"/>
			</b-tab>
		</b-tabs>
		
		<!-- Modal seleção de segmento para carregar na tela de pedido -->
		<vs-popup title="Selecione o segmento" :active.sync="popupSegmentos" :button-close-hidden="false" v-if="this.segmentos.length > 1">
            <table style="width:100%" class="border-collapse">
                <tr>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Segmento</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light text-right">Peças</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light text-right">Total</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light"></th>
                </tr>
                <tr v-for="(segmento, indexSegmento) in segmentos" :key="indexSegmento">
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{segmento.nome}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{getPecasSegmento(segmento)}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{getTotalSegmento(segmento) | moneyy}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light">
						<div class="flex w-full items-center justify-center">
                            <vs-button color="warning" type="filled" size="small" icon-pack="feather" class="w-full" icon="icon-check" @click.stop="proximaTela(segmento.id)"></vs-button>
                        </div>
					</td>
                </tr>      
            </table>
        </vs-popup>
		<search-cliente v-if="showScreen" @search-selected="selectSearchCliente" id="popup-cliente-search"></search-cliente>
	</div>
</template>
<script>

import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import SegmentoDB from "../../rapidsoft/db/segmentoDB";
import PeriodoDB from "../../rapidsoft/db/periodoDB";
import CarrinhoDB from "../../rapidsoft/db/carrinhoDB";
import ProdutoDB from "../../rapidsoft/db/produtoDB";
import ErrorDB from "../../rapidsoft/db/errorDB";
import CarrinhoItem from "../../rapidsoft/components/CarrinhoItem";
import ProdutoUtils from "../../rapidsoft/utils/produtoUtils";
import CarrinhoUtils from "../../rapidsoft/utils/carrinhoUtils";

export default {
	data: () => ({
		selected: [],
		segmentos: [],
		embarques: [],
		cliente: null,
		embarquesOption: [],
		itensCarrinho: [],		
		produtosSegmento: null,
		showScreen: false,
		isEdit: false,
		segmentoSelecionado: null,
		popupSegmentos: false,
	}),
	watch: {
    },
	components: {
		CarrinhoItem,
		SearchCliente: () => ({
			component: import('../../rapidsoft/components/SearchCliente'),
            delay: 200,
            timeout: 3000
        }),
	},
	computed: {

	},
    methods: {		
		getPecasSegmento(segmento) {
			return this.embarques.reduce((total, embarque) => total + (embarque.idSegmento === segmento ? embarque.quantidade : 0), 0);
		},
		getTotalSegmento(segmento) {
			return this.embarques.reduce((total, embarque) => total + (embarque.idSegmento === segmento ? embarque.totalBruto : 0), 0);
		},
		getProdutosSegmento(segmento) {
			return this.produtosSegmento[segmento.id];
		},
		showAddCarrinho() {
			this.gerenciaVisualizacao(1);
			this.produtosAdd=null;
		},
		proximaTela(idSegmentoSelecionado) {
			this.popupSegmentos = false;
			this.itensCarrinho = this.itensCarrinho.filter((item) => item.segmento.some((segmento) => segmento === idSegmentoSelecionado));
			CarrinhoUtils.setItensToPedidoEmbarques(this.embarques, this.itensCarrinho).then((pedidoEmbarques) => {
				this.$router.push({ name: 'carrinhoPedido',
					params: {pedidoEmbarques: pedidoEmbarques}
				});
			});
		},
		showPedidos() {
			if (this.cliente.cpfCnpj) {
				if (this.segmentos.length > 1) {
					this.popupSegmentos = true;
				} else {
					this.proximaTela(this.segmentos[0].id)
				}
			} else {
				const menssagem = `Selecione um cliente para continuar!`;
				this.$vs.dialog({
					color:'warning',
					title:'Atenção!',
					text: menssagem,
					acceptText: 'Ok',
				});
			}
		},
		showEditCarrinho(produto) {
			this.$router.push({ name: 'carrinhoAdd', 
				params: {tela: 'carrinho', produtos: [produto], pag: 0, edit: true}
			});
		},
		voltar() {
			this.$router.push({ name: 'catalogoItem'});
		},	
		voltarCarrinho() {
			this.gerenciaVisualizacao(1);
		},
		carregaItensTela() {
			return new Promise((resolve, reject) => {
				this.segmentoSelecionado = this.$route.params.segmento;
				this.isEdit = this.$route.params.edit;		
				CarrinhoDB.getCarrinho().then((carrinho) => {
					this.cliente = carrinho.cliente;
					ProdutoDB.getProdutosFromCarrinho(carrinho).then((carrinhoTela) => {
						if (carrinhoTela.length > 0) {
							this.itensCarrinho = carrinhoTela;
							EmbarqueDB.getEmbarquesCarrinho(carrinhoTela).then((embarques) => {
								PeriodoDB.getPeriodosToEmbarque(embarques).then((embarques) => {
									this.embarques = embarques;
									SegmentoDB.getSegmentosCarrinho(carrinhoTela).then((segmentos) => {
										this.segmentos = segmentos;
										this.produtosSegmento = ProdutoUtils.getProdutosSegmentos(segmentos, carrinhoTela);										
										resolve();
									});
								});
							});
						} else reject("Não foi possivel encontrar embarques disponiveis para os Produtos!");							
					});
				});
			});
		},
		selectSearchCliente(clienteSelecionado) {
			this.$vs.loading();
			const close = () => {
				setTimeout(() => {
					this.cliente = clienteSelecionado;
					this.$forceUpdate();
					this.$vs.loading.close();
				}, 300);
			}
			if (this.cliente.grupoCliente.id != clienteSelecionado.grupoCliente.id) {
				this.carregaItensTela().then(() => close());
			} else {
				close();
			}
        },
	},
	async created() {
		const error = (erro) => {
			console.log(erro);
			alert(erro);
			this.$router.push({ name: 'catalogoItem'});
		}
		try {
			this.carregaItensTela().then(() => {
				this.showScreen = true;
			}).catch((erro) => error(erro));
		} catch (error) {
			console.log(error);
			alert(error);
			this.$router.push({ name: 'catalogoItem'});
		}
	},
    mounted() {
        
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

.card-header-categorias {
	float: right;
    font-size: 0.9rem;
    margin: 0.2rem 0.75rem !important;
}

.table-categorias {
	float: right;
    margin: 0.5rem 0.75rem !important;
}

.page-carrinho {
  margin-top: -15px !important;
  margin-left: 1px !important;
  margin-right: 1px !important;
}
</style>