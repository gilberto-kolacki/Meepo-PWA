<template>
    <div id="page-sincronizacao" v-if="this.showScreen">
        <div v-bind:style="{marginBottom: '-20px'}" class="vx-row">
            <div class="vx-col w-full mb-base-button">
                <vs-button color="primary" icon-pack="feather" icon="icon-download-cloud" class="mb-2 w-full" @click="sincronizarAlert()">Sincronizar todos</vs-button>
            </div>
        </div>
        <div class="vx-row" >
            <div class="w-full sm:w-1/2 mb-2" :key="indextr" v-for="(sinc, indextr) in tabelasSincronizacao">
                <vx-card class="vx-card-sinc" v-bind:style="{marginBottom: '-36px'}">
                    <template slot="no-body">
                        <div class="my-5">
                            <br />
                            <div class="flex mb-4">
                                <div class="flex justify-start w-3/4 bg-grid-color h-12">
                                    <b v-bind:style="{fontSize: '22px'}">{{sinc.titulo}}</b>
                                </div>
                                <div class="flex justify-end w-1/4 bg-grid-color-secondary h-12">
                                    <vs-button radius color="rgb(123, 123, 123)" :id="'button-with-loading-'+sinc.type" class="vs-con-loading__container" @click.stop="sincronizar(sinc)" ref="loadableButton" icon-pack="feather" icon="icon-download-cloud"></vs-button>                    
                                </div>
                            </div>
                            <div class="flex justify-between">
                                <div class="flex flex-col" style="font-size: 11px;">
                                    Última Sincronização: {{ sinc.dataSincronizacao | formatDateTime }} <br />
                                    Duração {{ sinc.tempoSincronizacao }} segundos
                                </div>
                                <div class="flex flex-col text-right" v-show="sinc.total">
                                    {{ sinc.parcial +' de '+ sinc.total }} <br />
                                    <h5>{{ sinc.percent }}%</h5>
                                </div>
                            </div>
                            <vs-progress :height="10" :percent="sinc.percent" color="success" v-if="sinc.percent == 100"></vs-progress>
                            <vs-progress :height="10" :percent="sinc.percent" color="warning" v-else-if="sinc.percent >= 60"></vs-progress>
                            <vs-progress :height="10" :percent="sinc.percent" color="primary" v-else></vs-progress>
                        </div>
                    </template>
                </vx-card>
            </div>
        </div>
    </div>
</template>

<script>

import SincUtils from '../../rapidsoft/utils/sincUtils';
import ProdutoService from '../../rapidsoft/service/produtoService';
import ClienteService from '../../rapidsoft/service/clienteService';
import OrcamentoService from '../../rapidsoft/service/orcamentoService';
import PedidoService from '../../rapidsoft/service/pedidoService';
import ParametroService from '../../rapidsoft/service/parametroService';
import SincDataDB from '../../rapidsoft/db/sincDataDB';
import ProdutoDB from '../../rapidsoft/db/produtoDB';
import ClienteDB from '../../rapidsoft/db/clienteDB';
import GrupoClienteDB from '../../rapidsoft/db/grupoClienteDB';
import CategoriaDB from '../../rapidsoft/db/categoriaDB';
import ProntaEntregaDB from '../../rapidsoft/db/prontaEntregaDB';
import PeriodoDB from '../../rapidsoft/db/periodoDB';
import EmbarqueDB from '../../rapidsoft/db/embarqueDB';
import FormaPagtoDB from '../../rapidsoft/db/formaPagtoDB';
import CidadeDB from '../../rapidsoft/db/cidadeDB';
import CatalogoDB from '../../rapidsoft/db/catalogoDB';
import RefComercialDB from '../../rapidsoft/db/referenciaComercialDB';
import ErrorDB from '../../rapidsoft/db/errorDB';
import PedidoDB from '../../rapidsoft/db/pedidoDB';
import OrcamentoDB from '../../rapidsoft/db/orcamentoDB';
import CarrinhoDB from '../../rapidsoft/db/carrinhoDB';

