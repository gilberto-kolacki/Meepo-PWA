<template>
  <div id="page-catalogo-add" class="page-catalogo-add" v-if="this.popupAddProduto" style="height:1000px;">
    <add-item-carrinho @show-add-carrinho="showAddCarrinho(false)" :produtoAdd="this.produtoAdd"></add-item-carrinho>
  </div>
  <div v-else>
    <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Finalizar</vs-button>
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
        v-for="(item, indexItem) in this.carrinho"
        :key="indexItem + '-' + item.referencia"
        style="padding:10px;box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);margin-top:20px;"
      >
      
        <template>
          <div class="vx-col mx-1" style="justify-content:center;margin:auto">
            <div class="flex w-full items-center justify-center">
              <vs-checkbox v-model="objectSelectCart.itemsSelectCart" :vs-value="item" />
            </div>
          </div>
          <div class="vx-col w-1/6 mx-1" style="justify-content:center;margin:auto">
            <img
              :src="item.imagemPrincipal"
              class="rounded mb-4 user-latest-image responsive img-popup product-img"
              style="max-width:70px;"
              v-if="item.imagemPrincipal"
            />
            <img
              :src="require(`@/assets/images/rapidsoft/no-image.jpg`)"
              class="rounded mb-4 user-latest-image responsive img-popup product-img"
              v-else
              style="max-width:70px;"
            />
          </div>
          <div class="vx-col w-1/6 mx-1" style="justify-content:center;margin:auto">
            <div class="vx-row">{{item.nome}}</div>
            <div class="vx-row">Linha Fitness</div>
            <div class="vx-row" style="font-weight:bold;">{{'Ref: ' + item.referencia}}</div>
            <div class="vx-row" style="font-weight:bold;">{{'Cor: ' + item.cor.nome}}</div>
            <div class="vx-row" style="font-weight:bold;">{{'Grade Aberta'}}</div>
          </div>
          <div class="vx-col mx-8" style="justify-content:center;margin:auto">
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
              <vs-select>
                <vs-select-item
                  :key="index"
                  :value="item.id"
                  :text="item.nome"
                  v-for="(item,index) in embarques"
                />
              </vs-select>
            </div>
          </div>
          <div class="vx-col mx-1 w-1/6" style="justify-content:center;margin:auto">
            <div class="vx-col text-center">
              <span style="font-weight:bold">Qntd: {{getAmountQuantities(item.cor.tamanhos)}}</span>
            </div>
            <div class="vx-row text-center justify-center">
              <span style="font-weight:bold">{{getCoinFormat(getAmountValueBuy(item.cor.precoCusto,getAmountQuantities(item.cor.tamanhos)))}}</span>
            </div>
          </div>
          <div class="vx-col mx-1" style="justify-content:center;margin:auto">
            <div class="vx-col text-center" @click.stop="setPopupAddProduto(item)">
              <feather-icon class="cursor-pointer" icon="EditIcon" svgClasses="w-6 h-6" />
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
// import _ from "lodash";
// import vSelect from "vue-select";
// import Storage from "../../rapidsoft/utils/storage";
import ProdutoDB from "../../rapidsoft/db/produtoDB";
import ProdutoUtils from "../../rapidsoft/utils/produtoUtils";
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
		objectSelectCart: {
		itemsSelectCart: []
		},
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
		// console.log(this.carrinho[index].cor.tamanhos);

		return this.carrinho[index].cor.tamanhos
		},

		setPopupAddProduto(produto){
			ProdutoDB.getProdutoEdicaoCarrinho(produto).then((result) => {
				console.log(result);
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
		return (
			"R$ " +
			value
			.toFixed(2)
			.toString()
			.replace(".", ",")
		);
		},
		getAmountValueBuy(valorCompra,totalQuantidade){
		return valorCompra * totalQuantidade;
		},
		getAmountQuantities(listaPedidoTamanho){
		let totalPedido = 0;
		for (let i = 0; i < listaPedidoTamanho.length; i++) {
			totalPedido += listaPedidoTamanho[i].quantidade;
		}
		return totalPedido;
		},
		deleteItemsChart(){
		console.log('Vai excluir = ', this.objectSelectCart.itemsSelectCart);
		}
	},
	beforeCreate() {
		
	},
	created() {
		EmbarqueDB.getAll().then(embarques => {
		this.embarques = embarques;
		});
	},
  	mounted() {
    	this.carregaItensTela(() => {

		});
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
</style>