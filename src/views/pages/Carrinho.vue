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
					:embarques="getEmbarquesSegmento(segmento)"
					:produtos="getProdutosSegmento(segmento)"/>
			</b-tab>
		</b-tabs>

		<!-- Agrupador de de categorias -->
		<b-card no-body class="mb-1" v-for="(categoria, indexCat) in totalizadorCategorias" :key="indexCat">
			<b-card-header header-tag="header" class="p-1" role="tab"  v-b-toggle="'categoria-'+categoria.id">
				<span class="font-bold card-header-categorias">+ {{categoria.nome}}: {{getQuantidadeCat(categoria)}} </span>
			</b-card-header>
			<b-collapse :id="'categoria-'+categoria.id" :ref="'embarque-'+categoria.id">
				<b-card-body style="padding: 5px;">
					<table class="table-categorias">
						<thead class="border-solid">
							<th class="grade-tam-prod-title" v-for="(tamanho, indexTamanho) in getTamanhosItens(categoria)" :key="indexTamanho + ' - ' + tamanho.codigo">
								{{tamanho.codigo}}
							</th>
						</thead>
						<tbody>
							<tr>
								<td class="grade-tam-prod-qtde"
									v-for="(tamanho, indexTamanho) in getTamanhosItens(categoria)" :key="indexTamanho + ' - ' + tamanho.codigo">
								{{tamanho.quantidade}}</td>
							</tr>
						</tbody>
					</table>
				</b-card-body>
			</b-collapse>
		</b-card>
		<b-card no-body class="mb-1">
			<b-card-header header-tag="header" class="p-1" role="tab">
				<span class="font-bold card-header-categorias">Total peças: {{this.getTotalPecas}}</span>
			</b-card-header>
		</b-card>
		<b-card no-body class="mb-1">
			<b-card-header header-tag="header" class="p-1" role="tab">
				<span class="font-bold card-header-categorias">Total: {{this.getTotalValor | moneyy}}</span>
			</b-card-header>
		</b-card>
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
import SearchCliente  from '../../rapidsoft/components/SearchCliente';

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
		totalizadorCategorias: [],
	}),
	watch: {

    },
	components: {
		CarrinhoItem,
		SearchCliente,
	},
	computed: {
		getTotalValor() {
			return this.totalizadorCategorias.reduce((vlrTotal, cat) => vlrTotal + this.getValorCat(cat), 0);
		},
		getTotalPecas() {
			return this.totalizadorCategorias.reduce((qtdeTotal, cat) => qtdeTotal + this.getQuantidadeCat(cat), 0);
		},
	},
    methods: {		
		getTamanhosItens(categoria) {
			return categoria.itens.reduce((tamanhosCategoria, item) => {
				return tamanhosCategoria.concat(item.tamanhos.reduce((tamanhos, tamanho) => {
					const indexTam = tamanhosCategoria.findIndex((tam) => tam.codigo == tamanho.codigo);
					if (indexTam >= 0 ) tamanhosCategoria[indexTam].quantidade = tamanhosCategoria[indexTam].quantidade + tamanho.quantidade;
					else tamanhos.push({codigo: tamanho.codigo, quantidade: tamanho.quantidade});
					return tamanhos;
				}, []));
			}, []);
		},
		getValorCat(categoria) {
			return categoria.itens.reduce((vlrTotal, item) => vlrTotal + (item.preco * item.tamanhos.reduce((qtde, tamanho) => qtde + tamanho.quantidade, 0)), 0);
		},
		getQuantidadeCat(categoria) {
			return categoria.itens.reduce((qtdeTotal, item) => qtdeTotal + item.tamanhos.reduce((qtde, tamanho) => qtde + tamanho.quantidade, 0), 0);
		},
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
					this.cliente = carrinho.cliente;
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
		selectSearchCliente(cliente) {
			this.cliente = cliente;
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