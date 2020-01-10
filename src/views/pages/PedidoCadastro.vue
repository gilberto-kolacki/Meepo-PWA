<template>
    <div>
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-save"  @click="finalizarPedido(pedido)" >Salvar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarPedido()" icon="icon-x">Voltar</vs-button>
        <b-tabs content-class="mt-5" justified>
            <b-tab  active lazy>
                <template v-slot:title>
                    <strong>
                        <feather-icon icon="FileTextIcon" style="color:warning;" class="cursor-pointer"/>
                        Capa
                    </strong>
                </template>
                <div class="my-6" v-if="pedido">
                    <div class="vx-row">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="2" vs-sm="3" vs-xs="12" >
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">CPF/CNPJ</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="pedido.cliente.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                            </div>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="9" vs-xs="12">
                            <vs-input v-validate="'required'" label="Nome" id="nome" name="nome" disabled v-model="pedido.cliente.nome" class="w-full input-line-group-rapid" />
                            <vs-button
                                color="primary"
                                type="filled"
                                icon-pack="feather"
                                class="w-full btn-line-group-rapid"
                                icon="icon-search"                                    
                                @click.stop="abrirPesquisaCliente()"
                            ></vs-button>
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                            <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="pedido.cliente.emailNfe" class="w-full" type="email" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                            <vs-input label="Grupo Cliente" id="grupoCliente" name="grupoCliente" v-model="pedido.cliente.grupoCliente.nome" disabled class="w-full" type="text" />
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full">
                            <label for="estadosFiltro" class="vs-input--label">Endereço de entrega</label>
                            <v-select id="endEntrega" name="endEntrega" :clearable=false v-model="pedido.endEntrega" :options="getEnderecosEntrega" :dir="$vs.rtl ? 'rtl' : 'ltr'"/> 
                        </div>
                    </div>
                    
                    <vs-divider class="mb-0">Formas de Pagamento</vs-divider>
                    
                    <div class="vx-row flex justify-between" style="padding-left:25px;padding-right:25px;padding-top:10px">
                        <vs-col vs-type="flex" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 1" icon="icon-percent" v-model="pedido.desconto1" icon-after/>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 2" icon="icon-percent" v-model="pedido.desconto2" icon-after/>
                        </vs-col>
                        <vs-col style="display:flex;justify-content: flex-end;" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 3" icon="icon-percent" v-model="pedido.desconto3" icon-after/>
                        </vs-col>
                    </div>
                
                    <div class="vx-row flex justify-between" style="margin-left:20px;margin-right:20px;padding-top:20px">
                        
                        <vs-col vs-lg="5" vs-sm="5" vs-xs="12">
                            
                            <div class="vx-row" style="justify-content: flex-start;">
                                <vs-checkbox v-model="pedido.pedidoParcial"></vs-checkbox>
                                <label>Aceita Pedido Parcial</label>
                            </div>

                            <div class="vx-row" style="justify-content: flex-start;">
                                <vs-checkbox v-model="pedido.antecipacaoPedido"></vs-checkbox>
                                <label>Aceita Antecipação do Pedido </label>
                            </div>

                            <div class="vx-row" style="justify-content: flex-start;">
                                <vs-checkbox @input="setBrinde()" v-model="pedido.brinde"></vs-checkbox>
                                <label>Brinde </label>
                            </div>

                        </vs-col>

                        <vs-col vs-lg="5" vs-sm="5" vs-xs="12">

                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Enviar Cópia Por Email </label>
                                <vs-checkbox v-model="pedido.copiaEmail"></vs-checkbox>
                            </div>

                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Orçamento</label>
                                <vs-checkbox v-model="pedido.orcamento"></vs-checkbox>
                            </div>

                        </vs-col>

                    </div>

                    <div class="vx-row" style="margin-top:10px;padding-right:25px;padding-left:25px">
                        <vs-col vs-lg="5" vs-sm="6" vs-xs="12">
                            <label style="font-size:smaller">Forma de Pagamento</label>
                            <v-select 
                                @input="selecionarCondicaoPagamento()"
                                id="formaPgto" 
                                style="width:100%" 
                                :clearable=false 
                                v-model="pedido.formaPagamento" 
                                :options="getFormasPagto" 
                                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                            />
                        </vs-col>
                        <vs-col vs-lg="5" vs-sm="6" vs-xs="12">
                            <label style="font-size:smaller">Condição de Pagamento</label>
                            <v-select 
                                id="condicaoPgto" 
                                style="width:100%" 
                                :clearable=false
                                v-model="pedido.condicaoPagamento" 
                                :options="getCondPagtoFormaPagto(pedido.formaPagamento)" 
                                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                            />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-textarea v-model="pedido.observacao" style="margin-top:30px" label="Observação" height="100" />
                        </vs-col>
                    </div>
                </div>
            </b-tab>
            <b-tab>
                <template v-slot:title>
                    <strong>
                        <feather-icon icon="ServerIcon" style="color:warning;" class="cursor-pointer"/>
                        Itens
                    </strong>
                </template>
                <div class="parentx">
                    <div v-for="(item, indexItem) in itensPedido" :key="indexItem">
                        <div class="flex carrinho-item" v-if="!item.remove">
                            <div class="vx-col w-3/12 mx-6" style="justify-content:center;margin:auto">
                                <div class="vx-row" style="font-weight:bold;">
                                    <!-- {{"Data: " + getDateFromStringDate(item.embarque)}} -->
                                    Data: {{ item.embarque.dataEmbarque | formatDate}}
                                </div>
                                <div class="vx-row" style="font-weight:bold;">
                                    {{item.sku}}
                                </div>
                                <div class="vx-row">
                                    {{pedido.cliente.nome.substring(0,14)}}
                                </div>
                            </div>
                            <div class="vx-col w-2/12 mx-10" style="justify-content:center;margin:auto">
                                <div class="vx-row">Tamanho</div>
                                <div class="vx-row" style="font-weight:bold;">{{item.codigo}}</div>
                            </div>
                            <div class="vx-col w-3/12 mx-10" style="justify-content:center;margin:auto">
                                <div class="vx-row" style="font-weight:bold;">
                                    <vs-input-number color="primary" v-model="item.quantidade" label="Qnt"/>
                                </div>
                            </div>
                            <div class="vx-col w-3/12 mx-10" style="justify-content:center;margin:auto">
                                <div class="vx-row">Valor</div>
                                <div class="vx-row" style="font-weight:bold;">R$ 58,90</div>
                            </div>
                            <div class="vx-col w-1/12 mx-10" style="justify-content:center;margin:auto">
                                <vs-button type="filled" size="small" icon-pack="feather" color="primary" icon="icon-x" @click="deletarMessage(item)"/>
                            </div>
                        </div>
                    </div>
                </div>
            </b-tab>
        </b-tabs>
        <search-cliente @search-selected="selectSearchCliente" :id="idPopUpSearch"></search-cliente>
    </div>
