<template>
    <div class="page-carrinho-pedido">
        <vs-button 
            class="btn-confirm" 
            :color="this.isOrcamento ? 'success' : 'warning'" 
            type="filled" icon-pack="feather" :icon="this.isOrcamento ? 'icon-file-text' : 'icon-play'" 
            @click="isOrcamento ? validarDadosOrcamento() : validarDadosPedido()">Finalizar
        </vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarCarrinho()" icon="icon-arrow-down">Carrinho</vs-button>
        <b-tabs content-class="mt-5" justified v-if="this.showScreen">
            <b-tab active>
                <template v-slot:title>
                    <strong>
                        <feather-icon icon="FileTextIcon" style="color:warning;" class="cursor-pointer"/>
                        Capa
                    </strong>
                </template>
                <div class="my-6" v-if="this.pedidoCapa">
                    <div class="vx-row">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="2" vs-sm="3" vs-xs="12" >
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="cpfCnpj" class="vs-input--label">CPF/CNPJ</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="pedidoCapa.cliente.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                            </div>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="9" vs-xs="12">
                            <vs-input v-validate="'required'" label="Nome" id="nomeCliente" name="nomeCliente" disabled v-model="pedidoCapa.cliente.nome" class="w-full input-line-group-rapid" />
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
                            <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="pedidoCapa.emailNfe" class="w-full" type="email" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                            <vs-input label="Grupo Cliente" id="grupoCliente" name="grupoCliente" v-model="pedidoCapa.grupoCliente.nome" disabled class="w-full" type="text" />
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full">
                            <label for="endEntrega" class="vs-input--label">Endereço de entrega</label>
                            <v-select 
                                id="endEntrega" 
                                :clearable=false 
                                v-model="pedidoCapa.endEntrega" 
                                :options="getEnderecosEntrega"
                            /> 
                        </div>
                    </div>
                    <div class="vx-row" style="margin-top:20px">
                        <vs-col vs-type="flex" vs-lg="3" vs-sm="3" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 1" icon="icon-percent" v-model="pedidoCapa.desconto1" icon-after/>
                        </vs-col>
                        <vs-col vs-type="flex" vs-lg="3" vs-sm="3" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 2" icon="icon-percent" v-model="pedidoCapa.desconto2" icon-after/>
                        </vs-col>
                        <vs-col vs-type="flex" vs-lg="3" vs-sm="3" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desconto 3" icon="icon-percent" v-model="pedidoCapa.desconto3" icon-after/>
                        </vs-col>
                        <vs-col vs-type="flex" vs-lg="3" vs-sm="3" vs-xs="12" vs-justify="center" vs-align="center">
                            <vs-checkbox v-model="isOrcamento">Orçamento</vs-checkbox>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-textarea v-model="pedidoCapa.observacao" style="margin-top:30px" label="Observação" height="150" />
                        </vs-col>
                    </div>
                </div>
            </b-tab>
            <b-tab>
                <template v-slot:title>
                    <strong>
                        <feather-icon icon="BoxIcon" style="color:warning;" class="cursor-pointer"/>
                        Pedidos
                    </strong>
                </template>
                <div class="embarque-item" style="padding:20px" v-for="(pedido, indexItem) in this.pedidoCapa.listEmbarques" :key="indexItem">
                    <div class="vx-row flex justify-between">
                        <vs-col vs-type="flex" vs-lg="12" vs-sm="12" vs-xs="12">
                            <h4><strong>Pedido:</strong> {{pedido.nome}}</h4>
                        </vs-col>
                    </div>
                    <div class="vx-row flex justify-between" style="margin-top:20px;padding-left:15px">
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Data Embarque: {{ pedido.dataEmbarque | formatDate }}</label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Quantidade: {{ pedido.quantidade }} </label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Subtotal: {{ pedido.totalBruto | moneyy }} </label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Descontos: ({{pedidoCapa.desconto1}}%) ({{pedidoCapa.desconto2}}%) ({{pedidoCapa.desconto3}}%) </label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label><strong>Total: {{getTotalPedido(pedido) | moneyy }}</strong> </label>
                            </div>
                        </vs-col>
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Brinde </label>
                                <vs-checkbox @input="setBrinde(pedido)" v-model="pedido.brinde"></vs-checkbox>
                            </div>
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
                    <div v-if="!pedido.brinde">
                        <vs-divider>Pagamento</vs-divider>
                        <div class="vx-row flex justify-between" style="padding-bottom:15px">
                            <vs-col vs-lg="5" vs-sm="6" vs-xs="12">
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
                            </vs-col>
                            <vs-col vs-lg="5" vs-sm="6" vs-xs="12" v-if="condicoesPagto[pedido.id]">
                                <label>Condição de Pagamento</label>
                                <v-select 
                                    @input="alteraCondicaoPagamento(pedido)"
                                    id="condicaoPgto" 
                                    label="nome"
                                    style="width:100%" 
                                    :clearable=false
                                    v-model="pedido.condicaoPagamento" 
                                    :options="getCondicoesPagamento(pedido.id)" 
                                />
                            </vs-col>
                        </div>
                    </div>
                    <div class="vx-row flex justify-between">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-textarea v-model="pedido.observacao" label="Observação" height="100" />
                        </vs-col>
                    </div>
                </div>
            </b-tab>
        </b-tabs>
        <search-cliente @search-selected="selectSearchCliente" :id="idPopUpSearch"></search-cliente>
    </div>
