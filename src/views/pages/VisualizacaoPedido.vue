        <template>
            <div id="invoice-page">

                
                <div class="flex flex-wrap items-center justify-between">
                    <div class="flex items-center">
                        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-save"  @click="carrinhoPedido()" >Finalizar</vs-button>
                        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarPedido()" icon="icon-x">Voltar</vs-button>
                        <vs-button @click.stop="printInvoice" color="primary" type="filled" class="btn-carrinho" icon-pack="feather" icon="icon-printer"></vs-button>
                    </div>
                </div>
                
                
                <vx-card id="invoice-container">

                    <div class="vx-row leading-loose p-base">
                        <div class="vx-col w-full md:w-1/2 mt-base">
                            <h1>Pedido</h1>
                        </div>
                        <div class="vx-col w-full md:w-1/2 text-right">
                            
                            
                            <div class="invoice__invoice-detail mt-6">
                                <h6>Número</h6>
                                <p>{{ orcamento.id }}</p>
                            </div>
                        </div>
                        <div class="vx-col w-full md:w-1/2 mt-12">
                            <h5 v-if="orcamento.cliente">
                                {{orcamento.cliente.nome ? orcamento.cliente.nome : ''}}
                            </h5>
                            <div class="invoice__recipient-info my-4">
                                <p v-if="orcamento.cliente">{{ orcamento.cliente.nomeFantasia ? orcamento.cliente.nomeFantasia : orcamento.cliente.nome}}</p>
                                <p v-if="orcamento.cliente"> {{ orcamento.cliente.endereco.endereco + ', ' + orcamento.cliente.endereco.numero}}</p>
                                <p v-if="orcamento.cliente">{{ orcamento.cliente.endereco.cidade + '/' + orcamento.cliente.endereco.estado}}</p>
                            </div>
                            <div class="invoice__recipient-contact ">
                                <p class="flex items-center">
                                    <feather-icon v-if="orcamento.cliente && orcamento.cliente.contatos" icon="PhoneIcon" svgClasses="h-4 w-4"></feather-icon>
                                    <span class="ml-2" v-if="orcamento.cliente">{{ orcamento.cliente.contatos ? orcamento.cliente.contatos[0] : '' }}</span>
                                </p>
                            </div>
                        </div>
                        <div class="vx-col w-full md:w-1/2 mt-base text-right mt-12">
                            <!-- <h5>{{orcamento.cliente.cpfCnpj}}</h5> -->
                            <p class="flex items-center justify-end" style="margin-right:-50px"><the-mask id="cpfCnpj" style="border:none" v-if="orcamento.cliente" v-model="orcamento.cliente.cpfCnpj" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" /></p>
                            <div class="invoice__company-info my-4">
                                <p v-if="orcamento.cliente">{{ orcamento.cliente.grupoCliente.nome }}</p>
                                <p v-if="orcamento.cliente && orcamento.cliente.endereco">{{ orcamento.cliente.endereco.bairro }}</p>
                                <p><the-mask id="cep" style="border:none;display:none" v-if="orcamento.cliente" v-model="orcamento.cliente.endereco.cep" :mask="['##.###-###']" :masked="true" /></p>
                                <p v-if="orcamento.cliente">{{ orcamento.cliente.endereco.cep }}</p>
                            </div>
                            <div class="invoice__company-contact">
                                <p class="flex items-center justify-end">
                                    <feather-icon icon="MailIcon" svgClasses="h-4 w-4"></feather-icon>
                                    <span class="ml-2" v-if="orcamento.cliente">{{ orcamento.cliente.emailNfe }}</span>
                                </p>
                                <p class="flex items-center justify-end">
                                    <feather-icon v-if="orcamento.cliente && orcamento.cliente.contatos[1]" icon="PhoneIcon" svgClasses="h-4 w-4"></feather-icon>
                                    <span class="ml-2" v-if="orcamento.cliente">{{  orcamento.cliente.contatos ? orcamento.cliente.contatos[1] : ""}}</span>
                                </p>
                            </div>

                        </div>
                    </div>

                    <!-- INVOICE CONTENT -->
                    <div class="p-base">
                        <!-- INVOICE TASKS TABLE -->
                        <vs-table hoverFlat :data="orcamento.itens">
                            <!-- HEADER -->
                            <template slot="thead">
                                <vs-th style="width:40%">ITEM</vs-th>
                                <vs-th style="width:35%">EMBARQUE</vs-th>
                                <vs-th style="width:5%">QNT</vs-th>
                                <vs-th style="width:10%">CUSTO</vs-th>
                                <vs-th style="width:10%">TOTAL</vs-th>
                            </template>

                            <!-- DATA -->
                            <template slot-scope="{data}">
                                <vs-tr v-for="(tr, index) in data" :key="index">
                                    <vs-td :data="data[index].ref">{{ data[index].nome }}</vs-td>
                                    <vs-td :data="data[index].ref">{{ data[index].embarque.nome }}</vs-td>
                                    <vs-td :data="data[index].quantidade">{{ data[index].quantidade }}</vs-td>
                                    <vs-td :data="data[index].precoCusto">{{ getValorTotal(data[index].precoCusto,1) }}</vs-td>
                                    <vs-td :data="data[index].codigo">{{ getValorTotal(data[index].quantidade, data[index].precoCusto)}}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>

                        <!-- INVOICE SUMMARY TABLE -->
                        <vs-table hoverFlat class="w-2/3 ml-auto mt-4">
                            <vs-tr>
                                <vs-th>SUBTOTAL</vs-th>
                                <vs-td>{{ getValorTotal(orcamento.valorTotal,1) }}</vs-td>
                            </vs-tr>
                            <!-- <vs-tr>
                                <vs-th>DISCOUNT ({{ invoiceData.discountPercentage }}%)</vs-th>
                                <vs-td>{{ invoiceData.discountedAmount }} USD</vs-td>
                            </vs-tr> -->
                            <vs-tr>
                                <th>TOTAL</th>
                                <td>{{ getValorTotal(orcamento.valorTotal,1) }}</td>
                            </vs-tr>
                        </vs-table>
                    </div>

                    <!-- INVOICE FOOTER -->
                    <!-- <div class="invoice__footer text-right p-base">
                        <p class="mb-4">Transfer the amounts to the business amount below. Please include invoice number on your check.</p>
                        <p>
                            <span class="mr-8">BANK: <span class="font-semibold">FTSBUS33</span></span>
                            <span>IBAN: <span class="font-semibold"> G882-1111-2222-3333 </span></span>
                        </p>
                    </div> -->
                </vx-card>
            </div>
        </template>

