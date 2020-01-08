<template>
    <div>
        <div class="embarque-item" v-for="(embarqueItem, indexItem) in this.embarques" :key="indexItem">

            <div class="vx-row">
                <div class="vx-col w-full mb-2">
                    <label for="dataFundacao" class="vs-input--label">Embarque</label>
                    <b-form-select 
                        v-model="embarqueItem.id" 
                        value-field="id"
                        text-field="nome"
                        :options="embarques" 
                        disabled />
                </div>
                <div class="vx-col sm:w-1/5 w-full mb-2">
                    <label for="dataEmbarque" class="vs-input--label">Data Embarque</label>
                    <datepicker
                        @input="changeData(indexItem)"
                        placeholder="DD/MM/AAAA" 
                        v-model="embarqueItem.dataEmbarque" 
                        format="dd/MM/yyyy" 
                        name="dataEmbarque" 
                        :language="langSettings"  
                        input-class="vs-inputx vs-input--input normal rapid-input-date">
                    </datepicker>
                </div>
                <div class="vx-col sm:w-1/3
                 w-full mb-2">
                    <strong>Qtde Itens: </strong>{{embarqueItem.quantidade}}
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <strong>Total: </strong>{{embarqueItem.total}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>

// import _ from "lodash";
import ErrorDB from "../../rapidsoft/db/errorDB";
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale";
// import ProdutoUtils from '../../rapidsoft/utils/produtoUtils'
export default {
    name: "embarque-item",
    model: {
        prop: 'embarques',
        event: 'carregaItensTela'
    },
    props: {
        embarques: {
            type: Array,
            required: true,
        },
    },
    data: () => ({
        langSettings: lang.ptBR,
        dataEmbarque: "",
        embarqueSelecionado:"",
        produtosCarrinho:"",
        listEmbarqueItems: [],
        itensCarrinho: [],
    }),
    components: {
        Datepicker,
    },
    computed: {
        getEmbarquesSelect() {
            return [];
        }
    },
    methods: {
        getCoinFormat(value) {
			return ("R$ " + value.toFixed(2).toString().replace(".", ","));
        },
        carregaItensTela() {
        },
        changeData(indexItem) {
            this.embarques[indexItem].dataEmbarque = this.embarques[indexItem].dataEmbarque.getTime();
        }
    },
    beforeCreate() {

    },
    created() {
        
    },
    mounted() {
    
    },
    updated() {
        console.log("EmbarqueItem update");
	},
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