</template>
<script>
import _ from "lodash";
import ErrorDB from "../../rapidsoft/db/errorDB";
import PedidoUtils from "../../rapidsoft/utils/pedidoUtils";
import Storage from "../../rapidsoft/utils/storage";
import SearchCliente  from '../../rapidsoft/components/SearchCliente';
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import PedidoDB from "../../rapidsoft/db/pedidoDB";
import OrcamentoDB from "../../rapidsoft/db/orcamentoDB";
import vSelect from 'vue-select';

export default {
	data: () => ({
        pedidoCapa: null,
        isOrcamento: false,
        showScreen: false,
        idPopUpSearch: 'popup-cliente-search',
        formasPagto: [],
        condicoesPagto: null,
        embarques:[],
        condigoBrinde: 5,
        condigoBoleto: 1,
    }),
    watch: {
        
    },
	components: {
        SearchCliente,
        'v-select': vSelect,
	},
	computed: {
        getEnderecosEntrega() {
            if (this.pedidoCapa.cliente.enderecos && this.pedidoCapa.cliente.enderecos.length > 0) {
                return this.pedidoCapa.cliente.enderecos.map((endereco, index) => {
                    return {value: index, label: this.getLabelEndereco(endereco), endereco: endereco };
                });
            } else return [];
        },
	},
    methods: {
        selecionarCondicaoPagamento(pedido) {
            const formaPagto = pedido.formaPagamento;
            if (formaPagto.id == this.condigoBrinde) {
                pedido.brinde = true;
                this.condicoesPagto = null;
                pedido.condicaoPagamento = null;
            } else {
                pedido.condicoesPagamento = [];
                const condicoes = formaPagto.condicoes && formaPagto.condicoes.length > 0 ? formaPagto.condicoes : [];
                this.condicoesPagto[pedido.id] = condicoes;
                if (condicoes.length > 0) {
                    pedido.condicaoPagamento = condicoes[0];
                }
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
            console.log(this.pedidoCapa.endEntrega);
            
        },
        getLabelEndereco(endereco) {
            return endereco ? endereco.endereco +', Nº'+ endereco.numero +' - CEP: '+ endereco.cep : null;
        },
        setDescontos(){
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
                        text: erro.mensagem,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    })
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
                    accept: this.gerarCarrinho,
                    parameters: orcamento
                });
            });
        },
		gerarPedidos(pedidos) {
            const done = _.after(pedidos.length, () => {
                const IdOrcamento = Storage.getIdOrcamentoCarrinho();
                if (IdOrcamento) {
                    OrcamentoDB._deletar(IdOrcamento).then(() => {
                        PedidoUtils.concluirGeracaoPedidos(this)
                    });
                } else {
                    PedidoUtils.concluirGeracaoPedidos(this)
                }
            });
            pedidos.forEach(pedido => {
                PedidoDB.salvarPedido(pedido).then(() => {
                    done();
                });
            });
        },
        gerarCarrinho(orcamento) {
            orcamento.emailEnviado = false;
            OrcamentoDB.salvar(orcamento).then(() => {
                PedidoUtils.concluirGeracaoPedidos(this, true);
            });
        },
        voltarCarrinho() {
            this.$router.go(-1);
        },
        abrirPesquisaCliente() {
			this.$bvModal.show(this.idPopUpSearch);
        },
        selectSearchCliente(cliente) {
            this.pedidoCapa.cliente = cliente;
            this.pedidoCapa.emailNfe = cliente.emailNfe;
            this.pedidoCapa.endEntrega = _.find(this.getEnderecosEntrega, (end) => end.endereco.endEntrega ); 
        },
        carregaItensTela() {
			return new Promise((resolve) => {
                FormaPagtoDB._getAll().then((formaPagto) => {
                    this.formasPagto = formaPagto;
                    EmbarqueDB.getEmbarquesPedido(this.pedidoCapa).then((pedido) => {
                        const done = _.after(pedido.listEmbarques.length,() => {
                            this.pedidoCapa = pedido;
                            this.showScreen = true;
                            resolve();
                        });

                        pedido.listEmbarques.forEach(embarque => {
                            embarque.formaPagamento = this.formasPagto[0];
                            embarque.condicaoPagamento = this.formasPagto[0].condicoes[0];
                            this.condicoesPagto = this.condicoesPagto == null ? {} : this.condicoesPagto;
                            this.condicoesPagto[embarque.id] = this.formasPagto[0].condicoes;
                            done();
                        });
                    });                    
                })
            });
        }
    },
	beforeCreate() {
    
    },
	created() {
        this.pedidoCapa = this.$route.params.pedidoEmbarques;        
    },
    beforeMount() {
    
    },
    async mounted() {
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