<script>

import { Validator } from 'vee-validate';
import validatePtBR from '../../rapidsoft/validate/validate_ptBR'
import ErrorDB from '../../rapidsoft/db/errorDB'
import UtilMask from '../../rapidsoft/utils/utilMask';
// import ProdutoDB from '../../rapidsoft/db/produtoDB';
// import CarrinhoDB from '../../rapidsoft/db/carrinhoDB';
import CarrinhoUtils from '../../rapidsoft/utils/carrinhoUtils';
// import _ from 'lodash';

Validator.localize('pt', validatePtBR);

export default {
    data() {
        return {  
            mailTo: "",
            orcamento: {},
        }
    },
    components: {

    },
    watch: {

    },
    computed:{
       
    },
    methods: {

        carrinhoPedido() {
            this.$router.push({ name: 'carrinhoPedido', params: {orcamentoId: this.orcamento.id} });
        },

        carregaItensTela() {

            CarrinhoUtils.getCarrinhoNomeProdutoById(this.$route.params.orcamento.id).then((orcamento) => {
                this.orcamento = orcamento.value
            });

        },

        getValorTotal(quantidade, valor) {
            
            const orcamento = {
                valorTotal: quantidade * valor,
                grupoCliente: {
                    moeda:'R$'
                }
            };
            
            return UtilMask.getMoney(orcamento.valorTotal, true, orcamento.grupoCliente);
        },

        voltarPedido() {
            this.$router.go(-1);
        },

        printInvoice() {
            window.print()
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
        
        this.$emit("setAppClasses", "invoice-page")
    },
    beforeCreate() {
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
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

@media print {
  .invoice-page {
    * {
      visibility: hidden;
    }

    #content-area {
      margin: 0 !important;
    }

    #invoice-container,
    #invoice-container * {
      visibility: visible;
    }
    #invoice-container {
      position: absolute;
      left: 0;
      top: 0;
      box-shadow: none;
    }
  }
}

</style>
