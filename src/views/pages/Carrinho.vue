<template>
	<div id="page-carrinho-edit" v-if="this.popupAddProduto">
		<add-item-carrinho @show-add-carrinho="showAddCarrinho(false)" :produtoAdd="this.produtoAdd"></add-item-carrinho>
	</div>
    <div v-else-if="this.popupCarrinho">
		<div id="page-carrinho" class="page-carrinho" v-if="this.carrinho">
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
			<template v-if="this.carrinho">
				<div
					class="flex"        
					v-for="(produtoCor, indexItem) in this.carrinho"
					:key="indexItem + '-' + produtoCor.referencia"
					style="padding:10px;box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2); margin-top:10px;"
				>
					<template>
						<div class="vx-col mx-1" style="justify-content:center;margin:auto">
							<div class="flex w-full items-center justify-center">
								<vs-checkbox v-model="itensSelecionados" :vs-value="produtoCor" />
							</div>
						</div>
						<div class="vx-col w-1/6 mx-1" style="justify-content:center;margin:auto">
							<img
								:src="produtoCor.imagemPrincipal"
								class="rounded mb-4 user-latest-image responsive img-popup product-img"
								style="max-width:70px;"
								v-if="produtoCor.imagemPrincipal"
							/>
							<img
								:src="require(`@/assets/images/rapidsoft/no-image.jpg`)"
								class="rounded mb-4 user-latest-image responsive img-popup product-img"
								v-else
								style="max-width:70px;"
							/>
						</div>
						<div class="vx-col w-1/6 mx-1" style="justify-content:center;margin:auto">
							<div class="vx-row">{{produtoCor.nome}}</div>
							<div class="vx-row">Linha Fitness</div>
							<div class="vx-row" style="font-weight:bold;">{{'Ref: ' + produtoCor.referencia}}</div>
							<div class="vx-row" style="font-weight:bold;">{{'Cor: ' + produtoCor.cor.nome}}</div>
						</div>
						<div class="vx-col mx-6" style="justify-content:center;margin:auto">
							<table>
								<thead class="border-solid">
									<th 
										style="background-color:#808080;color:white" 
										class="border-solid" 
										v-for="(tamanho, indexTamanho) in getTamanhosProduto(indexItem)"
										:key="indexTamanho + ' - ' + tamanho.sku"
									>
										{{tamanho.codigo}}
									</th>
								</thead>
								<tbody>
									<tr>
										<td
											style="border-color:#808080;font-weight:bold"
											class="border-solid text-center"
											v-for="(tamanho, indexTamanho) in getTamanhosProduto(indexItem)"
											:key="indexTamanho + ' - ' + tamanho.sku"
										>{{tamanho.quantidade}}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="vx-col w-2/12 mx-5" style="justify-content:center;margin:auto">
							<div class="vx-row" style="display=flex;justify-content:center;">
								<vs-select v-model="produtoCor.embarque.id">
									<vs-select-item
										:key="index"
										:value="embarque.id"
										:text="embarque.nome"
										v-for="(embarque, index) in getEmbarquesProdutos()"
									/>
								</vs-select>
							</div>
						</div>
						<div class="vx-col mx-1 w-1/6" style="justify-content:center;margin:auto">
							<div class="vx-col text-center">
								<span style="font-weight:bold">Qntd: {{getAmountQuantities(produtoCor.cor.tamanhos)}}</span>
							</div>
							<div class="vx-row text-center justify-center">
								<span style="font-weight:bold">{{getCoinFormat(getAmountValueBuy(produtoCor.cor.precoCusto,getAmountQuantities(produtoCor.cor.tamanhos)))}}</span>
							</div>
						</div>
						<div class="vx-col mx-1" style="justify-content:center;margin:auto">
							<div class="vx-col text-center" @click.stop="setPopupAddProduto(produtoCor)">
								<feather-icon class="cursor-pointer" icon="EditIcon" svgClasses="w-6 h-6" />
							</div>
						</div>
					</template>
				</div>
			</template>
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
import _ from "lodash";
import Storage from "../../rapidsoft/utils/storage";
import ProdutoDB from "../../rapidsoft/db/produtoDB";
import ErrorDB from "../../rapidsoft/db/errorDB";
import ProdutoUtils from "../../rapidsoft/utils/produtoUtils";
import UtilMask from '../../rapidsoft/utils/utilMask'
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import AddItemCarrinho from '../../rapidsoft/components/AddItemCarrinho'

export default {
	data: () => ({
		carrinho: null,
		selected: [],
		itemsPerPage: 4,
		isMounted: false,
		addNewDataSidebar: false,
		sidebarData: {},
		embarques: [],
		itensSelecionados: [],		    		
		popupCarrinho:true,
		popupAddProduto:false,
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
	},
	computed: {
		currentPage() {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
		},
        products() {
            return this.carrinho;
        },
		queriedItems() {
            return this.$refs.table
                ? this.$refs.table.queriedResults.length
                : this.products.length;
		},    
	},
    methods: {
		showAddCarrinho(show) {
			this.carregaItensTela(() => {
				this.popupAddProduto = show;
				this.produtoAdd=null;
			});
		},
		voltar() {
			this.$router.go(-1);
		},
		carregaItensTela(callback) {
			ProdutoUtils.getCarrinho().then(carrinho => {
				this.carrinho = carrinho;
				callback();
			});
		},
		getTamanhosProduto(index) {
			return this.carrinho[index].cor.tamanhos
		},
		getEmbarquesProdutos() {
            const embarques = [];
            this.carrinho.forEach(produto => {
                if (!EmbarqueDB._existsId(embarques, produto.embarque)) {
                    embarques.push(produto.embarque);
                }
            });
            return embarques;
		},
		setPopupAddProduto(produto){
			ProdutoDB.getProdutoEdicaoCarrinho(produto).then((result) => {
				this.produtoAdd = result;
				this.produtoAdd = {
					produtoA: result,
					produtoB: null,
				};
				this.popupAddProduto = true;
			});
		},
		toggleDataSidebar(val = false) {
			this.addNewDataSidebar = val;
		},
		getCoinFormat(value) {
			return ("R$ " + value.toFixed(2).toString().replace(".", ","));
		},
		calcularPrecoProduto(produto) {
            const percentual = _.toNumber(this.grupoCliente.porcentagem);
            const precoProduto = produto.cores[this.corSelecionada].precoVenda;
            const preco = _.round(precoProduto + ((percentual/100) * precoProduto), 2)
            return UtilMask.getMoney(preco, true);
        },
		getAmountValueBuy(valorCompra,totalQuantidade) {
            return valorCompra * totalQuantidade;
		},
        getAmountQuantities(listaPedidoTamanho) {
			let totalPedido = 0;
			for (let i = 0; i < listaPedidoTamanho.length; i++) {
				totalPedido += listaPedidoTamanho[i].quantidade;
			}
			return totalPedido;
		},
		deleteItemsChart() {
            const itensCarrinho = Storage.getCarrinhoItens();
            const itensCarrinhoNew = itensCarrinho.filter(produto => {
                return !this.itensSelecionados.some(item => {
                    return produto.idProduto === item.cor.idProduto ;
                });
            });
            Storage.setCarrinhoItens(itensCarrinhoNew);
            this.itensSelecionados = [];
            this.carregaItensTela(() => {});
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
		});
	},
    mounted() {
        this.carregaItensTela(() => {});
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