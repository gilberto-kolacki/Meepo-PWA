<template>
    <div id="embarque-itens" class="embarque-itens">
        <div class="embarque-item" v-for="(embarqueItem, indexItem) in this.getEmbarquesBySegmento" :key="indexItem">
            <div class="vx-row">
                <div class="vx-col w-full mb-2">
                    <label for="dataFundacao" class="vs-input--label">Embarque</label>
                    <b-form-select 
                        v-model="embarqueItem.id" 
                        value-field="id"
                        text-field="nome"
                        :options="getEmbarques(embarqueItem)"
                        v-on:change="getSelectedItem(embarqueItem)"
                        disabled
                    />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/5 w-full mb-2">
                    <label for="dataEmbarque" class="vs-input--label">Data Embarque</label>
                    <datepicker
                        @input="changeData(embarqueItem)"
                        placeholder="DD/MM/AAAA" 
                        v-model="embarqueItem.dataEmbarque" 
                        format="dd/MM/yyyy" 
                        name="dataEmbarque" 
                        :language="langSettings"  
                        :disabledDates="getDataDesabilitadas(embarqueItem)"
                        input-class="vs-inputx vs-input--input normal rapid-input-date"
                    >
                    </datepicker>
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <strong>Qtde Itens: </strong>{{embarqueItem.quantidade}}
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <strong>Sub Total: </strong>{{embarqueItem.totalBruto | moneyy}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import _ from "lodash";
import ErrorDB from "../../rapidsoft/db/errorDB";
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale";
import SegmentoDB from '../db/segmentoDB';
// import ProdutoUtils from '../../rapidsoft/utils/produtoUtils';

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
        embarquesOption: {
            type: Array,
            required: true,
        },
    },
    data: () => ({
        langSettings: lang.ptBR,
        embarqueSelecionado: null,
        segmentos: [],
        periodos: [],
    }),
    watch: {
    
    },
    components: {
        Datepicker,
    },
    computed: {
        getEmbarquesSelect() {
            return [];
        },
        getEmbarquesBySegmento() {
            return _.orderBy(this.embarques, ['idSegmento', 'nome'], ['asc', 'asc']);
        }
    },
    methods: {
        getCoinFormat(value) {
			return ("R$ " + value.toFixed(2).toString().replace(".", ","));
        },
        carregaItensTela() {
            
        },
        getSelectedItem(embarque) {
            console.log(embarque);

        },
        changeData(embarque) {
            embarque.dataEmbarque = typeof embarque.dataEmbarque === 'number' ? embarque.dataEmbarque : embarque.dataEmbarque.getTime();
            this.$emit('change-data-embarque', { id: embarque.id, dataEmbarque: embarque.dataEmbarque, segmento: embarque.idSegmento });
        },
        getSegmento(idSegmento) {
            if (idSegmento) {
                return _.find(this.segmentos, (segmento) => segmento.id === idSegmento);
            }
        },
        getEmbarques(embarque) {
            return this.embarquesOption.filter((emb) => {
                return emb.idSegmento == embarque.idSegmento;
            });
        },
        // caso o embarque tenha periodos, pegar a data ininial do promeiro periodo, e a data final do ultimo periodo
        //  inativar as data que não estiverem no periodo
        getDataDesabilitadas(embarque) {
            const datasDesativadas = (ranges) => {
                if (embarque.periodos) {
                    return { 
                        from: new Date(embarque.periodos[embarque.periodos.length-1].dataEmbarqueFim),
                        to: new Date(embarque.periodos[0].dataEmbarqueInicio),
                        days: [6, 0],
                        ranges: ranges
                    };
                } else {
                    return { 
                        from: new Date(embarque.dataFim),
                        to: new Date(embarque.dataInicio),
                        days: [6, 0],
                        ranges: ranges
                    };
                }
            }

            if (embarque.periodosExcecao) {
                const ranges = embarque.periodosExcecao.map((periodoExcecao) => { return {from: new Date(periodoExcecao.dataEmbarqueInicio - 86400000), to: new Date(periodoExcecao.dataEmbarqueFim + 86400000)}});
                return datasDesativadas(ranges);
            } else {
                return datasDesativadas([]);
            }
            
        }
    },
    beforeCreate() {

    },
    created() {
        
    },
    mounted() {
        SegmentoDB._getAll().then((segmentos) => {
            this.segmentos = segmentos;
        });
    },
    updated() {
        console.log("EmbarqueItem update");
        
	},
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({ err, vm, info });
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