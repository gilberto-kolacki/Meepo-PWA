<template>
    
</template>
<template>
  <div id="page-catalogo-add" class="page-catalogo-add" v-if="this.popupAddProduto" style="height:1000px;">
    <add-item-carrinho @show-add-carrinho="showAddCarrinho(false)" :produtoAdd="this.produtoAdd"></add-item-carrinho>
  </div>
  <div v-else>
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

    <template>
      <div
        class="flex"
        v-for="(item,index) in this.carrinho"
        :key="index + '-' + item.referencia"
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
                <th style="background-color:#808080;color:white" class="border-solid">P</th>
                <th style="background-color:#808080;color:white" class="border-solid">M</th>
                <th style="background-color:#808080;color:white" class="border-solid">G</th>
                <th style="background-color:#808080;color:white" class="border-solid">GG</th>
              </thead>
              <tbody>
                <tr>
                  <td
                    style="border-color:#808080;font-weight:bold"
                    class="border-solid text-center"
                    v-for="(tamanho,index2) in item.cor.tamanhos"
                    :key="index2 + ' - ' + tamanho.sku"
                  >{{item.cor.tamanhos[index2].quantidade}}</td>
                  <td
                    style="border-color:#808080;font-weight:bold"
                    class="border-solid text-center"
                    v-for="(tamanho,index3) in (4 - item.cor.tamanhos.length)"
                    :key="index3"
                  >0</td>
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
import _ from "lodash";
import vSelect from "vue-select";
import Storage from "../../rapidsoft/utils/storage";
import ProdutoUtils from "../../rapidsoft/utils/produtoUtils";
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import ImagemDB from "../../rapidsoft/db/imagemDB";
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
    }
  },
  methods: {
    showAddCarrinho(show) {
      this.popupAddProduto = show;
      this.produtoAdd=null;
    },
    setPopupAddProduto(produto){

      const cores = [{
        ativo: produto.cor.ativo,
        categorias: produto.cor.categorias,
        codigo: produto.cor.codigo,
        idCor: produto.cor.idCor,
        idProduto: produto.cor.idProduto,
        precoCusto: produto.cor.precoCusto,
        precoVenda: produto.cor.precoVenda,
        tamanhos: produto.cor.tamanhos,
        referencia: produto.referencia,
      }];

      const produtoRemodelado = {
        genero: produto.genero,
        nome: produto.nome,
        produtoAddCores: [produto.cor],
        produtoLabelTamanhos: produto.cor.tamanhos,
        referencia: produto.referencia,
        segmento: produto.segmento,
        _id: produto._id,
        cores:cores,
        prontaEntrega: false,
      };

      this.produtoAdd = {
        produtoA: produtoRemodelado,
        produtoB: [],
      };
      this.popupAddProduto = !this.popupAddProduto;
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
    ProdutoUtils.getCarrinho().then(carrinho => {
      carrinho.map(item => {
        ImagemDB.getFotoById(item.cor.imagem.id).then(imagem => {
          item.imagemPrincipal = imagem;
        });
      });
      this.carrinho = carrinho;
      console.log(this.carrinho);  
    });
  },
  created() {
    EmbarqueDB.getAll().then(embarques => {
      this.embarques = embarques;
    });
  },
  mounted() {
    ProdutoUtils.getCarrinho().then(carrinho => {
      carrinho.map(item => {
        ImagemDB.getFotoById(item.cor.imagem.id).then(imagem => {
          item.imagemPrincipal = imagem;
        });
      });
      this.carrinho = carrinho;
      console.log(this.carrinho);  
    });
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