</template>

<script>

import { Validator } from 'vee-validate';
import validatePtBR from '../../rapidsoft/validate/validate_ptBR'
import Datepicker from 'vuejs-datepicker';
import vSelect from 'vue-select';
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import _ from 'lodash'
import ErrorDB from '../../rapidsoft/db/errorDB'
import SearchCliente  from '../../rapidsoft/components/SearchCliente'
import PedidoDB from "../../rapidsoft/db/pedidoDB";
// import PedidoUtils from "../../rapidsoft/utils/pedidoUtils";

Validator.localize('pt', validatePtBR);

export default {
    data() {
        return {  
            idPopUpSearch: 'popup-cliente-search',  
            pedido: null,
            data:null,
            formasPagto:[],
            condicoesPagto:[],
            condigoBrinde: 5,
            condigoBoleto: 1,
            itensPedido: [],
        }
    },
    components: {
        Datepicker,
        'v-select': vSelect,
        SearchCliente,
    },
    watch: {

    },
    computed:{

        getFormasPagto() {
            return this.formasPagto.map((formaPagto) => this.getValueSelectFormaPagto(formaPagto));
        },

        getEnderecosEntrega() {
            if (this.pedido.cliente.enderecos && this.pedido.cliente.enderecos.length > 0) {
                return this.pedido.cliente.enderecos.map((endereco) => {
                    return endereco;
                });
            } else return [];
        },
        
    },
    methods: {

        selectSearchCliente(cliente) {
            this.pedido.cliente = cliente;
        },

        abrirPesquisaCliente() {
            this.$bvModal.show(this.idPopUpSearch);
        },

        setBrinde(){
            if (this.pedido.brinde) {
                const brinde = _.find(this.formasPagto, (formaPagto) => formaPagto.id == this.condigoBrinde );
                this.pedido.formaPagamento = this.getValueSelectFormaPagto(brinde);
            } else {
                this.pedido.formaPagamento = null;
            }
            this.pedido.condicaoPagamento = null;
        },

        getCondPagtoFormaPagto(formaPagamento) {
            if (formaPagamento) {
                return formaPagamento.formaPgto.condicoes.map((condPagto) => {
                    return {label:condPagto.nome, value:condPagto.id, formaPgto:condPagto}
                });
            }
        },

        selecionarCondicaoPagamento() {
            
            const formaPagto = this.pedido.formaPagamento.formaPgto;
            
            if (formaPagto.id === this.condigoBrinde) {
                this.pedido.brinde = true;
                this.condicoesPagto = null;
                this.pedido.condicaoPagamento = null;
            } else if (formaPagto.id == this.condigoBoleto) {
                this.condicoesPagto = null;
                this.pedido.condicaoPagamento = null;
            } else {
                this.pedido.condicoesPagamento = [];
                const condicoes = formaPagto.condicoes && formaPagto.condicoes.length > 0 ? formaPagto.condicoes : [];
                this.condicoesPagto = condicoes;
                if (condicoes.length > 0) {
                    this.pedido.condicaoPagamento = {
                        value: condicoes[0].id,
                        label:condicoes[0].nome,
                        parcelas:condicoes[0].parcelas
                    };
                }
            }
        },

        getValueSelectFormaPagto(formaPagto) {
            return {label:formaPagto.nome, value:formaPagto.id, formaPgto:formaPagto};
        },

        carregaItensTela() {
			return new Promise((resolve) => {
                document.getElementById('loading-bg').style.display = null;
                FormaPagtoDB._getAll().then((formaPagto) => {
                    this.formasPagto = formaPagto;
                    PedidoDB.getPedido(this.$route.params.pedidoId, true).then((pedido) => {

                        console.log(pedido);
                        
                        this.pedido = pedido;
                        this.itensPedido = pedido.itens;
                        document.getElementById('loading-bg').style.display = "none";
                        resolve();
                    })
                })
            });
        },

        deletarMessage(data) {
            this.$vs.dialog({
                type:'confirm',
                color:'danger',
                title:'Deseja excluir?',
                text:'Você está prestes a excluir um item do pedido. Deseja continuar?',
                accept:this.deletarItemPedido,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
                parameters: data
            })
        },
        deletarItemPedido(parametersItemPedido) {
            this.pedido.itens = _.remove(this.pedido.itens, (itemPedido) => itemPedido.id !== parametersItemPedido.id);
            PedidoDB.deletarItemPedido(this.pedido).then(() => {
                this.carregaItensTela();
            });
        },
        finalizarPedido(pedido) {
            PedidoDB.atualizarPedido(pedido).then(() => {
                this.voltarPedido();
            });
        },
        getDateFromStringDate(inputFormat) {
            if (inputFormat.dataEmbarque) {
                const date = inputFormat.dataEmbarque.substring(0,10);
                return date.split('-').reverse().join('/');
            } else {
                return '-';
            }
        },
        voltarPedido() {
            this.$router.go(-1);
        },
    },
    created() {
        if(navigator.platform === "iPad") {
            this.isIpad= true;
        } else {
            this.isIpad= false;
        }
    },
    mounted() {
        this.carregaItensTela();
    },
    beforeCreate() {
    },
    errorCaptured(err, vm, info) {
        ErrorDB.criarLog({err, vm, info});
        return true;
    },
    afterMounted() {
    }
}

</script>

<style lang="scss">

.celulaTable {
    border-color:#808080;
    font-weight:bold;
    min-width:30px;
    padding:5px;
}

.carrinho-item {
    padding:10px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2); 
    margin-top:10px;
}

.mb-base-button {
    margin-bottom: 0.8rem !important;
}

.con-img-upload .img-upload {
    width: 185px;
    height: 185px;
}

.my-5-top {
    margin-top: 1.25rem !important;    
}

.vdp-datepicker input:blur {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .15);
}

.vx-card {
    width: 100%
}

.vs-input--input.normal {
    font-size: 0.75rem;
}

</style>
