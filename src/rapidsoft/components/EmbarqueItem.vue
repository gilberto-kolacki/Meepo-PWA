<template>
    <div style="min-height:800px">
        <div class="embarque-item" v-for="(embarqueItem, indexItem) in listEmbarqueItems" :key="indexItem">
            <div class="vx-row flex justify-between">
                <div class="vx-col mx-1">
                    <span class="titulo_item" style="margin-top:2px">Embarque:</span>
                    <!-- <v-select id="embarques" name="embarque" v-model="embarqueItem.embarque" :options="embarques"/> -->
                    <b-form-select style="display:flex;width:200px" v-model="embarqueItem.id" :options="embarques" size="lg"></b-form-select>
                </div>
                <div class="vx-col mx-1">
                    <span class="titulo_item">Data Embarque:</span>
                    {{getDateFromStringDate(embarqueItem.dataEmbarque)}}
                    <datepicker
                        v-validate="'required'" 
                        placeholder="DD/MM/AAAA" 
                        v-model="dataEmbarque" 
                        format="dd/MM/yyyy" 
                        id="dataFundacao" 
                        name="dataFundacao" 
                        ref="dataFundacao" 
                        :language="langSettings" 
                        wrapper-class="w-full"
                        input-class="vs-inputx vs-input--input normal">
                    </datepicker>
                </div>
                <div class="vx-col mx-1" style="display:flex;margin:auto">
                    <table> 
                        <tr>
                            <td style="font-weight:bold">Qtde Itens</td>
                            <td style="padding-left:10px">{{embarqueItem.quantidade}}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold">Total</td>
                            <td style="padding-left:10px">{{getCoinFormat(embarqueItem.total)}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ErrorDB from "../../rapidsoft/db/errorDB";
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale";
import vSelect from 'vue-select';
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import ProdutoUtils from '../../rapidsoft/utils/produtoUtils'
export default {
    name: "embarque-item",
    props: {
    },
    data: () => ({
        langSettings: lang.ptBR,
        dataEmbarque: "",
        embarques:[],
        embarqueSelecionado:"",
        produtosCarrinho:"",
        listEmbarqueItems: [],
    }),
    components: {
        Datepicker,
        'v-select': vSelect,
    },
    computed: {},
    methods: {
        getProdutosPorEmbarques(idEmbarque) {
            let produtos = [];
            let quantProdutosEmbarque = 0;
            let totalProdutosEmbarque = 0;
            let dataEmbarque = 0;
            let embarque = [];

            ProdutoUtils.getCarrinho().then(carrinho => {
                produtos = carrinho.filter(produto => {
                    return produto.embarque.id === idEmbarque;
                });
                if (produtos.length > 0) {
                    let embarqueSelecionado = "";
                    produtos.forEach(item => {
                        quantProdutosEmbarque += item.cor.quantidade;
                        totalProdutosEmbarque = item.cor.quantidade * item.cor.precoVenda;
                        dataEmbarque = item.embarque.dataInicio;
                        embarqueSelecionado = item.embarque;
                    });
                    embarque.push(embarqueSelecionado.nome)
                    this.listEmbarqueItems.push({id:idEmbarque,embarque,dataEmbarque,quantidade: quantProdutosEmbarque,total: totalProdutosEmbarque})
                }
                
            });
        },
        getProdutosEmbarques() {
            const embarques = [];
            EmbarqueDB._getAll().then(embarque => {
                embarques.push(embarque);
            });
            return embarques;
        },
        getCoinFormat(value) {
			return ("R$ " + value.toFixed(2).toString().replace(".", ","));
        },
        getDateFromStringDate(inputFormat) {
            function pad(valueDate) {
                return valueDate < 10 ? "0" + valueDate : valueDate;
            }
            var date = new Date(parseInt(inputFormat));
            this.dataEmbarque = [
                pad(date.getMonth() + 1),
                pad(date.getDate()),
                date.getFullYear()
            ].join("/");
        },
    },
    beforeCreate() {},
    created() {
        EmbarqueDB._getAll().then(embarques => {
            
            embarques.map((embarque) => {
                this.embarques.push({value:embarque.id, text:embarque.nome})
                this.getProdutosPorEmbarques(embarque.id);
            })
        });
    },
    mounted() {},
    errorCaptured(err, vm, info) {
        ErrorDB.criarLog({ err, vm, info });
        return true;
    }
};
</script>

<style lang="scss">

    .seleciona_embarque {
        box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .15);
    }
    .vdp-datepicker input{
        height: "38.6px";
        // box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .15);
    }
    .quantidade_item {
    font-size: 12px;
    margin-left: 5px;
    font-weight: bold;
    margin-right: 2%;
    }
    .titulo_item {
    font-size: 12px;
    }
    .embarque-item {
    padding: 10px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
    margin-top: 15px;
    }

</style>