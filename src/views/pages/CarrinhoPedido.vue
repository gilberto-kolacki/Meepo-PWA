<template>
    <div class="page-carrinho-pedido">
        <vs-button class="btn-confirm" :color="this.orcamento ? 'warning' : 'success'" type="filled" icon-pack="feather" :icon="this.orcamento ? 'icon-file-text' : 'icon-play'" @click="validarDadosPedido()">Finalizar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarCarrinho()" icon="icon-arrow-down">Carrinho</vs-button>
        <b-tabs content-class="mt-5" justified v-if="this.showPedido">
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
                                    <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="clienteCapa.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                            </div>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="9" vs-xs="12">
                            <vs-input v-validate="'required'" label="Nome" id="nome" name="nome" disabled v-model="clienteCapa.nome" class="w-full input-line-group-rapid" />
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
                            <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="clienteCapa.emailNfe" class="w-full" type="email" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                            <vs-input label="Grupo Cliente" id="grupoCliente" name="grupoCliente" v-model="clienteCapa.grupoCliente.nome" disabled class="w-full" type="text" />
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full">
                            <label for="endEntrega" class="vs-input--label">Endereço de entrega</label>
                            <v-select id="endEntrega" :clearable=false v-model="pedidoCapa.endEntrega" :options="getEnderecosEntrega" :dir="$vs.rtl ? 'rtl' : 'ltr'"/> 
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
                            <vs-checkbox v-model="orcamento">Orçamento</vs-checkbox>
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
                <div class="embarque-item" style="padding:20px" v-for="(embarqueItem, indexItem) in this.listPedidosEmbarque" :key="indexItem">
                    <div class="vx-row flex justify-between">
                        <vs-col vs-type="flex" vs-lg="12" vs-sm="12" vs-xs="12">
                            <h4><strong>Pedido:</strong> {{embarqueItem.nome}}</h4>
                        </vs-col>
                    </div>
                    <div class="vx-row flex justify-between" style="margin-top:20px;padding-left:15px">
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Data Embarque: {{embarqueItem.dataEmbarque | formatDate}}</label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Quantidade: {{embarqueItem.quantidade}} </label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Subtotal: {{getCoinFormat(embarqueItem.total)}} </label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label>Descontos: {{somarDescontos() + "%"}} </label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <label><strong>Total:</strong> </label>
                            </div>
                        </vs-col>
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Brinde </label>
                                <vs-checkbox @input="setBrinde(indexItem)" v-model="embarqueItem.brinde"></vs-checkbox>
                            </div>
                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Aceita Pedido Parcial</label>
                                <vs-checkbox v-model="embarqueItem.pedidoParcial"></vs-checkbox>
                            </div>
                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Aceita Antecipação do Pedido </label>
                                <vs-checkbox v-model="embarqueItem.antecipacaoPedido"></vs-checkbox>
                            </div>
                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Enviar Cópia Por Email </label>
                                <vs-checkbox v-model="embarqueItem.copiaEmail"></vs-checkbox>
                            </div>
                        </vs-col>
                    </div>
                    <div v-if="!embarqueItem.brinde">
                        <vs-divider>Pagamento</vs-divider>
                        <div class="vx-row flex justify-between" style="padding-bottom:15px">
                            <vs-col vs-lg="5" vs-sm="6" vs-xs="12">
                                <label>Forma de Pagamento</label>
                                <v-select 
                                    @input="selecionarCondicaoPagamento(indexItem)"
                                    id="formaPgto" 
                                    style="width:100%" 
                                    :clearable=false 
                                    v-model="embarqueItem.formaPagamento" 
                                    :options="getFormasPagto" 
                                    :dir="$vs.rtl ? 'rtl' : 'ltr'"/>
                            </vs-col>
                            <vs-col vs-lg="5" vs-sm="6" vs-xs="12" v-if="condicoesPagto">
                                <label>Condição de Pagamento</label>
                                <v-select 
                                    id="condicaoPgto" 
                                    style="width:100%" 
                                    :clearable=false
                                    v-model="embarqueItem.condicaoPagamento" 
                                    :options="getCondPagtoFormaPagto(embarqueItem.formaPagamento)" 
                                    :dir="$vs.rtl ? 'rtl' : 'ltr'"/>
                            </vs-col>
                        </div>
                    </div>
                    <div class="vx-row flex justify-between">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-textarea v-model="embarqueItem.observacao" label="Observação" height="100" />
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
// import ProdutoUtils from '../../rapidsoft/utils/produtoUtils';
import CarrinhoUtils from '../../rapidsoft/utils/carrinhoUtils';
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import PedidoDB from "../../rapidsoft/db/pedidoDB";
import CarrinhoDB from "../../rapidsoft/db/carrinhoDB";
import vSelect from 'vue-select';

