<template>
    <div id="page-sincronizacao">
        <div v-bind:style="{marginBottom: '-20px'}" class="vx-row">
            <div class="vx-col w-full mb-base-button">
                <!-- <vs-button color="primary" icon-pack="feather" icon="icon-download-cloud" class="mb-2 w-full" @click="sincronizarTodos()">Sincronizar todos</vs-button> -->
                <vs-button color="primary" icon-pack="feather" icon="icon-download-cloud" class="mb-2 w-full" @click="sincronizarAlert()">Sincronizar todos</vs-button>
            </div>
        </div>
        <div class="vx-row">
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

import _ from 'lodash'
import ProdutoService from '../../rapidsoft/service/produtoService'
import CidadeService from '../../rapidsoft/service/cidadeService'
import ClienteService from '../../rapidsoft/service/clienteService'
import ParametroService from '../../rapidsoft/service/parametroService'
import ImagemService from '../../rapidsoft/service/imagemService'
import SincDataDB from '../../rapidsoft/db/sincDataDB'
import ProdutoDB from '../../rapidsoft/db/produtoDB'
import ImagemDB from '../../rapidsoft/db/imagemDB'
import ClienteDB from '../../rapidsoft/db/clienteDB'
import GrupoClienteDB from '../../rapidsoft/db/grupoClienteDB'
import CategoriaDB from '../../rapidsoft/db/categoriaDB'
import ProntaEntregaDB from '../../rapidsoft/db/prontaEntregaDB'
import PeriodoDB from '../../rapidsoft/db/periodoDB'
import EmbarqueDB from '../../rapidsoft/db/embarqueDB'
import FormaPagtoDB from '../../rapidsoft/db/formaPagtoDB'
import CidadeDB from '../../rapidsoft/db/cidadeDB'
import CatalogoDB from '../../rapidsoft/db/catalogoDB'
import RefComercialDB from '../../rapidsoft/db/referenciaComercialDB'
import ErrorDB from '../../rapidsoft/db/errorDB'

