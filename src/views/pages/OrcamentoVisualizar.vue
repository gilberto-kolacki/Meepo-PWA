<template>
    <div id="invoice-page">
        
        <div class="flex flex-wrap items-center justify-between">
            <div class="flex items-center">
                <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-arrow-down" @click="carrinhoPedido()">Contiuar</vs-button>
                <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarConsulta()" icon="icon-x">Voltar</vs-button>
                <vs-button @click.stop="printInvoice" color="primary" type="filled" class="btn-carrinho" icon-pack="feather" icon="icon-printer"></vs-button>

            </div>
        </div>
        
        <vx-card id="invoice-container" v-if="this.showScreen">
            <vs-button class='w-full' color="primary" type="filled" icon-pack="feather" icon="icon-external-link" @click="replicar()"> 
                Replicar
            </vs-button>

            <div class="vx-row leading-loose p-base">
                <div class="vx-col w-full md:w-1/2">
                    <h1>Orçamento</h1>
                </div>
                <div class="vx-col w-full md:w-1/2 text-right">
                    <div class="invoice__invoice-detail mt-6">
                        <h6>Número: {{ orcamento.id }}</h6>
                    </div>
                </div>
                <div class="vx-col w-full md:w-1/2 mt-12">
                    <h5>Cliente: {{ orcamento.cliente.cpfCnpj | cpfCnpj }}</h5>
                    <div class="invoice__recipient-info my-4">
                        <p>End.: {{ orcamento.cliente.endereco.endereco + ', ' + orcamento.cliente.endereco.numero}}</p>
                        <p>Cidade: {{ orcamento.cliente.endereco.cidade + '/' + orcamento.cliente.endereco.estado}}</p>
                    </div>
                    <div class="invoice__recipient-contact " v-if="orcamento.cliente && orcamento.cliente.contatos && orcamento.cliente.contatos.lenght > 0">
                        <p class="flex items-center">
                            <feather-icon icon="PhoneIcon" svgClasses="h-4 w-4"></feather-icon>
                            <span class="ml-2">{{ orcamento.cliente.contatos[0].celular }}</span>
                        </p>
                    </div>
                </div>
                <div class="vx-col w-full md:w-1/2 text-right mt-12">
                    <h5>{{ orcamento.cliente.nome }}</h5>
                    <div class="invoice__company-info my-4">
                        <p class="flex items-center justify-end">
                            <feather-icon icon="MailIcon" svgClasses="h-4 w-4"></feather-icon>
                            <span class="ml-2" v-if="orcamento.cliente">{{ orcamento.cliente.emailNfe }}</span>
                        </p>
                        <p>Bairro: {{ orcamento.cliente.endereco.bairro }}</p>
                        <p>CEP: {{ orcamento.cliente.endereco.cep | cep }}</p>
                    </div>
                </div>
            </div>

            <!-- INVOICE CONTENT -->
            <div>
                <!-- INVOICE TASKS TABLE -->
                <vs-table hoverFlat :data="this.itensOrcamento">
                    <!-- HEADER -->
                    <template slot="thead">
                        <vs-th style="width:10%">ITEM</vs-th>
                        <vs-th style="width:35%">EMBARQUE</vs-th>
                        <vs-th style="width:5%">QNT</vs-th>
                        <vs-th style="width:10%">VALOR</vs-th>
                        <vs-th style="width:10%">DATA</vs-th>
                    </template>

                    <!-- DATA -->
                    <template slot-scope="{data}">
                        <vs-tr v-for="(tr, index) in data" :key="index">
                            <vs-td :data="data[index].id">
                                {{ data[index].id }}
                            </vs-td>
                            <vs-td :data="data[index].nome">
                                {{ data[index].nome }}
                            </vs-td>
                            <vs-td :data="data[index].quantidade">
                                {{ data[index].quantidade }}
                            </vs-td>
                            <vs-td :data="data[index].totalBruto">
                                {{ data[index].totalBruto | money(orcamento.grupoCliente) }}
                            </vs-td>
                            <vs-td :data="data[index].dataEmbarque">
                                {{ data[index].dataEmbarque | formatDate}}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>

                <!-- INVOICE SUMMARY TABLE -->
                <vs-table hoverFlat class="w-2/3 ml-auto mt-4">
                    <vs-tr>
                        <vs-th>SUBTOTAL:</vs-th>
                        <vs-td>{{ orcamento.totalBruto | moneyy(orcamento.grupoCliente) }}</vs-td>
                    </vs-tr>
                    <vs-tr>
                        <vs-th>DESCONTO (%)</vs-th>
                        <vs-td>{{orcamento.desconto1}} + {{orcamento.desconto2}} + {{orcamento.desconto3}} </vs-td>
                    </vs-tr>
                    <vs-tr>
                        <th>TOTAL:</th>
                        <td>{{ orcamento.totalLiquido | moneyy(orcamento.grupoCliente) }}</td>
                    </vs-tr>
                </vs-table>
            </div>
        </vx-card>
    </div>
</template>

<script>

import ErrorDB from '../../rapidsoft/db/errorDB'
import OrcamentoDB from '../../rapidsoft/db/orcamentoDB';
import CarrinhoUtils from '../../rapidsoft/utils/carrinhoUtils';
import Storage from '../../rapidsoft/utils/storage';

export default {
    data() {
        return {  
            showScreen: false,
            orcamento: {},
            itensOrcamento: [],
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
            if (Storage.existeCarrinho()) {
                this.$vs.dialog({
                    color:'warning',
                    title:'Atenção!',
                    text:'Para continuar um orçamento você deve limpar o carrinho ou finalizar a compra!',
                    acceptText: 'Ok',
                });
            } else {
                this.gerarCarrinho();
            }
        },
        replicar() {
            this.$vs.loading();
            const orcamento = {...this.orcamento, dataOrcamento: new Date().getTime()};
            delete orcamento.id;
            delete orcamento._id;
            delete orcamento._rev;
            OrcamentoDB.salvar(orcamento).then((id) => {
                this.carregaItensTela(id).then(() => {
                    this.$vs.loading.close();
                });
            });
        },
        gerarCarrinho() {
            CarrinhoUtils.setOrcamentoToCarrinho(this.orcamento).then(() => {
                // OrcamentoDB.deletar(this.orcamento).then(() => {
                //     this.$router.push({ name: 'carrinho' });
                // });
            });
        },
        carregaItensTela(idOrcamento = null) {
            return new Promise((resolve) => {
                idOrcamento = idOrcamento ? idOrcamento : this.$route.params.orcamentoId;
                OrcamentoDB.get(idOrcamento).then((orcamento) => {
                    this.orcamento = orcamento;
                    this.itensOrcamento = orcamento.embarques;
                    this.showScreen = true;
                    resolve();
                });
            });
        },
        voltarConsulta() {
            this.$router.go(-1);
        },
        printInvoice() {
            window.print()
        },
    },
    async mounted() {
        try {
            await this.carregaItensTela();
        } catch (error) {
            console.log(error);
        }
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
