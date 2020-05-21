<template>
    <div class="page-carrinho-pedido">
        <div class="m-2" justified v-if="this.showScreen">
            <vs-button class="btn-orcamento" color="success" type="filled" icon-pack="feather" icon="icon-file-text" @click="validarDadosOrcamento()">Orçamento</vs-button>
            <vs-button class="btn-pedido" color="warning" type="filled" icon-pack="feather" icon="icon-play" @click="validarDadosPedido()">Finalizar</vs-button>
            <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarCarrinho()" icon="icon-arrow-down">Carrinho</vs-button>
            <div class="my-6" v-if="this.pedidoCapa">
                <div class="vx-row">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="2" vs-sm="3" vs-xs="12" >
                        <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                            <label for="cpfCnpj" class="vs-input--label">Cliente</label>
                            <div class="vs-con-input">
                                <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="pedidoCapa.cliente.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                            </div>
                        </div>
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="9" vs-xs="12">
                        <vs-input v-validate="'required'" id="nomeCliente" name="nomeCliente" disabled v-model="pedidoCapa.cliente.nome" class="w-full input-group-rapid" />
                    </vs-col>
                </div>
                <div class="vx-row">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="pedidoCapa.emailNfe" class="w-full" type="email" />
                    </vs-col>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <label for="endEntrega" class="vs-input--label">Endereço de entrega</label>
                        <v-select 
                            id="endEntrega" 
                            v-model="endEntregaSel" 
                            :options="getEnderecosEntrega"
                            :clearable=false>
                        </v-select>
                    </div>
                </div>
                <div class="vx-row justify-center mt-5" style="margin-top:20px">
                    <vs-col vs-type="flex" vs-lg="4" vs-sm="4" vs-xs="12" style="justify-content: flex-start;">
                        <vs-input type="number" icon-pack="feather" label="Desc. Volume" icon="icon-percent" v-model="pedidoCapa.desconto1" icon-after/>
                    </vs-col>
                    <vs-col vs-type="flex" vs-lg="4" vs-sm="4" vs-xs="12" style="justify-content: center;">
                        <vs-input type="number" icon-pack="feather" label="Desc. Showroom" icon="icon-percent" v-model="pedidoCapa.desconto2" icon-after/>
                    </vs-col>
                    <vs-col vs-type="flex" vs-lg="4" vs-sm="4" vs-xs="12" style="justify-content: flex-end;">
                        <vs-input type="number" icon-pack="feather" label="Desc. Comercial" icon="icon-percent" v-model="pedidoCapa.desconto3" icon-after/>
                    </vs-col>
                </div>
                <div class="vx-row flex m-1 mb-5 mt-10">
                    <vs-col vs-lg="3" vs-sm="3" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label>Embarques: {{ getQtdeEmbarques }} </label>
                        </div>
                    </vs-col>
                    <vs-col vs-lg="3" vs-sm="3" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label>Peças: {{ getQuantidadeCapa }} </label>
                        </div>
                    </vs-col>
                    <vs-col vs-lg="3" vs-sm="3" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Subtotal: {{ getSubTotalCapa | moneyy }} </label>
                        </div>
                    </vs-col>
                    <vs-col vs-lg="3" vs-sm="3" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Total: {{ getTotalCapa | moneyy }} </label>
                        </div>
                    </vs-col>
                </div>
                <div class="vx-col justify-center mt-1 mr-10">
                    <div class="vx-row" style="justify-content: flex-end;">
                        <label>Aceita Pedido Parcial</label>
                        <vs-checkbox v-model="pedidoParcialCapa" ></vs-checkbox>
                    </div>
                    <div class="vx-row" style="justify-content: flex-end;">
                        <label>Aceita Antecipação do Pedido </label>
                        <vs-checkbox v-model="antecipacaoPedidoCapa"></vs-checkbox>
                    </div>
                    <div class="vx-row" style="justify-content: flex-end;">
                        <label>Enviar Cópia Por Email </label>
                        <vs-checkbox v-model="copiaEmailCapa"></vs-checkbox>
                    </div>
                </div>
                <div v-if="getQtdeEmbarques > 1">
                    <vs-divider>Faturamento</vs-divider>
                    <div class="vx-row flex" >
                        <div class="vx-col w-full">
                            <label>Forma de Pagamento</label>
                            <v-select
                                @input="alterarFormaPagamentoCapa()"                                   
                                id="formaPgto"
                                label="nome"  
                                style="width:100%" 
                                :clearable=false 
                                v-model="pedidoCapa.formaPagamento" 
                                :options="formasPagto" 
                            />
                        </div>
                    </div>
                    <vs-divider>Observação</vs-divider>
                    <div class="vx-row flex justify-between">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-textarea v-model="observacaoCapa" label="Ao alterar esta observação, a observação dos embarques será atualizada." height="100" />
                        </vs-col>
                    </div>
                </div>
            </div>
            <vs-divider><h4>Embarques</h4></vs-divider>
            <div class="embarque-item" style="padding:20px" v-for="(pedido, indexItem) in this.getListEmbarques" :key="indexItem">
                <div class="vx-row flex justify-between">
                    <vs-col vs-type="flex" vs-lg="12" vs-sm="12" vs-xs="12">
                        <h4><strong>Pedido:</strong> {{pedido.nome}} <strong>Seq:</strong> {{pedido.seq}}</h4>
                    </vs-col>
                </div>
                <div class="vx-row flex justify-between" style="margin-top:20px;padding-left:15px;margin-right:5px">
                    <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label>Quantidade: {{ pedido.quantidade }} </label>
                        </div>
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label>Subtotal: {{ pedido.totalBruto | moneyy }} </label>
                        </div>
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label><strong>Total: {{getTotalPedido(pedido) | moneyy }}</strong> </label>
                        </div>
                    </vs-col>
                    <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Aceita Pedido Parcial</label>
                            <vs-checkbox v-model="pedido.pedidoParcial" @click="selPedidoParcial()"></vs-checkbox>
                        </div>
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Aceita Antecipação do Pedido </label>
                            <vs-checkbox v-model="pedido.antecipacaoPedido" @click="selAntecipacaoPedido()"></vs-checkbox>
                        </div>
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Enviar Cópia Por Email </label>
                            <vs-checkbox v-model="pedido.copiaEmail" @click="selCopiaEmail()"></vs-checkbox>
                        </div>
                    </vs-col>
                </div>
                <div v-if="!isOrcamento">
                    <vs-divider>Faturamento</vs-divider>
                    <div class="vx-row flex justify-content" style="padding-bottom:15px">
                        <div class="vx-col sm:w-1/4 w-full mb-2">
                            <label>Data Embarque</label>
                            <datepicker
                                @input="alterarFormatoData(pedido),selecionarCondicaoPagamento(pedido)"
                                placeholder="DD/MM/AAAA" 
                                v-model="pedido.dataEmbarque" 
                                format="dd/MM/yyyy" 
                                name="dataEmbarque" 
                                :language="langSettings"  
                                :disabledDates="getDataDesabilitadas(pedido)"
                                input-class="vs-inputx vs-input--input normal rapid-input-date"
                                maximum-view="month"
                                calendar-class="margin-calendar"
                            />
                        </div>
                        <div class="vx-col sm:w-2/5 w-full mb-2">
                            <label>Forma de Pagamento</label>
                            <v-select 
                                @input="selecionarCondicaoPagamento(pedido)"
                                id="formaPgto"
                                label="nome"  
                                style="width:100%" 
                                :clearable=false 
                                v-model="pedido.formaPagamento" 
                                :options="formasPagto" 
                            />
                        </div>
                        <div class="vx-col sm:w-1/3 w-full mb-2" v-if="!pedido.brinde && condicoesPagto[pedido.id]">
                            <label>Condição de Pagamento</label>
                            <v-select
                                @input="alteraCondicaoPagamento(pedido)"
                                id="condicaoPgto" 
                                label="nome"
                                style="width:100%" 
                                :clearable=false
                                v-model="pedido.condicaoPagamento" 
                                placeholder="Selecione a opção"
                                :options="getCondicoesPagamento(pedido.id)" 
                            />
                        </div>
                    </div>
                </div>
                <div class="vx-row flex justify-between">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-textarea v-model="pedido.observacao" label="Observação" @input="alteraObservacao(pedido)" height="70" />
                    </vs-col>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import ErrorDB from "../../rapidsoft/db/errorDB";