export default {
    data() {
        return {
            showScreen: false,
            tabelasSincronizacao: [],
            sincAtivo: false,
            sincImagemObject: null,
            downloadImagem: {
                quantidade: 0,
                data: null,
            }
        }
    },
    components: {
    },
    methods: {
        carregarSinc() {
            if (document.getElementsByClassName('con-vs-loading').length == 1) {
                this.$vs.loading({
                    background: 'rgba(0, 0, 0, 0.15)',
                    color: 'danger',
                    scale: 0.9
                });
            }
        },
        sincronizarAlert() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Atenção`,
                text: 'Isso levará algum tempo, Deseja realmente sincronizar todos os Dados do Sistema?',
                acceptText: 'Sim',
                cancelText: 'Não',
                accept: this.sincronizarTodos,
            })
        },
        openErroSincronizarImgAlert(){
            this.$vs.dialog({
                color:'warning',
                title: `Atenção`,
                text: 'Não foi permitido a sincronização de imagens. Sincronize primeiro os produtos !',
                acceptText: 'Entendi',
            })
        },
        sincronizarTodos() {
            this.sincAll = true;
            this.tabelasSincronizacao.forEach(sinc => {        
                sinc.parcial = 0;
                sinc.percent = 0;
                if (!(sinc.type == "imagem")) {
                    this.lodash.defer(() => this.sincronizar(sinc, true));
                }
            });
        },
        sincronizar(sinc, all = false) {
            if (this.sincAtivo) {
                setTimeout(()=> this.lodash.defer(() => this.sincronizar(sinc, true)), 2000);                
            } else {
                if(!sinc.ativo) {                    
                    sinc.ativo = true;
                    sinc.parcial = 0;
                    sinc.percent = 0;
                    sinc.inicio = Date.now();
                    SincUtils.openLoading(this, sinc);
                    if (sinc.methodo && sinc.methodo != "") {
                        this.sincAtivo = true;
                        this.lodash.defer(() => this[sinc.methodo](sinc, all));
                    } else {
                        SincUtils.closeLoading(this, sinc);
                    }
                }
            }
        },
        errorSinc(sinc, error) {
            this.sincAtivo = false;
            sinc.erro = true;
            let mensagem = "Problemas com a Internet!"
            if (error && error.response) {
                if (error.response && error.response.data.mensagem) {
                    mensagem = error.response.status +" "+ error.response.data.mensagem;
                } else {
                    mensagem = error.response.status +" "+ error.response.statusText;
                }
            }

            ErrorDB._criarLogErroSinc(sinc, error, mensagem).then(() => {
                this.$vs.notify({
                    title: 'Erro!',
                    text: mensagem,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                this.lodash.defer(() => SincUtils.closeLoading(this, sinc));
            });
        },
        sincProduto(sinc, all) {
            this.carregarSinc();
            ProdutoService.sincProduto().then((produtos) => {
                sinc.total = produtos.length;
                ProdutoDB._limparBase().then(() => {
                    if (produtos.length > 0) {
                        const done = this.lodash.after(produtos.length, () => {
                            SincUtils.closeLoading(this, sinc, all);
                            this.sincronizar(this.sincImagemObject, all);
                        });
                        produtos.forEach(produto => {
                            ProdutoDB.salvar(produto).then(() => {
                                SincUtils.atuaizaParcialSinc(sinc, 1);            
                                done();
                            }).catch((error) => {
                                ErrorDB._criarLogDB({url: 'pages/Sincronizacao', method:'sincProduto', message: error, error:'Failed Request'});
                                SincUtils.atuaizaParcialSinc(sinc, 1);            
                                done();
                            });
                        });
                    } else {
                        SincUtils.closeLoading(this, sinc, all);
                        this.sincronizar(this.sincImagemObject, all);
                    }
                }).catch((error) => {
                    ErrorDB._criarLogDB({url: 'pages/Sincronizacao', method:'sincProduto', message: error, error:'Failed Request'});
                    SincUtils.closeLoading(this, sinc, all);
                });
            }).catch((error) => {
                this.errorSinc(sinc, error);
            });
        },
        sincImagem(sinc, all) {
            this.carregarSinc();
            SincUtils.verificaProdutosSemImagens().then((result) => {
                this.downloadImagem = result;
                sinc.parcial = 0;
                sinc.total = this.downloadImagem.quantidade;
                if (this.downloadImagem.quantidade > 0) {
                    SincUtils.downloadImagensFromData(sinc, this.downloadImagem.data).then(() => {
                        SincUtils.removeImagensSemProduto().then(() => {
                            SincUtils.closeLoading(this, sinc, all);
                        });
                    });
                } else {
                    SincUtils.removeImagensSemProduto().then(() => {
                        SincUtils.closeLoading(this, sinc, all);
                    });
                }
            });
        },
        sincCliente(sinc,all) {
            this.carregarSinc();
            ClienteDB.buscaClientesSinc().then((clientesSinc) => {
                ClienteService.sincCliente(clientesSinc).then((clientes) => {
                    sinc.total = clientes.length;
                    ClienteDB._limparBase(clientesSinc).then(() => {
                        const done = this.lodash.after(clientes.length, () => SincUtils.closeLoading(this, sinc, all));
                        clientes.forEach(cliente => {
                            ClienteDB.salvarSinc(cliente).then(() => {
                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                done();
                            }).catch((error) => {
                                ErrorDB._criarLogDB({url: 'pages/Sincronizacao', method:'sincCliente', message: error, error:'Failed Request'});
                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                done();
                            });
                        });
                    }).catch((error) => {
                        ErrorDB._criarLogDB({url: 'pages/Sincronizacao', method:'sincCliente', message: error, error:'Failed Request'});
                        SincUtils.closeLoading(this, sinc, all);
                    });
                }).catch((error) => {
                    this.errorSinc(sinc, error);
                });
            });
        },
        sincParametro(sinc,all) {
            this.carregarSinc()
            ParametroService.sincParametro().then((data) => {
                sinc.total = Object.keys(data).length;
                GrupoClienteDB.salvarSinc(data.grupoCliente).then(() => {
                    SincUtils.atuaizaParcialSinc(sinc, 1);
                    CategoriaDB.salvarSinc(data.categoria).then(() => {
                        SincUtils.atuaizaParcialSinc(sinc, 1);
                        ProntaEntregaDB.salvarSinc(data.prontaEntrega).then(() => {
                            SincUtils.atuaizaParcialSinc(sinc, 1);
                            PeriodoDB.salvarSinc(data.periodo).then(() => {
                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                EmbarqueDB.salvarSinc(data.embarque).then(() => {
                                    SincUtils.atuaizaParcialSinc(sinc, 1);
                                    FormaPagtoDB.salvarSinc(data.formaPagamento).then(() => {
                                        SincUtils.atuaizaParcialSinc(sinc, 1);
                                        CatalogoDB.salvarSinc(data.catalogo).then(() => {
                                            SincUtils.atuaizaParcialSinc(sinc, 1);
                                            RefComercialDB.salvarSinc(data.referenciaComercial).then(() => {
                                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                                SincUtils.closeLoading(this, sinc, all);
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }).catch((error) => {
                this.errorSinc(sinc, error);
            });
        },
        sincCidade(sinc, all) {
            !all ? this.carregarSinc() : undefined;
            CidadeDB._limparBase().then(() => {
                SincUtils.downloadCidadesFromData(sinc).then(() => {
                    SincUtils.closeLoading(this, sinc, all);
                }).catch((error) => {
                    this.errorSinc(sinc, error);
                });
            });
        },
        sincPedido(sinc, all) {
            PedidoDB.buscaSinc().then((pedidosSinc) => {
                PedidoService.sincPedido(pedidosSinc).then((pedidos) => {
                    if (pedidos.length > 0) {
                        sinc.parcial = 0;
                        sinc.total = pedidos.length;
                        const done = this.lodash.after(pedidos.length, () => SincUtils.closeLoading(this, sinc, all));
                        pedidos.forEach(pedido => {
                            PedidoDB._salvarSinc(pedido).then(() => {
                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                done();
                            }).catch((error) => {
                                ErrorDB._criarLogDB({url: 'pages/Sincronizacao', method:'sincPedido', message: error, error:'Failed Request'});
                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                done();
                            });
                        });
                    } else {
                        SincUtils.closeLoading(this, sinc, all);
                    }
                }).catch((error) => {
                    this.errorSinc(sinc, error);
                });
            });
        },
        sincOrcamento(sinc, all) {
            OrcamentoDB.buscaSinc().then((orcamentosSinc) => {
                OrcamentoService.sincOrcamento(orcamentosSinc).then((orcamentos) => {
                    if (orcamentos.length > 0) {
                        sinc.parcial = 0;
                        sinc.total = orcamentos.length;
                        const done = this.lodash.after(orcamentos.length, () => SincUtils.closeLoading(this, sinc, all));
                        orcamentos.forEach(orcamento => {
                            OrcamentoDB._salvarSinc(orcamento).then(() => {
                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                done();
                            }).catch((error) => {
                                ErrorDB._criarLogDB({url: 'pages/Sincronizacao', method:'sincOrcamento', message: error, error:'Failed Request'});
                                SincUtils.atuaizaParcialSinc(sinc, 1);
                                done();
                            });
                        });
                    } else {
                        SincUtils.closeLoading(this, sinc, all);
                    }
                }).catch((error) => {
                    this.errorSinc(sinc, error);
                });
            });
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                ClienteDB.createBases();
                PedidoDB.createBases();
                SincDataDB.getAll().then((sinData) => {
                    this.tabelasSincronizacao = this.lodash.orderBy(sinData, ['order']);
                    this.sincImagemObject = this.tabelasSincronizacao.find((sincTab) => sincTab.type === "imagem" );
                    // TODO (Luiz): Verificar a necessidade de fazer esta validação aqui, no tablet fica lento para carregar.
                    SincUtils.verificaProdutosSemImagens().then((result) => {
                        this.downloadImagem = result;
                        document.getElementById('loading-bg').style.display = "none";
                        this.showScreen = true;
                        resolve();
                    });        
                });
            });
        },
        //verifica se alguma tabela está a mais de 3 dias sem sincronizar, caso esteja, não deixa sair da tela de sincronização
        verificaSincronizacaoTotal() {
            return new Promise((resolve) => {
                // const dataLimite = new Date().setDate(new Date().getDate() - 3);
                const sincsTotal = this.tabelasSincronizacao.reduce((sincsTotal, tabela) => {
                    if ((tabela.type != "pedido" && tabela.type != "orcamento") && tabela.total === 0) sincsTotal.push(false);
                    else sincsTotal.push(true);
                    return sincsTotal;
                }, []);

                if (sincsTotal.some((sinc) => sinc == false)) {
                    resolve(this.$router.push({ name: 'sincronizacao'}));
                } else {
                    resolve();
                    // TODO (Luiz): Removido para testar a aplicação sem sincronizar base local com a nuvem
                    /* this.buscaDadosCouchDB().then(() => {
                        resolve();
                    }); */
                }
            });
        },
        setLastDateSinc() {
            this.$store.commit('UPDATE_LAST_SINC', this.tabelasSincronizacao.reduce((lastDate, sinc) => {
                if (sinc.dataSincronizacao && sinc.dataSincronizacao < lastDate) lastDate = sinc.dataSincronizacao;
                return lastDate;
            }, new Date().getTime()));
        },
        buscaDadosCouchDB() {
            return new Promise((resolve) => {
                CarrinhoDB.getCouchDB().then(() => {
                    ClienteDB.getCouchDB().then(() => {
                        OrcamentoDB.getCouchDB().then(() => {
                            PedidoDB.getCouchDB().then(() => {
                                resolve();
                            });
                        });
                    });
                });
            });
        }

    },
    async created() {
        // TODO (Luiz): Removido para testar a aplicação sem sincronizar base local com a nuvem
        //await this.buscaDadosCouchDB();
    },
    async mounted() {
        await this.carregaItensTela();
    },
    async beforeDestroy () {
        this.setLastDateSinc();
        await this.verificaSincronizacaoTotal();
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    }
}

</script>

<style lang="scss">
    .my-5 {
        margin: 1rem;
    }
    .vx-card-sinc {
        width: 98.5% !important
    }
    .mb-base-button {
        margin-bottom: 0.8rem !important;
    }
    .activeLoading {
      opacity: -5 !important;
      transform: scale(0.1);
    }
</style>