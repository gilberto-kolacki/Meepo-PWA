<template>
    <div class="parentx">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-play" @click="gerarPedidos()">Finalizar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarCarrinho()" icon="icon-arrow-down">Carrinho</vs-button>

        <div class="mt-5">
            <vs-tabs alignment="fixed">
                <vs-tab label="Capa" icon-pack="feather" icon="icon-file-text">
                    <div class="my-6" v-if="this.pedidoCapa">
                        <div class="vx-row">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="2" vs-sm="3" vs-xs="12" >
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                    <label for="" class="vs-input--label">CPF/CNPJ</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="pedidoCapa.cliente.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                    </div>
                                </div>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="9" vs-xs="12">
                                <vs-input v-validate="'required'" label="Nome" id="nome" name="nome" disabled v-model="pedidoCapa.cliente.nome" class="w-full input-line-group-rapid" />
                                <vs-button
                                    color="primary"
                                    type="filled"
                                    icon-pack="feather"
                                    class="w-full btn-line-group-rapid"
                                    icon="icon-search"
                                    style="margin-top:25px"
                                    @click.stop="abrirPesquisaCliente()"
                                ></vs-button>
                            </vs-col>
                        </div>
                        <div class="vx-row">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                                <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="pedidoCapa.cliente.emailNfe" class="w-full" type="email" />
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                                <vs-input label="Grupo Cliente" id="grupoCliente" name="grupoCliente" v-model="pedidoCapa.cliente.grupoCliente.nome" disabled class="w-full" type="text" />
                            </vs-col>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col w-full">
                                <label for="estadosFiltro" class="vs-input--label">Endereço de entrega</label>
                                <v-select id="endEntrega" required=true name="endEntrega" :clearable=false v-model="pedidoCapa.endEntrega" :options="getEnderecosEntrega" :dir="$vs.rtl ? 'rtl' : 'ltr'"/> 
                            </div>
                        </div>
                        <div class="vx-row" style="margin-top:20px">
                            <vs-col vs-type="flex" vs-lg="4" vs-sm="4" vs-xs="12">
                                <vs-input type="number" icon-pack="feather" label="Desconto 1" icon="icon-percent" v-model="descontos.d1" icon-after/>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                                <vs-input icon-pack="feather" label="Desconto 2" icon="icon-percent" v-model="descontos.d2" icon-after/>
                            </vs-col>
                            <vs-col style="display:flex;justify-content: flex-end;" vs-lg="4" vs-sm="4" vs-xs="12">
                                <vs-input icon-pack="feather" label="Desconto 3" icon="icon-percent" v-model="descontos.d3" icon-after/>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                                <vs-textarea v-model="observacao" style="margin-top:30px" label="Observação" height="100" />
                            </vs-col>
                        </div>
                    </div>
                </vs-tab>

                <vs-tab label="Pedidos" icon-pack="feather" icon="icon-box" style="height:1000px">
                    <!-- {{listEmbarqueItems.length}} -->
                    <div class="embarque-item" style="padding:20px" v-for="(embarqueItem, indexItem) in listEmbarqueItems" :key="indexItem">
                        <div class="vx-row flex justify-between">
                            <vs-col vs-type="flex" vs-lg="8" vs-sm="8" vs-xs="12">
                                <h4>{{embarqueItem.embarque[0]}}</h4>
                            </vs-col>
                        </div>
                        <div class="vx-row flex justify-between" style="margin-top:20px;padding-left:15px">
                            <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                                <div class="vx-row" style="justify-content: flex-start;">
                                    <label>Data Embarque: </label>
                                    <label>{{getDateFromStringDate(embarqueItem.dataEmbarque)}}</label>
                                </div>
                                <div class="vx-row" style="justify-content: flex-start;">
                                    <label>{{"Quantidade: " + embarqueItem.quantidade}} </label>
                                </div>
                                <div class="vx-row" style="justify-content: flex-start;">
                                    <label>{{"Subtotal: " + getCoinFormat(embarqueItem.total)}} </label>
                                </div>
                                <div class="vx-row" style="justify-content: flex-start;">
                                    <label>{{"Descontos: " + somarDescontos() + "%"}} </label>
                                </div>
                                <div class="vx-row" style="justify-content: flex-start;">
                                    <label style="font-weight:bold;">{{"Total: " + getCoinFormat(somarValorTotal(embarqueItem.total,somarDescontos()))}} </label>
                                </div>
                            </vs-col>
                            <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                                <div class="vx-row" style="justify-content: flex-end;">
                                    <label>Brinde </label>
                                    <vs-checkbox @input="setBrinde(indexItem)" :v-model="embarqueItem.informacoesAdicionais.brinde"></vs-checkbox>
                                </div>
                                <div class="vx-row" style="justify-content: flex-end;">
                                    <label>Aceita Pedido Parcial</label>
                                    <vs-checkbox @input="setPedidoParcial(indexItem)" :v-model="embarqueItem.informacoesAdicionais.pedidoParcial"></vs-checkbox>
                                </div>
                                <div class="vx-row" style="justify-content: flex-end;">
                                    <label>Aceita Antecipação do Pedido </label>
                                    <vs-checkbox @input="setAntecipacaoPedido(indexItem)" :v-model="embarqueItem.informacoesAdicionais.antecipacaoPedido"></vs-checkbox>
                                </div>
                                <div class="vx-row" style="justify-content: flex-end;">
                                    <label>Enviar Cópia Por Email </label>
                                    <vs-checkbox @input="setCopiaEmail(indexItem)" :v-model="embarqueItem.informacoesAdicionais.copiaEmail"></vs-checkbox>
                                </div>
                            </vs-col>
                        </div>
                        <div class="vx-row flex" style="margin-top:20px;padding-left:15px;border-bottom:1px solid grey" v-if="!embarqueItem.informacoesAdicionais.brinde">
                            <h4> Pagamento </h4>
                            <vx-tooltip text="Cartão de Crédito" position="right" v-if="embarqueItem.formaPagamento.value === 4">
                                <feather-icon icon="CreditCardIcon" style="color:warning;margin-left:10px" class="cursor-pointer" v-if="embarqueItem.formaPagamento.value === 4"></feather-icon>
                            </vx-tooltip>
                            <vx-tooltip text="Boleto" position="right" v-if="embarqueItem.formaPagamento.value === 1">
                                <feather-icon icon="FileTextIcon" style="color:warning;margin-left:10px" class="cursor-pointer" v-if="embarqueItem.formaPagamento.value === 1"></feather-icon>
                            </vx-tooltip>
                            <vx-tooltip text="Depósito Antecipado" position="right" v-if="embarqueItem.formaPagamento.value === 2">
                                <feather-icon icon="DollarSignIcon" style="color:warning;margin-left:10px" class="cursor-pointer" v-if="embarqueItem.formaPagamento.value === 2"></feather-icon>
                            </vx-tooltip>
                            <vx-tooltip text="Brinde" position="right" v-if="embarqueItem.formaPagamento.value === 5">
                                <feather-icon icon="GiftIcon" style="color:warning;margin-left:10px" class="cursor-pointer" v-if="embarqueItem.formaPagamento.value === 5"></feather-icon>
                            </vx-tooltip>
                        </div>
                        <div class="vx-row flex justify-between" style="padding:15px" v-if="!embarqueItem.informacoesAdicionais.brinde">
                            <vs-col vs-lg="5" vs-sm="5" vs-xs="12">
                                <div class="vx-row">
                                    <label>Forma de Pagamento</label>
                                </div>
                                <div class="vx-row">
                                    <v-select @input="selecionarCondicaoPagamento(indexItem)" id="formaPgto" style="width:100%" required=true name="formaPgto" :clearable=false v-model="embarqueItem.formaPagamento" :options="formasPagto" :dir="$vs.rtl ? 'rtl' : 'ltr'"/>
                                </div>
                            </vs-col>
                            <vs-col vs-lg="5" vs-sm="5" vs-xs="12" v-if="embarqueItem.formaPagamento.value !== 1 && embarqueItem.formaPagamento.value !== 5">
                                <div class="vx-row">
                                    <label>Condição de Pagamento</label>
                                </div>
                                <div class="vx-row">
                                    <v-select id="CondicaoPgto" required=true name="CondicaoPgto" style="width:100%" :clearable=false v-model="embarqueItem.condicaoPagamento" :options="embarqueItem.condicoesPagamento" :dir="$vs.rtl ? 'rtl' : 'ltr'"/>
                                </div>
                            </vs-col>
                        </div>
                    </div>
                </vs-tab>

            </vs-tabs>
        </div>
        <search-cliente @search-selected="selectSearchCliente" :id="idPopUpSearch"></search-cliente>
    </div>
