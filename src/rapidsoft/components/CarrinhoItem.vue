<template>
    <div class="parentx">
        <div class="demo-alignment" style="margin-bottom:20px">
            <b-dropdown text="Ações" variant="danger">
                <b-dropdown-item>
                    <span class="flex items-center">
                        <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                        <span v-on:click="deleteItemsChart">Deletar</span>
                    </span>
                </b-dropdown-item>
            </b-dropdown>
        </div>
        <div class="flex carrinho-item" v-for="(produtoCor, indexItem) in this.produtosCarrinho" :key="indexItem">
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
                    <!-- <vs-select v-model="produtoCor.embarque.id">
                        <vs-select-item
                            :key="index"
                            :value="embarque.id"
                            :text="embarque.nome"
                            v-for="(embarque, index) in getEmbarquesProdutos()"
                        />
                    </vs-select> -->
                    <b-form-select 
                        v-model="produtoCor.embarque.id" 
                        :options="getEmbarquesSelect(produtoCor.embarque)"
                        value-field="id"
                        text-field="nome"
                        v-on:change="getSelectedItem(produtoCor.embarque)"
                        size="md" 
                        class="mt-3"
                    >
                        <template v-slot:first>
                            <option value="" disabled>-- Please select an option --</option>
                        </template>
                    </b-form-select>
                </div>
            </div>
            <div class="vx-col mx-1 w-1/6" style="justify-content:center;margin:auto">
                <div class="vx-col text-center">
                    <span style="font-weight:bold">Qntd: {{produtoCor.cor.quantidade}}</span>
                </div>
                <div class="vx-row text-center justify-center">
                    <span style="font-weight:bold">{{getCoinFormat(getAmountValueBuy(produtoCor.cor.precoCusto, produtoCor.cor.quantidade))}}</span>
                </div>
            </div>
            <div class="vx-col mx-1" style="justify-content:center;margin:auto">
                <div class="vx-col text-center" @click.stop="setPopupAddProduto(produtoCor)">
                    <feather-icon class="cursor-pointer" icon="EditIcon" svgClasses="w-6 h-6" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
import Storage from "../../rapidsoft/utils/storage";
import ProdutoDB from "../../rapidsoft/db/produtoDB";
import UtilMask from '../../rapidsoft/utils/utilMask'
// import ProdutoUtils from '../../rapidsoft/utils/produtoUtils'
import ErrorDB from "../../rapidsoft/db/errorDB";

export default {
    name: 'carrinho-item',
    model: {
        prop: 'produtos',        
    },
    props: {
        segmento: {
            type: Object,
            required: true,
        },
        produtos: {
            type: Array,
            required: true,
        },
        embarques: {
            type: Array,
            required: true,
        }
    },
	data: () => ({
        dataAtual: new Date().getTime(),
        itensSelecionados: [],
        produtosCarrinho: [],    		
    }),
    watch: {
    },
	components: {
	},
	computed: {
        getProdutosCorSegmento() {
			return this.produtosCarrinho;
        },
        
	},
    methods: {
        getEmbarquesSelect(embarque) {
            return this.embarques.filter((emb) => {
                return (emb.dataInicio > this.dataAtual || emb.dataFim < this.dataAtual) 
                    && (emb.dataInicio >= embarque.dataInicio || emb.dataFim <= embarque.dataFim);
            });
        },
		getTamanhosProduto(index) {
			return this.produtosCarrinho[index].cor.tamanhos
        },
        getSelectedItem(itemSelecionado) {
            console.log(itemSelecionado);
            console.log(this.produtosCarrinho);            
            this.$emit('atuliza-embarques');
        },
		setPopupAddProduto(produto){
			ProdutoDB.getProdutoEdicaoCarrinho(produto).then((result) => {
				const produtoEdicao = {
					produtoA: result,
					produtoB: null,
                };
                this.$emit('edicao-item-carrinho', produtoEdicao);
            });
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
		deleteItemsChart() {
            const itensCarrinho = Storage.getCarrinhoItens();
            const itensCarrinhoNew = itensCarrinho.filter(produto => {
                return !this.itensSelecionados.some(item => {
                    return produto.idProduto === item.cor.idProduto ;
                });
            });
            Storage.setCarrinhoItens(itensCarrinhoNew);
            this.itensSelecionados = [];
            this.carregaItensTela();
        },
	},
	beforeCreate() {		
	},
	created() {
        this.produtosCarrinho = this.produtos;
	},
    mounted() {
        
    },
	errorCaptured(err, vm, info) {
        ErrorDB._criarLog({ err, vm, info });
        return true;
    }

};
</script>

<style lang="scss">

.carrinho-item {
    padding:10px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2); 
    margin-top:10px;
}

</style>