export default {
    data() {
        return {
            backgroundLoading:'rgba(0, 0, 0, 0.03',
            colorLoading:'#fff',
            activeConfirm: false,
            tabelasSincronizacao: [],
            tabelasSincronizadas: []
        }
    },
    components: {
    },
    methods: {
        carregarSinc() {
            this.$vs.loading({
                background: this.backgroundLoading,
                color: 'danger',
                scale: 0.9
            });
        },
        sincronizarAlert() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Atenção`,
                text: 'Deseja realmente sincronizar todos os pedidos?',
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
            this.tabelasSincronizadas = [];


            this.tabelasSincronizacao.forEach(sinc => {
                if(sinc.methodo !== 'sincImagem'){
                    this.sincronizar(sinc, true);
                    // this.carregarSinc();
                }
            });
        },
        sincronizar(sinc, all = false) {
            if(!sinc.ativo) {
                sinc.ativo = true;
                sinc.parcial = 0;
                sinc.percent = 0;
                sinc.inicio = Date.now();

                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading-"+sinc.type,
                    scale: 0.6
                });
                if (sinc.methodo && sinc.methodo != "") {
                    if (sinc.methodo !== 'sincImagem') {
                        _.defer(() => this[sinc.methodo](sinc, all));
                    }else{                        
                        if (_.find(this.tabelasSincronizacao, (sinc) => sinc.methodo === "sincProduto").total  >= 0  ) {
                            _.defer(() => this[sinc.methodo](sinc, all));
                        }else{
                            _.defer(() => this.closeLoading(sinc, all));
                            setTimeout(()=> {
                              _.defer(() => this.openErroSincronizarImgAlert());
                            }, 1000);
                        }
                    }
                } else {
                    _.defer(() => this.closeLoading(sinc));
                }
            }
        },
        closeLoading(sinc,all) {
            sinc.erro = false;
            SincDataDB.finalizaSinc(_.clone(sinc)).then((sincResult) => {
                sinc.dataSincronizacao = sincResult.dataSincronizacao;
                sinc.tempoSincronizacao = sincResult.tempoSincronizacao;

                setTimeout(()=> {
                     this.$vs.loading.close("#button-with-loading-"+sinc.type+" > .con-vs-loading");
                     !all ? this.$vs.loading.close() : all === 'img' ? this.$vs.loading.close() : undefined;   
                     if (sinc.percent >= 99) sinc.percent = 100;
                     sinc.ativo = false;
                }, 1000);
            })
        },
        errorSinc(sinc, error) {
            sinc.erro = true;
            let mensagem = "Problemas com a Internet!"
            if (error && error.response) {
                if (error.response && error.response.data.mensagem) {
                    mensagem = error.response.status +" "+ error.response.data.mensagem;
                } else {
                    mensagem = error.response.status +" "+ error.response.statusText;
                }
            }

            ErrorDB.criarLogErroSinc(sinc, error, mensagem).then(() => {
                this.$vs.notify({
                    title: 'Erro!',
                    text: mensagem,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                _.defer(() => this.closeLoading(sinc));
            });
        },
        atuaizaParcialSinc(sinc, imagensSalvas) {
            sinc.parcial = (sinc.parcial + imagensSalvas);
            sinc.percent = _.round((sinc.parcial)/sinc.total * 100, 1);
        },
        sincProduto(sinc, all) {
            // !all ? this.carregarSinc() :undefined;
            this.carregarSinc();
            ProdutoService.sincProduto().then((produtos) => {
                sinc.total = produtos.length;
                ProdutoDB._limparBase().then(() => {
                    const done = _.after(produtos.length, () => this.closeLoading(sinc,all));
                    produtos.forEach(produto => {
                        ProdutoDB.salvar(produto).then(() => {
                            this.atuaizaParcialSinc(sinc, 1);
                            if(sinc.percent >= 100 && all === true){
                                this.tabelasSincronizacao.forEach(sinc => {
                                    if(sinc.methodo === 'sincImagem'){
                                        this.sincronizar(sinc,all);
                                    }
                                });
                            }
                            done();
                        });
                    });
                });
            }).catch((error) => {
                this.errorSinc(sinc, error);
            });
        },
        sincImagem(sinc, all) {
            this.carregarSinc()
            ProdutoDB.getIdsImagens().then((retorno) => {
                sinc.parcial = 0;
                sinc.total = retorno.quantidade;
                ImagemDB.limparBase().then(() => {
                    this.downloadImagensFromData(sinc, retorno.data).then(() => {
                        all ? this.closeLoading(sinc,all) : this.closeLoading(sinc,'img') ;
                    })
                })
            });
        },
        sincCliente(sinc,all) {
            this.carregarSinc()
            ClienteDB.buscaClientesSinc().then((clientesSinc) => {
                ClienteService.sincCliente(clientesSinc).then((clientes) => {
                    sinc.total = clientes.length;
                    ClienteDB._limparBase().then(() => {
                        const done = _.after(clientes.length, () => this.closeLoading(sinc,all));
                        clientes.forEach(cliente => {
                            ClienteDB.salvarSinc(cliente).then(() => {
                                this.atuaizaParcialSinc(sinc, 1);
                                done();
                            });
                        });
                    });
                }).catch((error) => {
                    this.errorSinc(sinc, error);
                });
            })
        },
        sincParametro(sinc,all) {
            this.carregarSinc()
            ParametroService.sincParametro().then((data) => {
                sinc.total = Object.keys(data).length;
                GrupoClienteDB.salvarSinc(data.grupoCliente).then(() => {
                    this.atuaizaParcialSinc(sinc, 1);
                    CategoriaDB.salvarSinc(data.categoria).then(() => {
                        this.atuaizaParcialSinc(sinc, 1);
                        ProntaEntregaDB.salvarSinc(data.prontaEntrega).then(() => {
                            this.atuaizaParcialSinc(sinc, 1);
                            PeriodoDB.salvarSinc(data.periodo).then(() => {
                                this.atuaizaParcialSinc(sinc, 1);
                                EmbarqueDB.salvarSinc(data.embarque).then(() => {
                                    this.atuaizaParcialSinc(sinc, 1);
                                    FormaPagtoDB.salvarSinc(data.formaPagamento).then(() => {
                                        this.atuaizaParcialSinc(sinc, 1);
                                        CatalogoDB.salvarSinc(data.catalogo).then(() => {
                                            this.atuaizaParcialSinc(sinc, 1);
                                            RefComercialDB.salvarSinc(data.referenciaComercial).then(() => {
                                                this.atuaizaParcialSinc(sinc, 1);
                                                this.closeLoading(sinc,all);
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
        sincCidade(sinc,all) {
            !all ? this.carregarSinc() : undefined;
            const siglasEstados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
            sinc.total = siglasEstados.length;
            CidadeDB._limparBase().then(() => {
                this.downloadCidadesFromData(sinc, siglasEstados).then(() => {
                    this.closeLoading(sinc);
                })
            });
        },
        
        downloadImagensFromData(sinc, data) {
            return new Promise((resolve) => {
                const quantidadeSinc = 60;
                let idsFotos = _.take(data.fotos, quantidadeSinc);
                
                ImagemService.sincImagemFoto(idsFotos).then((resultFotos) => {
                    ImagemDB.salvarFotos(resultFotos).then((fotosSalvas) => {
                        data.fotos = _.pullAll(data.fotos, idsFotos);
                        this.atuaizaParcialSinc(sinc, fotosSalvas);

                        let idsCores = _.take(data.cores, quantidadeSinc);
                        ImagemService.sincImagemCor(idsCores).then((resultCores) => {
                            ImagemDB.salvarCores(resultCores).then((coresSalvas) => {
                                data.cores = _.pullAll(data.cores, idsCores);
                                this.atuaizaParcialSinc(sinc, coresSalvas);

                                let idsSelos = _.take(data.selos, quantidadeSinc);
                                ImagemService.sincImagemSelo(idsSelos).then((resultSelos) => {
                                    ImagemDB.salvarSelos(resultSelos).then((selosSalvos) => {
                                        data.selos = _.pullAll(data.selos, idsSelos);
                                        this.atuaizaParcialSinc(sinc, selosSalvos);

                                        let idsSimbolos = _.take(data.simbolos, quantidadeSinc);
                                        ImagemService.sincImagemSimbolo(idsSimbolos).then((resultSimbolos) => {
                                            ImagemDB.salvarSimbolos(resultSimbolos).then((simbolosSalvos) => {
                                                data.simbolos = _.pullAll(data.simbolos, idsSimbolos);
                                                this.atuaizaParcialSinc(sinc, simbolosSalvos);

                                                if (fotosSalvas > 0 || coresSalvas > 0 || selosSalvos > 0 || simbolosSalvos > 0) {
                                                    this.downloadImagensFromData(sinc, data).then(() => resolve());
                                                } else {
                                                    resolve();
                                                }
                                            })
                                        });
                                    })
                                });
                            })
                        });
                    })
                })
            });
        },
        downloadCidadesFromData(sinc, siglasEstados) {
            return new Promise((resolve) => {
                let siglaEstado = siglasEstados[sinc.parcial];
                if(_.isNil(siglaEstado)) {
                    resolve();
                } else {
                    CidadeService.sincCidade(siglaEstado).then((estado) => {
                        CidadeDB.salvar(estado).then(() => {
                            this.atuaizaParcialSinc(sinc, 1);
                            this.downloadCidadesFromData(sinc, siglasEstados).then(() => resolve());
                        })
                    }).catch((error) => {
                        this.errorSinc(sinc, error);
                    }); 
                }
            });
        },
    },

    beforeMount() {
        this.$vs.loading();
        SincDataDB.getAll().then((sinData) => {
            this.tabelasSincronizacao = _.orderBy(sinData, ['order']);
            this.$vs.loading.close();
        });
    },

    errorCaptured(err, vm, info) {
        ErrorDB.criarLog({err, vm, info});
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