<template>
    <div id="invoice-page">
        
        <div class="flex flex-wrap items-center justify-between">
            <div class="flex items-center">
                <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-arrow-down" @click="carrinhoPedido()">Reabrir</vs-button>
                <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarConsulta()" icon="icon-x">Voltar</vs-button>
            </div>
        </div>
        
        <vx-card id="invoice-container" v-if="this.showScreen">
            <div class="btn-group centex w-full" >
                <vs-button size="small" class="w-full" color="primary" icon-pack="feather" icon="icon-external-link" @click.stop="mensagemDuplicar()">Duplicar</vs-button>
                <vs-button size="small" class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-printer" @click.stop="printInvoice()">PDF</vs-button>
            </div>

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
                        <vs-th style="width:50%">EMBARQUE</vs-th>
                        <vs-th style="width:20%">DATA</vs-th>
                        <vs-th style="text-align:right; width:10%" >QTDE.</vs-th>
                        <vs-th style="text-align:center; width:20%">VALOR</vs-th>
                    </template>
                    <!-- DATA -->
                    <template slot-scope="{data}">
                        <vs-tr v-for="(tr, index) in data" :key="index">
                            <vs-td :data="data[index].nome">
                                {{ data[index].nome }}
                            </vs-td>
                            <vs-td :data="data[index].dataEmbarque">
                                {{ data[index].dataEmbarque | formatDate}}
                            </vs-td>
                            <vs-td :data="data[index].quantidade" style="text-align:right">
                                {{ data[index].quantidade }}
                            </vs-td>
                            <vs-td :data="data[index].totalBruto" style="text-align:right">
                                {{ data[index].totalBruto | moneyy(orcamento.grupoCliente) }}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>

                <!-- INVOICE SUMMARY TABLE -->
                <vs-table hoverFlat class="w-2/3 ml-auto mt-4">
                    <vs-tr>
                        <vs-th>SUBTOTAL:</vs-th>
                        <vs-td style="text-align:right">
                            <vs-td >{{ orcamento.quantidade }}</vs-td>
                            <vs-td style="padding-left:40px;padding-right:0px" >{{ orcamento.totalBruto | moneyy(orcamento.grupoCliente) }}</vs-td>
                        </vs-td>
                    </vs-tr>
                    <vs-tr>
                        <vs-th>DESCONTO (%)</vs-th>
                        <vs-td style="text-align:right">{{orcamento.desconto1}} + {{orcamento.desconto2}} + {{orcamento.desconto3}} </vs-td>
                    </vs-tr>
                    <vs-tr>
                        <vs-th>TOTAL:</vs-th>
                        <td style="text-align:right">{{ orcamento.totalLiquido | moneyy(orcamento.grupoCliente) }}</td>
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
            Storage.validaCarrinho(this, () => {
                this.gerarCarrinho();
            });
        },
        mensagemDuplicar() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Deseja duplicar o orçamento?',
                text: 'Será criado um novo orçamento com os mesmos dados deste.',
                accept: this.duplicar,
                acceptText: 'Duplicar',
                cancelText: 'Cancelar'
            });
        },
        duplicar() {
            this.$vs.loading();
            const orcamento = {...this.orcamento, dataOrcamento: new Date().getTime()};
            delete orcamento.id;
            delete orcamento._id;
            delete orcamento._rev;
            OrcamentoDB.salvar(orcamento).then((result) => {
                this.carregaItensTela(result.id).then(() => {
                    setTimeout(() => {
                        this.$vs.loading.close();
                    }, 300);
                });
            });
        },
        gerarCarrinho() {
            CarrinhoUtils.setOrcamentoToCarrinho(this.lodash.cloneDeep(this.orcamento)).then((result) => {
                if (result.deleta) {
                    if (result.menssagem) {
                        this.$vs.dialog({
                            color: 'warning',
                            title: 'Produtos não disponíveis para venda.',
                            text: result.menssagem,
                            acceptText: 'Entendi'});
                    }

                    OrcamentoDB.deletar(this.orcamento).then(() => {
                        this.$router.push({ name: 'carrinho' });
                    });
                } else {
                    this.$vs.dialog({
                        color: 'warning',
                        title: 'Não é possível reabrir o orçamento!',
                        text: 'Este orçamento não pode ser reaberto, nenhum dos produtos está disponível para venda.',
                        acceptText: 'Entendi',
                    });
                }
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
            this.$router.push({ name: 'orcamentoConsulta'});
        },
        printInvoice() {
            this.$router.push({ name: 'invoice', 
                params: {orcamento: true, dados: this.orcamento}
            });
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
