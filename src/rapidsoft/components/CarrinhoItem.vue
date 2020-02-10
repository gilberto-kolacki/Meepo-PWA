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
                <div class="vx-row" style="font-weight:bold;">{{'Cor: ' + produtoCor.nomeCor}}</div>
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
                    <b-form-select 
                        v-model="produtoCor.embarque" 
                        :options="getEmbarquesSelect(produtoCor.embarque)"
                        value-field="id"
                        text-field="nome"
                        v-on:change="getSelectedItem(produtoCor.embarque)"
                        size="md" 
                        class="mt-3"
                    >
                        <template v-slot:first>
                            <option value="" disabled>Selecione...</option>
                        </template>
                    </b-form-select>
                </div>
            </div>
            <div class="vx-col mx-1 w-1/6" style="justify-content:center;margin:auto">
                <div class="vx-col text-center">
                    <span style="font-weight:bold">Qntd: {{produtoCor.quantidade}}</span>
                </div>
                <div class="vx-row text-center justify-center">
                    <span style="font-weight:bold">{{getCoinFormat(getAmountValueBuy(produtoCor.precoCusto, produtoCor.quantidade))}}</span>
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
import UtilMask from '../../rapidsoft/utils/utilMask';
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
            type: Object,
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
            const mapEmbarques = new Map(Object.entries(this.embarques));
            const embarqueProduto = mapEmbarques.get(String(embarque))
            
            return [...mapEmbarques.values()].filter((emb) => {
                return (emb.dataInicio > this.dataAtual || emb.dataFim < this.dataAtual) 
                    && (emb.dataInicio >= embarqueProduto.dataInicio || emb.dataFim <= embarqueProduto.dataFim);
            });
        },
		getTamanhosProduto(index) {
			return this.produtosCarrinho[index].tamanhos
        },
        getSelectedItem(itemSelecionado) {
            console.log(itemSelecionado);
            this.$emit('atuliza-embarques');
        },
		setPopupAddProduto(produto){
			ProdutoDB.getProdutoEdicaoCarrinho(produto).then((result) => {
                this.$emit('edicao-item-carrinho', result);
            });
		},
		getCoinFormat(value) {
			return ("R$ " + value.toFixed(2).toString().replace(".", ","));
		},
		calcularPrecoProduto(produto) {
            const percentual = _.toNumber(this.grupoCliente.porcentagem);
            const precoProduto = produto.cores[this.corSelecionada].precoCusto;
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
                    return produto.idProduto === item.idProduto ;
                });
            });

            Storage.setCarrinhoItens(itensCarrinhoNew);
            this.produtosCarrinho = this.getProdutosListNew();
            this.itensSelecionados = [];
            this.$emit('atualiza-lista-produtos');
            this.$forceUpdate();

        },
        getProdutosListNew(){
            return this.produtosCarrinho.filter(produto => {
                return !this.itensSelecionados.some(item => {
                    return produto.idProduto === item.idProduto ;
                });
            });
        }
	},
	beforeCreate() {		
	},
	created() {
        try {
            console.log(this.produtos);
            
            this.produtosCarrinho = this.produtos;
        } catch (error) {
            console.log(error);
        }
	},
    mounted() {
        
    },
	async errorCaptured(err, vm, info) {
        await ErrorDB._criarLog({ err, vm, info });
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