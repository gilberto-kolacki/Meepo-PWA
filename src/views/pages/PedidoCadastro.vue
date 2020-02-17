<template>
    <div v-if="isShow">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-save" v-if="pedido.status == 10"  @click="finalizarPedido(pedido)" >Salvar</vs-button>
        <!-- <vs-button class="btn-confirm" color="rgb(36, 193, 160)" type="filled" icon-pack="feather" icon="icon-unlock" v-if="pedido.status != 10 && pedido.status < 45"  @click="mensagemMudarParaDigitacao(pedido)">Reabrir</vs-button> -->
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
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="9" vs-xs="12">
                            <vs-input v-validate="'required'" label="Nome" id="nome" name="nome" disabled v-model="pedido.cliente.nome" class="w-full input-line-group-rapid" />
                            <vs-button
                                color="primary"
                                type="filled"
                                icon-pack="feather"
                                class="w-full btn-line-group-rapid"
                                icon="icon-search"                                    
                                @click.stop="abrirPesquisaCliente()"
                                style="border-radius:0px"
                            ></vs-button>
                            <vs-button 
                                @click="abrirClienteNovo()" 
                                class="w-full btn-line-group-rapid"
                                color="success" 
                                type="filled" 
                                icon-pack="feather" 
                                icon="icon-plus"
                            ></vs-button>
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                            <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="pedido.cliente.emailNfe" class="w-full" type="email" inputmode="email" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                            <vs-input label="Grupo Cliente" id="grupoCliente" name="grupoCliente" v-model="pedido.cliente.grupoCliente.nome" disabled class="w-full" type="text" />
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full">
                            <label for="estadosFiltro" class="vs-input--label">Endereço de entrega</label>
                            <v-select id="endEntrega" 
                                @input="setEndEntrega()"
                                name="endEntrega" 
                                :clearable=false 
                                v-model="enderecoEntregaSelecionado" 
                                :options="getEnderecosEntrega" 
                                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                            /> 
                        </div>
                    </div>
                    
                    <vs-divider class="mb-0">Formas de Pagamento</vs-divider>
                    
                    <div class="vx-row flex justify-between" style="padding-left:25px;padding-right:25px;padding-top:10px">
                        <vs-col vs-type="flex" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 1" icon="icon-percent" v-model="pedido.desconto1" inputmode="decimal" icon-after/>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 2" icon="icon-percent" v-model="pedido.desconto2" inputmode="decimal" icon-after/>
                        </vs-col>
                        <vs-col style="display:flex;justify-content: flex-end;" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 3" icon="icon-percent" v-model="pedido.desconto3" inputmode="decimal" icon-after/>
                        </vs-col>
                    </div>
                
                    <div class="vx-row flex justify-between" style="margin-left:20px;margin-right:20px;padding-top:20px">
                        <vs-col vs-lg="5" vs-xs="12">
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
                        </vs-col>
                    </div>

                    <div class="vx-row mt-10" style="padding-right:25px;padding-left:25px">
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                            <label style="font-size:smaller">Forma de Pagamento</label>
                            <v-select 
                                @input="setFormaDePagamento()"
                                id="formaPgto" 
                                style="width:100%" 
                                :clearable=false 
                                v-model="formaDePagamentoSelecionada" 
                                :options="getFormasPagto" 
                                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                            />
                        </vs-col>
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12" v-if="temCondicaoDePagamento" >
                            <label style="font-size:smaller">Condição de Pagamento</label>
                            <v-select
                                @input="setCondicaoDePagamento()"
                                id="condicaoPgto" 
                                style="width:100%" 
                                :clearable=false
                                v-model="condicaoDePagamentoSelecionada" 
                                :options="getCondicoesDePagamento" 
                                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                            />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-textarea v-model="pedido.observacao" style="margin-top:30px" label="Observação" height="100" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-button 
                                v-if="pedido.status == 20" 
                                class='w-full' 
                                color="rgb(36, 193, 160)" 
                                type="filled" 
                                icon-pack="feather" 
                                icon="icon-lock"
                                @click="mensagemMudarParaDigitacao(pedido)"
                            >
                                Reabrir Pedido
                            </vs-button>
                            <vs-button 
                                v-if="pedido.status == 10"
                                class='w-full' 
                                color="primary" 
                                type="filled" 
                                icon-pack="feather" 
                                icon="icon-unlock"
                                @click="mensagemMudarParaEnviar(pedido)"
                            > 
                              Finalizar Pedido
                            </vs-button>
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
                                    Data: {{ pedido.dataEmbarque | formatDate}}
                                </div>
                                <div class="vx-row" style="font-weight:bold;">
                                    {{item.sku}}
                                </div>
                                <div class="vx-row">
                                    {{pedido.cliente.nome}}
                                </div>
                            </div>
                            <div class="vx-col w-2/12 mx-10" style="justify-content:center;margin:auto">
                                <div class="vx-row">Tamanho</div>
                                <div class="vx-row" style="font-weight:bold;">{{item.tamanho}}</div>
                            </div>
                            <div class="vx-col w-3/12 mx-10" style="justify-content:center;margin:auto">
                                <div class="vx-row" style="font-weight:bold;">
                                    <vs-input-number v-if="pedido.status == 10" color="primary" v-model="item.quantidade" label="Qnt"/>
                                    <vs-input-number v-else disabled color="primary" v-model="item.quantidade" label="Qnt"/>
                                </div>
                            </div>
                            <div class="vx-col w-3/12 mx-10" style="justify-content:center;margin:auto">
                                <div class="vx-row">Valor</div>
                                <div class="vx-row" style="font-weight:bold;">{{item.precoCusto | moneyy(pedido.grupoCliente)}}</div>
                            </div>
                            <div class="vx-col w-1/12 mx-10" style="justify-content:center;margin:auto">
                                <vs-button v-if="pedido.status == 10" type="filled" size="small" icon-pack="feather" color="primary" icon="icon-x" @click="deletarMessage(item)"/>
                                <vs-button v-else disabled type="filled" size="small" icon-pack="feather" color="primary" icon="icon-x"/>
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