import PedidoUtils from "../../rapidsoft/utils/pedidoUtils";
import Storage from "../../rapidsoft/utils/storage";
// import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import PedidoDB from "../../rapidsoft/db/pedidoDB";
import OrcamentoDB from "../../rapidsoft/db/orcamentoDB";
import vSelect from 'vue-select';
import CarrinhoDB from '../../rapidsoft/db/carrinhoDB';
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale";
import moment from 'moment';

export default {
	data: () => ({
        langSettings: lang.ptBR,
        pedidoCapa: null,
        isOrcamento: false,
        showScreen: false,
        formasPagto: [],
        condicoesPagto: {},
        embarques:[],
        condigoBrinde: 5,
        condigoBoleto: 1,
        endEntregaSel: {},
        pedidoParcialCapa: true,
        antecipacaoPedidoCapa: true,
        copiaEmailCapa: true,
        observacaoCapa: null,
    }),
    watch: {
        endEntregaSel(option) {
            this.pedidoCapa.endEntrega = {...option.value};
        },
        pedidoParcialCapa(newValue, oldValue) {
            if ((newValue != null && newValue != oldValue)) {
                this.pedidoCapa.listEmbarques.map((pedido) => pedido.pedidoParcial = this.pedidoParcialCapa);
            }
        },
        antecipacaoPedidoCapa(newValue, oldValue) {
            if ((newValue != null && newValue != oldValue)) {
                this.pedidoCapa.listEmbarques.map((pedido) => pedido.antecipacaoPedido = this.antecipacaoPedidoCapa);
            }
        },
        copiaEmailCapa(newValue, oldValue) {
            if ((newValue != null && newValue != oldValue)) {
                this.pedidoCapa.listEmbarques.map((pedido) => pedido.copiaEmail = this.copiaEmailCapa);
            }
        },
        observacaoCapa(newValue, oldValue) {
            if ((newValue != null && newValue != oldValue)) {
                this.pedidoCapa.observacao = this.observacaoCapa
                this.pedidoCapa.listEmbarques.map((pedido) => pedido.observacao = this.observacaoCapa);
            }
        },
    },
	components: {
        'v-select': vSelect,
        Datepicker,
    },
	computed: {    
        getListEmbarques() {
            return this.lodash.orderBy(this.pedidoCapa.listEmbarques, ['id', 'seq']);
        },
        getEnderecosEntrega() {
            const listaEnderecos = [this.getEndEntregaOption(this.pedidoCapa.cliente.endereco)];
            if (this.pedidoCapa.cliente.enderecos && this.pedidoCapa.cliente.enderecos.length > 0) {
                this.pedidoCapa.cliente.enderecos.map((endereco) => {
                    listaEnderecos.push(this.getEndEntregaOption(endereco));
                });
            }
            return listaEnderecos;
        }, 
        getQtdeEmbarques() {
            return this.pedidoCapa.listEmbarques.length;
        },
        getQuantidadeCapa() {
            return this.pedidoCapa.listEmbarques.reduce((total, pedido) => {
                return total + pedido.quantidade;
            }, 0);
        },  
        getSubTotalCapa() {
            return this.pedidoCapa.listEmbarques.reduce((total, pedido) => {
                return total + pedido.totalBruto;
            }, 0);
        },
        getTotalCapa() {
            return this.pedidoCapa.listEmbarques.reduce((total, pedido) => {
                return total +  this.getTotalPedido(pedido);
            }, 0);
        },
	},
    methods: {
        selPedidoParcial() {
            setTimeout(() => {
                if (this.pedidoCapa.listEmbarques.filter((pedido) => pedido.pedidoParcial == false).length > 0) {
                    this.pedidoParcialCapa = null;
                } else {
                    this.pedidoParcialCapa = true;
                }
            } ,10);
        },
        selAntecipacaoPedido() {
            setTimeout(() => {
                if (this.pedidoCapa.listEmbarques.filter((pedido) => pedido.antecipacaoPedido == false).length > 0) {
                    this.antecipacaoPedidoCapa = null;
                } else {
                    this.antecipacaoPedidoCapa = true;
                }
            } ,10);
        },
        selCopiaEmail() {
            setTimeout(() => {
                if (this.pedidoCapa.listEmbarques.filter((pedido) => pedido.copiaEmail == false).length > 0) {
                    this.copiaEmailCapa = null;
                } else {
                    this.copiaEmailCapa = true;
                }
            } ,10);
        },
        alterarFormatoData(pedido) {
            pedido.dataEmbarque = moment(pedido.dataEmbarque, ["DD/MM/YYYY"]).toDate().getTime();
        },
        selecionarCondicaoPagamento(pedido) {
            const formaPagto = pedido.formaPagamento;
            if (formaPagto.id == this.condigoBrinde) {
                pedido.brinde = true;
                this.condicoesPagto[pedido.id] = null;
                pedido.condicaoPagamento = null;
            } else {                
                const condicoes = PedidoUtils.getCondicoesPagamentoEmbarqueCatalogo(formaPagto.condicoes, pedido.dataEmbarque);
                this.condicoesPagto[pedido.id] = condicoes;
                pedido.brinde = false;
                if (condicoes.length == 1) {
                    pedido.condicaoPagamento = condicoes[0];
                } else {
                    pedido.condicaoPagamento = {nome:'Selecione a opção'};
                }
            }
            this.$forceUpdate();
        },
        alterarFormaPagamentoCapa() {            
            if (this.pedidoCapa.formaPagamento.id == 0) {
                this.isOrcamento = true;
                this.pedidoCapa.brinde = false;
            } else if (this.pedidoCapa.formaPagamento.id == this.condigoBrinde) {
                this.pedidoCapa.brinde = true;
                this.isOrcamento = false;
                this.pedidoCapa.listEmbarques.forEach(pedido => {
                    pedido.formaPagamento = this.pedidoCapa.formaPagamento;
                    this.condicoesPagto[pedido.id] = null;
                    pedido.brinde = true;
                    pedido.condicaoPagamento = null;
                });
            } else {
                this.isOrcamento = false;
                this.pedidoCapa.brinde = false;
                this.pedidoCapa.listEmbarques.forEach(pedido => {
                    pedido.formaPagamento = this.pedidoCapa.formaPagamento;
                    pedido.brinde = false;
                    const condicoes = PedidoUtils.getCondicoesPagamentoEmbarqueCatalogo(pedido.formaPagamento.condicoes, pedido.dataEmbarque);
                    this.condicoesPagto[pedido.id] = condicoes;
                    if (condicoes.length > 0) {
                        pedido.condicaoPagamento = condicoes[0];
                    }
                });
            }
            this.$forceUpdate();
        },
        alteraCondicaoPagamento() {
            this.$forceUpdate();
        },
        alteraObservacao() {
            this.$forceUpdate();
        },
        getCondicoesPagamento(idPedido) {
            return this.condicoesPagto[idPedido];
        },
        selecionarEndereco() {
            if(this.pedidoCapa.cliente.enderecos){
                const enderecoPrincipal = this.pedidoCapa.cliente.enderecos.find((endereco) => endereco.principal);
                if (enderecoPrincipal) {
                    this.endEntregaSel = this.getEndEntregaOption(enderecoPrincipal);
                } else {
                    this.endEntregaSel = this.getEndEntregaOption(this.pedidoCapa.cliente.endereco);
                }
            } else {
                this.endEntregaSel = this.getEndEntregaOption(this.pedidoCapa.cliente.endereco);
            }
        },
        getEndEntregaOption(endereco) {
            return {label: this.getLabelEndereco(endereco), value: {...endereco}};
        },
        getLabelEndereco(endereco) {
            return endereco ? endereco.endereco +', Nº'+ endereco.numero +' - CEP: '+ endereco.cep : null;
        },
        getTotalPedido(pedido) {
            return PedidoUtils.calcularDesconto(this.pedidoCapa.desconto3, PedidoUtils.calcularDesconto(this.pedidoCapa.desconto2, PedidoUtils.calcularDesconto(this.pedidoCapa.desconto1, pedido.totalBruto)));
        },
        setBrinde(pedido){
            if (pedido.brinde) {
                pedido.formaPagamento = this.formasPagto.find((formaPagto) => formaPagto.id == this.condigoBrinde );
                pedido.condicaoPagamento = null;
            } else {
                pedido.formaPagamento = this.formasPagto[0];
                pedido.condicaoPagamento = this.formasPagto[0].condicoes[0];
            }
            this.$forceUpdate();
        },
        validarDadosPedido() {
            PedidoUtils.gerarPedidosPorEmbarques(this.pedidoCapa).then((pedidos) => {
                PedidoUtils.validarPedido(pedidos).then(() => {
                    this.$vs.dialog({
                        type: 'confirm',
                        color: 'warning',
                        title: 'Deseja finalizar os pedidos?',
                        text: 'Os pedidos serão gerados e estarão disponíveis para sincronização.',
                        acceptText: 'Finalizar',
                        cancelText: 'Cancelar',
                        accept: this.gerarPedidos,
                        parameters: pedidos
                    });
                }).catch((erro) => {                
                    this.$vs.notify({
                        title: 'Erro!',
                        time: 9000,
                        text: erro.mensagem,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
            });
        },
        validarDadosOrcamento() {
            PedidoUtils.gerarOrcamento(this.pedidoCapa).then((orcamento) => {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: 'Deseja salvar em orçamento?',
                    text: 'Será criado um novo orçamento com os itens do carrinho, e seu carrinho será apagado.',
                    acceptText: 'Salvar',
                    cancelText: 'Cancelar',
                    accept: this.gerarOrcamento,
                    parameters: orcamento
                });
            });
        },
		gerarPedidos(pedidos) {
            const done = this.lodash.after(pedidos.length, () => {
                const itens = pedidos.reduce((itens, embarque) => {
                    return itens.concat(embarque.itens.reduce((produtos, item) => {
                        produtos.push(item.sku);
                        return produtos;
                    }, [])); 
                }, []);
                CarrinhoDB.deleteCarrinho(itens).then(() => {
                    PedidoUtils.concluirGeracaoPedidos(this, itens);
                });
            });
            
            pedidos.forEach(pedido => {
                PedidoDB.salvarPedidoNovo(pedido).then(() => {
                    done();
                });
            });
        },
        gerarOrcamento(orcamento) {
            orcamento.emailEnviado = false;
            const itens = orcamento.embarques.reduce((itens, embarque) => {
                return itens.concat(embarque.itens.reduce((produtos, item) => {
                    produtos.push(item.idProduto);
                    return produtos;
                }, [])); 
            }, []);
            OrcamentoDB.salvar(orcamento).then(() => {
                CarrinhoDB.deleteCarrinho(itens).then(() => {
                    PedidoUtils.concluirGeracaoPedidos(this, itens, true);
                });
            });
        },
        voltarCarrinho() {
            this.$router.push({name:'carrinho'});
        },
        setFormaPagtoEmbarques(pedido) {
            return new Promise((resolve) => {
                const done = this.lodash.after(pedido.listEmbarques.length,() => resolve(pedido));
                pedido.listEmbarques.forEach(embarque => {
                    if (this.pedidoCapa.replica) {
                        embarque.formaPagamento = this.formasPagto.find((formaPagto) => formaPagto.id === embarque.formaPagamento);
                        embarque.condicaoPagamento = embarque.formaPagamento.condicoes.find((condicao) => condicao.id === embarque.condicaoPagamento);
                    } else {
                        embarque.formaPagamento = this.formasPagto[0];
                        embarque.condicaoPagamento = {nome:'Selecione a opção'};
                    } 
                    this.condicoesPagto[embarque.id] = PedidoUtils.getCondicoesPagamentoEmbarqueCatalogo(embarque.formaPagamento.condicoes, embarque.dataEmbarque);
                    done();
                });
            });
        },
        carregaItensTela() {
			return new Promise((resolve) => {
                FormaPagtoDB._getAll().then((formaPagto) => {
                    this.formasPagto = formaPagto;
                    PedidoUtils.getEmbarquesPedido(this.pedidoCapa).then((pedido) => {
                        if (this.pedidoCapa.replica) {
                            this.setFormaPagtoEmbarques(pedido).then((pedidoCapa) => {
                                this.pedidoCapa = pedidoCapa;
                                this.endEntregaSel = this.getEndEntregaOption(this.pedidoCapa.endEntrega);
                                this.showScreen = true;
                                resolve();
                            });
                        } else {
                            this.selecionarEndereco();
                            pedido.formaPagamento = this.formasPagto[0];
                            pedido.condicaoPagamento = this.formasPagto[0].condicoes;
                            this.setFormaPagtoEmbarques(pedido).then((pedidoCapa) => {
                                this.pedidoCapa = pedidoCapa;
                                this.showScreen = true;
                                resolve();
                            });
                        }            
                    });                    
                })
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
    beforeMount() {
    },
    async mounted() {
        this.pedidoCapa = this.$route.params.pedidoEmbarques;

        if (this.pedidoCapa.cliente && this.pedidoCapa.cliente.cpfCnpj) {
            this.pedidoCapa.emailNfe = this.pedidoCapa.cliente.emailNfe;
            this.pedidoCapa.grupoCliente = this.pedidoCapa.cliente.grupoCliente;
        } else {
            this.pedidoCapa.grupoCliente = Storage.getGrupoCarrinho();
        }
        await this.carregaItensTela();
    },
	errorCaptured(err, vm, info) {
        ErrorDB._criarLog({ err, vm, info });
        return true;
    }

};
</script>

<style lang="scss">

    .btn-orcamento {
        position: fixed;
        top: 42%;
        right: -50px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        z-index: 1000;
        width: 10rem;
        transform: rotate(-90deg);
        margin-right: -5px;
    }

    .btn-pedido {
        position: fixed;
        top: 61%;
        right: -50px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        z-index: 1000;
        width: 10rem;
        transform: rotate(-90deg);
        margin-right: -5px;
    }

     .linha1 {
        padding: 0 0 px !important;
    }

    @media only screen and (max-width: 830px) {
        .btn-orcamento {
            position: fixed;
            top: 42%;
            right: -50px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            z-index: 1000;
            width: 10rem;
            transform: rotate(-90deg);
            margin-right: -5px;
        }

        .btn-pedido {
            position: fixed;
            top: 57%;
            right: -50px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            z-index: 1000;
            width: 10rem;
            transform: rotate(-90deg);
            margin-right: -5px;
        }
    }

    .page-carrinho-pedido {
        margin-top: -15px !important;
        margin-left: 5px !important;
        margin-right: 5px !important;
    }

    .embarque-item {
        padding: 10px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
        margin-top: 15px;
    }

    .margin-calendar {
        margin-bottom: 20px !important;
    }
    

</style>