export default {
	data: () => ({
        pedidoCapa: null,
        clienteCapa: null,
        orcamento: false,
        showPedido: false,
        idPopUpSearch: 'popup-cliente-search',
        formasPagto: [],
        condicoesPagto: [],
        embarques:[],
        listPedidosEmbarque:[],
        dataEmbarque:[],
        condicaoPagamento: [],
        observacao:'',
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
            if (this.clienteCapa.enderecos && this.clienteCapa.enderecos.length > 0) {
                return this.clienteCapa.enderecos.map((endereco) => {
                    return {value: endereco, label: this.getLabelEndereco(endereco) };
                });
            } else return [];
        },        
        getFormasPagto() {
            return this.formasPagto.map((formaPagto) => this.getValueSelectFormaPagto(formaPagto));
        },
	},
    methods: {
        selecionarCondicaoPagamento(indexItem) {
            const formaPagto = this.listPedidosEmbarque[indexItem].formaPagamento.formaPgto;
            if (formaPagto.id == this.condigoBrinde) {
                this.listPedidosEmbarque[indexItem].brinde = true;
                this.condicoesPagto = null;
                this.listPedidosEmbarque[indexItem].condicaoPagamento = null;
            } else if (formaPagto.id == this.condigoBoleto) {
                this.condicoesPagto = null;
                this.listPedidosEmbarque[indexItem].condicaoPagamento = null;
            } else {
                this.listPedidosEmbarque[indexItem].condicoesPagamento = [];
                const condicoes = formaPagto.condicoes && formaPagto.condicoes.length > 0 ? formaPagto.condicoes : [];
                this.condicoesPagto = condicoes;
                if (condicoes.length > 0) {
                    this.listPedidosEmbarque[indexItem].condicaoPagamento = {
                        value: condicoes[0].id,
                        label:condicoes[0].nome,
                        parcelas:condicoes[0].parcelas
                    };
                }
            }
        },
        getLabelEndereco(endereco) {
            return endereco ? endereco.endereco +' - '+ endereco.numero +', CEP: '+ endereco.cep : null;
        },
        getCondPagtoFormaPagto(formaPagamento) {
            if (formaPagamento) {
                return formaPagamento.formaPgto.condicoes.map((condPagto) => {
                    return {label:condPagto.nome, value:condPagto.id, formaPgto:condPagto}
                });
            }
        },
        somarValorTotal(total, descontos,indexItem){
            this.listPedidosEmbarque[indexItem].valueBeforeDiscount = total - (total * descontos / 100);
            return total - (total * descontos / 100);
        },
        somarDescontos(){
            return parseInt(this.pedidoCapa.desconto1) + parseInt(this.pedidoCapa.desconto2) + parseInt(this.pedidoCapa.desconto3);
        },
        setDescontos(){
        },
        getValueSelectFormaPagto(formaPagto) {
            return {label:formaPagto.nome, value:formaPagto.id, formaPgto:formaPagto};
        },
        setBrinde(indexItem){
            if (this.listPedidosEmbarque[indexItem].brinde) {
                const brinde = _.find(this.formasPagto, (formaPagto) => formaPagto.id == this.condigoBrinde );
                this.listPedidosEmbarque[indexItem].formaPagamento = this.getValueSelectFormaPagto(brinde);
            } else {
                this.listPedidosEmbarque[indexItem].formaPagamento = null;
            }
            this.listPedidosEmbarque[indexItem].condicaoPagamento = null;
        },
        getCoinFormat(value) {
			return ("R$ " + value.toFixed(2).toString().replace(".", ","));
        },
        validarDadosPedido() {
            // criar validaçãov                 
            this.gerarPedidosMessage();
        },
        gerarPedidosMessage() {
            this.$vs.dialog({
                type:'confirm',
                color:'warning',
                title:'Atenção!',
                text:'Serão gerados pedidos diferentes para cada Embarque, e se carrinho será apagado!. Deseja continuar?',
                accept: this.gerarPedidos,
                acceptText: 'Sim',
                cancelText: 'Cancelar',
            });
        },
		gerarPedidos() {
            if (this.orcamento) {
                const carrinho = Storage.getCarrinho();
                carrinho.pedido = this.pedidoCapa;
                carrinho.emailEnviado = false;
                CarrinhoDB.salvarCarrinho(carrinho).then(() => {
                    PedidoUtils.concluirGeracaoPedidos(this, true);
                });
            } else {
                PedidoUtils.gerarPedidosPorEmbarques(this.pedidoCapa, this.listPedidosEmbarque).then((pedidos) => {
                    const done = _.after(pedidos.length, () => PedidoUtils.concluirGeracaoPedidos(this));
                    pedidos.forEach(pedido => {
                        PedidoDB.salvarPedido(pedido).then(() => {
                            done();
                        });
                    });
                });
            }
        },
        voltarCarrinho() {
            this.$router.go(-1);
        },
        abrirPesquisaCliente() {
			this.$bvModal.show(this.idPopUpSearch);
        },
        selectSearchCliente(cliente) {
            this.clienteCapa = cliente;
            this.clienteCapa.endEntrega = this.getLabelEndereco(_.find(cliente.enderecos, (endereco) => endereco.endEntrega ));
        },
        carregaItensTela() {
			return new Promise((resolve) => {
                FormaPagtoDB._getAll().then((formaPagto) => {
                    this.formasPagto = formaPagto;
                    CarrinhoUtils.getCarrinho(this.$route.params.orcamentoId ? this.$route.params.orcamentoId : null).then(carrinho => {
                        this.itensCarrinho = carrinho;
                        EmbarqueDB.getPedidosPorEmbarques(carrinho).then((embarques) => {
                            this.listPedidosEmbarque = embarques;
                            this.showPedido = true;
                            resolve();
                        });
                    });
                })
            });
        }
    },
	beforeCreate() {
    
    },
	async created() {
        await this.carregaItensTela();
    },
    beforeMount() {
    
    },
    mounted() {
        PedidoUtils.newPedido().then((pedido) => {
            this.pedidoCapa = pedido;
            this.clienteCapa = Storage.getClienteCarrinho();
            if (!this.clienteCapa.grupoCliente) {
                this.clienteCapa.grupoCliente = Storage.getGrupoCarrinho();
            }
            if (pedido.cliente) {
                this.clienteCapa.endEntrega = this.getLabelEndereco(_.find(pedido.cliente.enderecos, (endereco) => endereco.endEntrega ));
            }
        });
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