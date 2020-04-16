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
                            v-model="pedidoCapa.endEntrega" 
                            :options="getEnderecosEntrega"
                            label="descricao"
                            :reduce="options => options.endereco"
                            :clearable=false 
                        /> 
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
                            <vs-textarea v-model="pedidoCapa.observacao" height="100" />
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
                <div class="vx-row flex justify-between" style="margin-top:20px;padding-left:15px">
                    <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label>Quantidade: {{ pedido.quantidade }} </label>
                        </div>
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label>Subtotal: {{ pedido.totalBruto | moneyy }} </label>
                        </div>
                        <div class="vx-row" style="justify-content: flex-start;" v-if="mostraDescontos">
                            <label>
                                Descontos: 
                                {{pedidoCapa.desconto1 && pedidoCapa.desconto1 > 0 ? `(${pedidoCapa.desconto1}%)` : ''}} 
                                {{pedidoCapa.desconto2 && pedidoCapa.desconto2 > 0 ? `(${pedidoCapa.desconto2}%)` : ''}} 
                                {{pedidoCapa.desconto3 && pedidoCapa.desconto3 > 0 ? `(${pedidoCapa.desconto3}%)` : ''}}
                            </label>
                        </div>
                        <div class="vx-row" style="justify-content: flex-start;">
                            <label><strong>Total: {{getTotalPedido(pedido) | moneyy }}</strong> </label>
                        </div>
                    </vs-col>
                    <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Aceita Pedido Parcial</label>
                            <vs-checkbox v-model="pedido.pedidoParcial"></vs-checkbox>
                        </div>
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Aceita Antecipação do Pedido </label>
                            <vs-checkbox v-model="pedido.antecipacaoPedido"></vs-checkbox>
                        </div>
                        <div class="vx-row" style="justify-content: flex-end;">
                            <label>Enviar Cópia Por Email </label>
                            <vs-checkbox v-model="pedido.copiaEmail"></vs-checkbox>
                        </div>
                    </vs-col>
                </div>
                <div v-if="!isOrcamento">
                    <vs-divider>Faturamento</vs-divider>
                    <div class="vx-row flex justify-content" style="padding-bottom:15px">
                        <div class="vx-col sm:w-1/4 w-full mb-2">
                            <label>Data Embarque</label>
                            <v-select 
                                @input="selecionarCondicaoPagamento(pedido)"
                                id="dataEmbarque"
                                label="descricao"
                                style="width:100%" 
                                v-model="pedido.dataEmbarque"
                                :options="datasEmbarque(pedido)" 
                                :reduce="options => options.valor"
                                :clearable=false                                     
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
                        <vs-textarea v-model="pedido.observacao" label="Observação" height="70" />
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
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import PedidoDB from "../../rapidsoft/db/pedidoDB";
import OrcamentoDB from "../../rapidsoft/db/orcamentoDB";
import vSelect from 'vue-select';
import CarrinhoDB from '../../rapidsoft/db/carrinhoDB';
import moment from 'moment';

