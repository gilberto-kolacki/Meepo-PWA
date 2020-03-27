<template>
	<div id="page-carrinho" class="page-carrinho">
		<vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-arrow-down" @click="showPedidos()">Continuar</vs-button>
		<vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltar()" icon="icon-x">Voltar</vs-button>
		<b-tabs content-class="mt-5" justified v-if="this.showScreen" lazy no-fade >
			<b-tab v-for="(segmento, indexSegmento) in this.segmentos" :key="indexSegmento" :active="isEdit && segmento.id === segmentoSelecionado" :id="'tab-item-'+segmento.id">
				<template v-slot:title>
					<strong>
						<feather-icon icon="BoxIcon" style="color:warning;" class="cursor-pointer"/>
						<div class="itens-center"> Embarques {{segmento.nome}} </div>
					</strong>
				</template>
				<carrinho-item
					@show-add-carrinho="showAddCarrinho"
					@edicao-item-carrinho="showEditCarrinho"
					:segmento="segmento"
					:embarques="getEmbarquesSegmento(segmento)"
					:produtos="getProdutosSegmento(segmento)"/>
			</b-tab>
		</b-tabs>


		<b-card no-body class="mb-1" v-for="(categoria, indexCat) in totalizadorCategorias" :key="indexCat">
			<b-card-header header-tag="header" class="p-1" role="tab"  v-b-toggle="'categoria-'+categoria.id">
				<span class="font-bold card-header-categorias">+ {{categoria.nome}}: </span>
			</b-card-header>
			<b-collapse :id="'categoria-'+categoria.id" :ref="'embarque-'+categoria.id">
				<b-card-body style="background-color: rgba(0, 0, 0, 0.03); padding: 10px;">
					<table>
						<!-- <thead class="border-solid">
							<th class="grade-tam-prod-title" 
								v-for="(tamanho, indexTamanho) in getTamanhosProduto(produtoCor.idProduto)" :key="indexTamanho + ' - ' + tamanho.sku">
								{{tamanho.codigo}}
							</th>
						</thead>
						<tbody>
							<tr>
								<td class="grade-tam-prod-qtde"
									v-for="(tamanho, indexTamanho) in getTamanhosProduto(produtoCor.idProduto)" :key="indexTamanho + ' - ' + tamanho.sku">
								{{tamanho.quantidade}}</td>
							</tr>
						</tbody> -->
					</table>
				</b-card-body>
			</b-collapse>
		</b-card>
		<b-card no-body class="mb-1">
			<b-card-header header-tag="header" class="p-1" role="tab">
				<span class="font-bold card-header-categorias">Total peças:</span>
			</b-card-header>
		</b-card>
		<b-card no-body class="mb-1">
			<b-card-header header-tag="header" class="p-1" role="tab">
				<span class="font-bold card-header-categorias">Total:</span>
			</b-card-header>
		</b-card>


		<vs-popup title="Selecione o segmento" :active.sync="popupSegmentos" :button-close-hidden="false" v-if="this.segmentos.length > 1">
            <table style="width:100%" class="border-collapse">
                <tr>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Segmento</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light text-right">Peças</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light text-right">Total</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light"></th>
                </tr>
                <tr v-for="(segmento, indexSegmento) in this.segmentos" :key="indexSegmento">
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
	</div>
</template>
<script>
// import _ from "lodash";
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import SegmentoDB from "../../rapidsoft/db/segmentoDB";
import CategoriaDB from "../../rapidsoft/db/categoriaDB";
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
		embarquesOption: [],
		itensCarrinho: [],		
		produtosSegmento: null,
		showScreen: false,
		isEdit: false,
		segmentoSelecionado: null,
		popupSegmentos: false,
		totalizadorCategorias: [],
	}),
	watch: {

    },
	components: {
		CarrinhoItem,
	},
	computed: {

	},
    methods: {
		getPecasSegmento(segmento) {
			const embarquesSegmento = Object.values(this.getEmbarquesSegmento(segmento));
			return embarquesSegmento.reduce((total, segmento) => total + segmento.quantidade, 0);
		},
		getTotalSegmento(segmento) {
			const embarquesSegmento = Object.values(this.getEmbarquesSegmento(segmento));
			return embarquesSegmento.reduce((total, segmento) => total + segmento.totalBruto, 0);
		},
		getEmbarquesSegmento(segmento) {
			return this.embarquesOption.reduce((object, embarque) => {
				if (embarque.idSegmento == segmento.id) object[embarque.id] = embarque;
				return object;
			}, {});
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
			if (this.segmentos.length > 1) {
				this.popupSegmentos = true;
			} else {
				this.proximaTela(this.segmentos[0].id)
			}
		},
		showEditCarrinho(produto) {
			this.$router.push({ name: 'carrinhoAdd', 
				params: {tela: 'carrinho', produtos: [produto], pag: 0, edit:true}
			});
		},
		voltar() {
			this.$router.push({ name: 'catalogoItem'});
		},	
		voltarCarrinho() {
			this.gerenciaVisualizacao(1);
		},
		buscaAgrupadorCategorias(carrinho) {
			return new Promise((resolve) => {
				const totCategorias = carrinho.reduce((categoriasCarrinho, item) => {
					return categoriasCarrinho.concat(item.categorias.reduce((categorias, categoria) => {
						if (!categoriasCarrinho.some((cat) => cat === categoria)) categorias.push(categoria)
						return categorias;
					}, []));
				}, []).reduce((totCategorias, cat) => {
					const categ = {id: cat};
					categ.itens = carrinho.reduce((totaisCategoria, item) => {
						if (item.categorias.some((categ) => categ === cat)) {
							totaisCategoria.push({
								idProduto: item.idProduto,
								preco: item.precoCusto,
								tamanhos: item.tamanhos.map((tamanho) => ({codigo: tamanho.codigo, quantidade: tamanho.quantidade}))
							});
						}
						return totaisCategoria;
					}, []);
					totCategorias.push(categ)
					return totCategorias;
				}, []);
				CategoriaDB.getNomesAgrupadores(totCategorias).then((totalizadorCategorias) => {

					console.log(totalizadorCategorias);
					
					this.totalizadorCategorias = totalizadorCategorias;
					resolve();
				});
			});
		},
		carregaItensTela() {
			return new Promise((resolve, reject) => {
				this.segmentoSelecionado = this.$route.params.segmento;
				this.isEdit = this.$route.params.edit;		
				CarrinhoDB.getCarrinho().then(carrinho => {
					ProdutoDB.getProdutosFromCarrinho(carrinho).then((carrinhoTela) => {
						if (carrinhoTela.length > 0) {
							this.buscaAgrupadorCategorias(carrinhoTela).then(() => {
								this.itensCarrinho = carrinhoTela;
								EmbarqueDB.getInfosEmbarques(carrinhoTela).then((embarques) => {
									this.embarquesOption = embarques;
									PeriodoDB.getPeriodosToEmbarque(embarques).then((embarques) => {
										this.embarques = embarques;
										SegmentoDB.getSegmentosCarrinho(carrinhoTela).then((segmentos) => {
											this.segmentos = segmentos;
											this.produtosSegmento = ProdutoUtils.getProdutosSegmentos(segmentos, carrinhoTela);										
											resolve();
										});
									});
								});
							});
						} else reject("Não foi possivel encontrar embarques disponiveis para os Produtos!");							
					});
				});
			});
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

.card-header-categorias {
	float: right;
    font-size: 0.9rem;
    margin: 0.2rem 0.75rem !important;
}

.page-carrinho {
  margin-top: -15px !important;
  margin-left: 1px !important;
  margin-right: 1px !important;
}
</style>