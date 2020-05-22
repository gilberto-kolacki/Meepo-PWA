<template>
    <div id="invoice-page">
        <div class="flex flex-wrap items-center justify-between">
            <div class="flex items-center">
                <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarConsulta()" icon="icon-x">Voltar</vs-button>
                <vs-button @click.stop="printInvoice" color="primary" type="filled" class="btn-carrinho" icon-pack="feather" icon="icon-printer"></vs-button>
            </div>
        </div>
        <vx-card id="invoice-container">

            <!-- INVOICE METADATA -->
            <div class="vx-row leading-loose p-base">
                <div class="vx-col w-1/2 mt-base">
                    <img src="@/assets/images/logo/logo2.png" alt="vuexy-logo">
                </div>
                <div class="vx-col w-1/2 text-right">
                    <h1 v-if="isOrcamento">Orçamento</h1>
                    <h1 v-else>Pedido</h1>
                    <div class="invoice__invoice-detail mt-6">
                        <h6>Número: {{ getNumero }}</h6>
                        <h6 class="mt-4">{{ getData | formatDate }}</h6>
                        <h6 class="mt-4">{{ textoLinha }}</h6>
                    </div>
                </div>
                <div class="vx-col w-1/2 mt-12">
                    <h5>Cliente: {{ getCliente.cpfCnpj | cpfCnpj }}</h5>
                    <div class="invoice__recipient-info my-4">
                        <p>Rua: {{ getCliente.endereco.endereco }}, {{ getCliente.endereco.numero }}</p>
                        <p>Cidade: {{ getCliente.endereco.cidade }} / {{ getCliente.endereco.estado }}</p>
                        <p>CEP: {{ getCliente.endereco.cep | cep }}</p>
                    </div>
                </div>
                <div class="vx-col w-1/2 text-right mt-12">
                    <h5>{{ getCliente.nome | capitalize }}</h5>
                    <div class="invoice__company-info my-4">
                        <p>Comp: {{ getCliente.endereco.complemento }}</p>
                    </div>
                    <div class="invoice__company-contact">
                        <p class="flex items-center justify-end">
                            <feather-icon icon="MailIcon" svgClasses="h-4 w-4"></feather-icon>
                            <span class="ml-2">{{ getCliente.emailNfe }}</span>
                        </p>
                        <p class="flex items-center justify-end">
                            <feather-icon icon="PhoneIcon" svgClasses="h-4 w-4"></feather-icon>
                            <span class="ml-2">{{ getCliente.endereco.telefone }}</span>
                        </p>
                    </div>

                </div>
            </div>

            <!-- INVOICE CONTENT -->
            <div class="p-base">
                <!-- INVOICE TASKS TABLE -->
                <h6 v-if="isOrcamento">Resumo do Orçamento</h6>
                <h6 v-else>Resumo do Pedido</h6>

                <div v-for="(embarque, indexEmbarque) in embarques" :key="indexEmbarque">
                    <h5>{{embarque.nome}}</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Ref.</th>
                                    <th scope="col">Cor</th>
                                    <th scope="col">Foto</th>
                                    <th scope="col">Descrição</th>
                                    <th scope="col">Grade</th>
                                    <th scope="col">Vlr Unit.</th>
                                    <th scope="col">Qtde</th>
                                    <th scope="col">Vlr Sub.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, indexCor) in embarque.itens" :key="indexCor">
                                    <td>{{item.referencia}}</td>
                                    <td>{{item.nomeCor || item.cor}}</td>
                                    <td style="padding: 1px; max-width:60px !important; min-width:50px !important;" >
                                        <img :src="getImagemCorProduto(item)" class="rounded m-2 responsive" style="max-width:40px !important; min-width:30px !important;" />
                                    </td>
                                    <td>{{item.nome}}</td>
                                    <td style="padding: 1px;">
                                        <table>
                                            <thead class="border-solid">
                                                <th class="grade-tam-prod-title" v-for="(tamanho, indexTamanho) in item.tamanhos" :key="indexTamanho">
                                                    {{tamanho.codigo}}
                                                </th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="grade-tam-prod-qtde" v-for="(tamanho, indexTamanho) in item.tamanhos" :key="indexTamanho">
                                                        {{tamanho.quantidade}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>{{item.precoCusto | money }}</td>
                                    <td>{{item.quantidade}}</td>
                                    <td>{{getValorSub(item) | money }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th><strong>Totais</strong></th>
                                    <th>
                                        <div class="flex w-full items-center justify-center">
                                            <strong>{{getTotalPecas(embarque)}}</strong>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="flex w-full items-center justify-center">
                                            <strong>{{getValorPecas(embarque) | money}}</strong>
                                        </div>
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div class="invoice__footer text-right p-base">
                <p class="mb-4">Valores e quantidades podem sofrer alterações sem aviso prévio.</p>
            </div>
        </vx-card>
    </div>
</template>

<script>

import ProdutoDB from "../../rapidsoft/db/produtoDB";

export default{
    data () {
        return {
            isPedido: false,
            isOrcamento: false,
            orcamento: null,
            pedido: null,
            embarques: [],
            textoLinha: "",
            imagensCorProduto: [],
        }
    },
    computed: {
        getNumero() {
            if (this.isOrcamento) {
                return this.orcamento.id;
            } else {
                return this.pedido.id;
            } 
        },
        getData() {
            if (this.isOrcamento) {
                return this.orcamento.dataOrcamento;
            } else {
                return this.pedido.dataOrcamento;
            } 
        },
        getCliente() {            
            if (this.isOrcamento) {
                return this.orcamento.cliente;
            } else {
                return this.pedido.cliente;
            } 
        },
    },
    methods: {
        printInvoice () {
            window.print();
        },
        getLinha() {
            const refecencias = this.embarques.reduce((itensEmbarques, embarque) => itensEmbarques.concat(embarque.itens), []).map((item) => item.referencia);
            ProdutoDB.getSegmentosReferencias(refecencias).then((linhas) => {
                this.textoLinha = linhas.reduce((textoLinha, linha) => {
                    return textoLinha == "" ? linha.nome : textoLinha.concat("/").concat(linha.nome);
                }, "");
            });
        },
        voltarConsulta() {
            if (this.isOrcamento) {
                this.$router.push({ name: 'orcamentoVisualizar', params: { orcamentoId: this.orcamento.id }});
            } else {
                this.$router.push({ name: 'pedidoEditar', params: {pedidoId: this.pedido.id} });
            }
        },
        getTotalPecas(embarque) {
            return embarque.itens.reduce((total, item) => {
                return total + item.quantidade;
            }, 0);
        },
        getValorPecas(embarque) {
            return embarque.itens.reduce((total, item) => {
                return total + (item.quantidade * item.precoCusto);
            }, 0);
        },
        getImagemCorProduto(item) {
            if (this.isOrcamento) {
                return this.imagensCorProduto.find((imagem) => imagem.referencia === item.referencia && imagem.cor === item.nomeCor).base64;
            } else {
                return item.base64;
            }
        },
        getValorSub(item) {
            return item.quantidade * item.precoCusto;
        }
    },
    components: {},
    created() {
        if (this.$route.params.orcamento) {
            this.isOrcamento = true;
            this.orcamento = this.$route.params.dados;
            ProdutoDB.getImagensCorProdutoEmbarques(this.$route.params.dados.embarques).then((imagensCorProduto) => {
                this.embarques = this.$route.params.dados.embarques
                this.imagensCorProduto = imagensCorProduto;
                this.getLinha();
            });
        } else {
            this.isPedido = true;
            this.pedido = this.$route.params.dados;
            ProdutoDB.getImagensCorProdutoEmbarques(this.$route.params.dados.itens, true).then((imagensCorProduto) => {
                this.embarques = [{id: this.pedido.embarque, nome: this.pedido.nome, itens: this.$route.params.dados.itens}];
                this.imagensCorProduto = imagensCorProduto;
                this.getLinha();
            });
        }
    },
    mounted () {
        this.$emit('setAppClasses', 'invoice-page');
    }
}
</script>

<style lang="scss">

.grade-tam-prod-title {
    background-color:#808080;
    color:black;
    font-size: 10px;
    font-weight:bold;
    padding: 9px !important;
}

.grade-tam-prod-qtde {
    border-color:#808080;
    text-align: center !important;
    border-style: solid !important;
    font-size: 10px;
    padding: 9px !important;
}

@media print {
    .invoice-page {
        * {
            visibility: hidden;
        }

        #content-area {
            margin: 0 !important;
        }

        .vs-con-table {
            .vs-con-tbody {
                overflow: hidden !important;
            }
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

@page {
  size: auto;
}
</style>