export default {
	data: () => ({
        pedidoCapa: null,
        isOrcamento: false,
        showScreen: false,
        formasPagto: [],
        condicoesPagto: {},
        embarques:[],
        condigoBrinde: 5,
        condigoBoleto: 1,
    }),
    watch: {
        
    },
	components: {
        'v-select': vSelect,
	},
	computed: {    
        mostraDescontos() {
            if (this.pedidoCapa !== null
                && (this.pedidoCapa.desconto1 && this.pedidoCapa.desconto1 > 0
                    || this.pedidoCapa.desconto2 && this.pedidoCapa.desconto2 > 0
                        || this.pedidoCapa.desconto3 && this.pedidoCapa.desconto3 > 0)) {
                return true;
            } else {
                return false;
            }
        },    
        getListEmbarques() {
            return this.lodash.orderBy(this.pedidoCapa.listEmbarques, ['id', 'seq']);
        },
        getEnderecosEntrega() {
            if (this.pedidoCapa.cliente.enderecos && this.pedidoCapa.cliente.enderecos.length > 0) {
                return this.pedidoCapa.cliente.enderecos.map((endereco) => {
                    return {descricao: this.getLabelEndereco(endereco), endereco: endereco };
                });
            } else return [];
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
        }     
	},
    methods: {        
        datasEmbarque(embarque) {
            const datasDisponiveis = [];        
            if (embarque.periodos) {
                embarque.periodos.forEach(periodo => {
                    let dataAtual = 0;
                    const dataFim = periodo.dataEmbarqueFim;
                    while (dataAtual < dataFim) {
                        dataAtual = dataAtual == 0 ? periodo.dataEmbarqueInicio : this.somarDiaData(dataAtual);
                        datasDisponiveis.push(dataAtual);
                    }
                });
            } else {
                let dataAtual = 0;
                const dataFim = embarque.dataFim;
                while (dataAtual < dataFim) {
                    dataAtual = dataAtual == 0 ? embarque.dataInicio : this.somarDiaData(dataAtual);
                    datasDisponiveis.push(dataAtual);
                }
            }
            return this.getLabelData(datasDisponiveis);
        },
        somarDiaData(timeUtc) {
            const date = new Date(timeUtc);
            const newdate = new Date(timeUtc);
            newdate.setDate(date.getDate() + 1);
            return newdate.getTime();
        },
        getLabelData(datasDisponiveis) {
            return datasDisponiveis.map((data) => {
                return {descricao: moment(new Date(data)).format('DD/MM/YYYY'), valor: data }
            });
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
        getCondicoesPagamento(idPedido) {
            return this.condicoesPagto[idPedido];
        },
        selecionarEndereco() {
            if(this.pedidoCapa.cliente.enderecos){
                const enderecoPrincipal = this.pedidoCapa.cliente.enderecos.find((endereco) => endereco.principal);
                if (enderecoPrincipal) {
                    this.pedidoCapa.endEntrega = {descricao: this.getLabelEndereco(enderecoPrincipal), endereco: enderecoPrincipal };
                } else {
                    this.pedidoCapa.endEntrega = {descricao: this.getLabelEndereco(this.pedidoCapa.cliente.endereco), endereco: this.pedidoCapa.cliente.endereco };
                }
            } else {
                this.pedidoCapa.endEntrega = {descricao: this.getLabelEndereco(this.pedidoCapa.cliente.endereco), endereco: this.pedidoCapa.cliente.endereco};
            }
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
                        type:'confirm',
                        color:'warning',
                        title:'Atenção!',
                        text:'Serão gerados pedidos diferentes para cada Embarque, e seu carrinho será apagado!. Deseja continuar?',
                        acceptText: 'Sim',
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
                    type:'confirm',
                    color:'success',
                    title:'Atenção!',
                    text:'Será gerado um orçamento, e seu carrinho será apagado!. Deseja continuar?',
                    acceptText: 'Sim',
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
        carregaItensTela() {
			return new Promise((resolve) => {
                FormaPagtoDB._getAll().then((formaPagto) => {
                    this.formasPagto = formaPagto;
                    EmbarqueDB.getEmbarquesPedido(this.pedidoCapa).then((pedido) => {
                        const done = this.lodash.after(pedido.listEmbarques.length,() => {
                            this.pedidoCapa = pedido;
                            this.showScreen = true;
                            resolve();
                        });
                        this.selecionarEndereco();
                        this.pedidoCapa.formaPagamento = this.formasPagto[0];
                        this.pedidoCapa.condicaoPagamento = this.formasPagto[0].condicoes;
                        pedido.listEmbarques.forEach(embarque => {
                            embarque.formaPagamento = this.formasPagto[0];
                            this.condicoesPagto[embarque.id] = PedidoUtils.getCondicoesPagamentoEmbarqueCatalogo(this.formasPagto[0].condicoes, embarque.dataEmbarque);
                            // embarque.condicaoPagamento = this.condicoesPagto[embarque.id][0];
                            embarque.condicaoPagamento = {nome:'Selecione a opção'};
                            done();
                        });
                    });                    
                })
            });
        },

    },
	beforeCreate() {
    },
	created() {
    },
    beforeMount() {
    },
    async mounted() {
        this.pedidoCapa = this.$route.params.pedidoEmbarques;

        console.log(this.pedidoCapa);
        
        if (this.pedidoCapa.cliente && this.pedidoCapa.cliente.cpfCnpj) {
            this.pedidoCapa.emailNfe = this.pedidoCapa.cliente.emailNfe;
            this.pedidoCapa.grupoCliente = this.pedidoCapa.cliente.grupoCliente;
            this.pedidoCapa.endEntrega = this.getEnderecosEntrega.find((end) => end.endereco.endEntrega );
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

</style>