import _ from 'lodash';
import Datepicker from 'vuejs-datepicker';
import vSelect from 'vue-select';
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import ErrorDB from '../../rapidsoft/db/errorDB'
import SearchCliente  from '../../rapidsoft/components/SearchCliente';
import PedidoDB from "../../rapidsoft/db/pedidoDB";
// import PedidoUtils from "../../rapidsoft/utils/pedidoUtils";

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
            formaDePagamentoSelecionada: {},
            condicaoDePagamentoSelecionada: {},
            enderecoEntregaSelecionado: {},
            temCondicaoDePagamento: true,
            isShow:false,
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
            return this.formasPagto.map((formaPagto) => {
                return {value:formaPagto.id, label:formaPagto.nome, condicoes: formaPagto.condicoes};
            });
        },

        getCondicoesDePagamento() {
            if (this.formaDePagamentoSelecionada && this.formaDePagamentoSelecionada.condicoes.length > 0) {
                return this.formaDePagamentoSelecionada.condicoes.map((condicaoDePagamento) => {
                    return {value:condicaoDePagamento.id, label:condicaoDePagamento.nome};
                });
            } else return [];
        },
        
        getEnderecosEntrega() {
            if (this.pedido.cliente.enderecos && this.pedido.cliente.enderecos.length > 0) {
                return this.pedido.cliente.enderecos.map((endereco, index) => {
                    return {value: index, label: this.getLabelEndereco(endereco), endereco: endereco};
                });
            } else return [];
        },
        
    },
    methods: {
        setEndEntrega() {
            this.pedido.endEntrega['cep'] =  this.enderecoEntregaSelecionado.endereco['cep'];
            this.pedido.endEntrega['endereco'] =  this.enderecoEntregaSelecionado.endereco['endereco'];
            this.pedido.endEntrega['bairro'] =  this.enderecoEntregaSelecionado.endereco['bairro'];
            this.pedido.endEntrega['cidade'] =  this.enderecoEntregaSelecionado.endereco['cidade'];
            this.pedido.endEntrega['numero'] =  this.enderecoEntregaSelecionado.endereco['numero'];
            this.pedido.endEntrega['complemento'] =  this.enderecoEntregaSelecionado.endereco['complemento'];
            this.pedido.endEntrega['telefone'] =  this.enderecoEntregaSelecionado.endereco['telefone'];
            this.pedido.endEntrega['principal'] =  this.enderecoEntregaSelecionado.endereco['principal'];
            this.pedido.endEntrega['idCidade'] =  this.enderecoEntregaSelecionado.endereco['idCidade'];
        },
        getLabelEndereco(endereco) {
            return endereco ? endereco.endereco +', Nº'+ endereco.numero +' - CEP: '+ endereco.cep : null;
        },
        mensagemMudarParaDigitacao(pedido) {
            this.$vs.dialog({
                type:'confirm',
                color:'danger',
                title:'Deseja reabrir?',
                text:'Você esta prestes a reabrir o pedido. Deseja continuar?',
                accept:this.mudarStatusPedido,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
                parameters: pedido
            })
        },

        mensagemMudarParaEnviar(pedido) {
            this.$vs.dialog({
                type:'confirm',
                color:'danger',
                title:'Deseja finalizar?',
                text:'Você esta prestes a finalizar o pedido. Deseja continuar?',
                accept:this.mudarStatusPedido,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
                parameters: pedido
            });
        },

        mudarStatusPedido(pedido) {
            if (pedido.status === 20) {
                this.pedido.status = 10;
                PedidoDB.atualizarStatusPedido(pedido);
                this.$forceUpdate();
            } else {
                pedido.status = 20;
                PedidoDB.atualizarStatusPedido(pedido);
                this.$forceUpdate();
            }
        },

        selectSearchCliente(cliente) {
            this.pedido.cliente = cliente;
        },

        abrirClienteNovo() {
            this.$router.push('./cliente/cadastro');
        },

        abrirPesquisaCliente() {
            this.$bvModal.show(this.idPopUpSearch);
        },

        setCondicaoDePagamento() {
            this.pedido.condicaoPagamento = this.condicaoDePagamentoSelecionada.value;
        },

        setFormaDePagamento() {
            this.pedido.formaPagamento = this.formaDePagamentoSelecionada.value;
            if (this.formaDePagamentoSelecionada.value == this.condigoBrinde) {
                this.pedido.brinde = true;
                this.setBrinde();
            } else {
                this.condicaoDePagamentoSelecionada = {
                    value: this.formaDePagamentoSelecionada.condicoes[0].id,
                    label:this.formaDePagamentoSelecionada.condicoes[0].nome,
                };
                this.pedido.brinde = false;
                this.temCondicaoDePagamento = true;
            }
        },

        setBrinde(){
            this.temCondicaoDePagamento = !this.pedido.brinde;
            this.pedido.formaPagamento = this.pedido.brinde ? this.condigoBrinde : null;
            this.pedido.condicaoPagamento = null;
        },

        async carregaItensTela() {
			return new Promise((resolve) => {
                PedidoDB.getPedido(this.$route.params.pedidoId, true).then((pedido) => {
                    this.pedido = pedido;
                    this.enderecoEntregaSelecionado = this.getLabelEndereco(this.pedido.endEntrega);
                    this.itensPedido = this.pedido.itens;
                    FormaPagtoDB.getDadosPagamento(this.pedido.formaPagamento, this.pedido.condicaoPagamento).then((dadosPagamento) => {
                        this.formasPagto = dadosPagamento.formasDePagamento;
                        this.formaDePagamentoSelecionada = dadosPagamento.formaPagamentoSelecionada;
                        this.condicaoDePagamentoSelecionada = dadosPagamento.condicaoPagamentoSelecionada;
                        this.isShow = true;
                        resolve();
                    });
                });
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
        notification(titulo,mensagem,cor) {
            this.$vs.notify({
                title: titulo,
                text: mensagem,
                color: cor,
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            });
        },
        deletarItemPedido(parametersItemPedido) {
            this.pedido.itens = _.remove(this.pedido.itens, (itemPedido) => itemPedido.sku !== parametersItemPedido.sku);
            PedidoDB.deletarItemPedido(this.pedido).then(() => {
                this.notification('Excluído!','Item excluído do pedido com sucesso!','primary');
                setTimeout(() => {
                    this.carregaItensTela();
                }, 400);
            });
        },
        finalizarPedido(pedido) {
            PedidoDB.atualizarPedido(pedido).then(() => {
                this.notification('Sucesso!','As alterações foram salvas com sucesso!','success');
                setTimeout(() => {
                    this.voltarPedido();
                }, 400);
            });
        },
        voltarPedido() {
            this.$router.push('/pedido/consulta');
        },
    },
    created() {

    },
    async mounted() {
        await this.carregaItensTela();
    },
    beforeCreate() {
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    },
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