</template>
<script>
// import _ from "lodash";
import ErrorDB from "../db/errorDB";
// import Storage from "../utils/storage";
import PedidoUtils from "../utils/pedidoUtils";
import SearchCliente  from './SearchCliente'
// import ProdutoDB from "../../rapidsoft/db/produtoDB";
// import UtilMask from '../../rapidsoft/utils/utilMask'
import ProdutoUtils from '../../rapidsoft/utils/produtoUtils'
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import vSelect from 'vue-select';


export default {
    name: 'carrinho-pedido',
    props: {
        segmento: {
            type: Object,
            required: false,
        },
    },
	data: () => ({
        clientePedido: null,
        pedidoCapa: null,
        idPopUpSearch: 'popup-cliente-search',
        formasPagto: [],
        embarques:[],
        listEmbarqueItems:[],
        dataEmbarque:[],
        condicaoPagamento: [],
        observacao:'',
        descontos:{d1:0,d2:0,d3:0},
    }),
    watch: {
        
    },
	components: {
        SearchCliente,
        'v-select': vSelect,
	},
	computed: {
        getEnderecosEntrega() {
            return [];
        }
         
	},
    methods: {
        selecionarCondicaoPagamento(indexItem) {
            this.listEmbarqueItems[indexItem].condicoesPagamento = [];
            const listConditions = this.listEmbarqueItems[indexItem].formaPagamento.formaPgto.condicoes ?
                this.listEmbarqueItems[indexItem].formaPagamento.formaPgto.condicoes : [];
            if (listConditions.length > 0) {
                this.listEmbarqueItems[indexItem].condicaoPagamento = {
                    value: listConditions[0].id,
                    label:listConditions[0].nome,
                    parcelas:listConditions[0].parcelas
                };
                listConditions.map((item) => {
                    this.listEmbarqueItems[indexItem].condicoesPagamento.push({value:item.id,label:item.nome,parcelas:item.parcelas})
                })    
            }
        },
        refreshcard() {
            this.$vs.loading({
                container: this.$refs.content,
                scale: 0.5,
            });
            this.tempHidden = true;
            this.$emit("refresh", this);
        },
        removeRefreshAnimation(time=100) {
            setTimeout( ()=> {
                this.$vs.loading.close(this.$refs.content)
                this.tempHidden = false;
            }, time)
        },
        somarValorTotal(total, descontos){
            return total - (total * descontos / 100)
        },
        setCopiaEmail(indexItem){
            this.listEmbarqueItems[indexItem].informacoesAdicionais.copiaEmail = !this.listEmbarqueItems[indexItem].informacoesAdicionais.copiaEmail
        },
        somarDescontos(){
            return parseInt(this.descontos.d1) + parseInt(this.descontos.d2) + parseInt(this.descontos.d3)
        },
        setDescontos(){
        },
        setBrinde(indexItem){
            this.listEmbarqueItems[indexItem].informacoesAdicionais.brinde = !this.listEmbarqueItems[indexItem].informacoesAdicionais.brinde
            this.listEmbarqueItems[indexItem].formaPagamento = {value:4,label:'Brinde'};
        },
        setPedidoParcial(indexItem){
            this.listEmbarqueItems[indexItem].informacoesAdicionais.pedidoParcial = !this.informacoesAdicionais.pedidoParcial;
        },
        setAntecipacaoPedido(indexItem){
            this.listEmbarqueItems[indexItem].informacoesAdicionais.antecipacaoPedido = !this.informacoesAdicionais.antecipacaoPedido;
        },
        getCoinFormat(value) {
			return ("R$ " + value.toFixed(2).toString().replace(".", ","));
        },
        getDateFromStringDate(inputFormat) {
            function pad(valueDate) {
                return valueDate < 10 ? "0" + valueDate : valueDate;
            }
            var date = new Date(parseInt(inputFormat));
            var dataEmbarque = [
                pad(date.getMonth() + 1),
                pad(date.getDate()),
                date.getFullYear()
            ].join("/");
            return dataEmbarque
        },
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
                    this.listEmbarqueItems.push({id:idEmbarque,
                        embarque,
                        dataEmbarque,
                        quantidade: quantProdutosEmbarque,
                        total: totalProdutosEmbarque,
                        informacoesAdicionais:{
                            brinde:false,
                            pedidoParcial:false,
                            antecipacaoPedido:false
                        },
                        formaPagamento:{id: null, label: '',condicoesPagamento:[]},
                        condicaoPagamento:{}
                    })
                }
                
            });
        },
		gerarPedidos() {

        },
        voltarCarrinho() {
            this.$emit('voltar-carrinho');
        },
        abrirPesquisaCliente() {
			this.$bvModal.show(this.idPopUpSearch);
        },
        selectSearchCliente(cliente) {
            this.clientePedido = cliente;
		}
    },
    beforeMount() {
    },

	beforeCreate() {
	},
	created() {
        this.refreshcard();
        FormaPagtoDB.getAll().then((formaPagto) => {
            EmbarqueDB._getAll().then(embarques => {
                this.embarques = embarques;
                embarques.map((embarque) => {
                    this.getProdutosPorEmbarques(embarque.id);
                    this.formasPagto = [];
                    formaPagto.map((item) => {
                        this.formasPagto.push({label:item.nome,value:item.id,formaPgto:item});
                        this.removeRefreshAnimation();
                    })
                })
            });
            
            
        })

	},
    mounted() {
        PedidoUtils.newPedido().then((pedido) => {
            this.pedidoCapa = pedido;
        });
    },
	errorCaptured(err, vm, info) {
        ErrorDB.criarLog({ err, vm, info });
        return true;
    }

};
</script>

<style lang="scss">