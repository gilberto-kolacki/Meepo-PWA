<template>
    <div id="page-sincronizacao">
        <div class="vx-row">
            <div class="vx-col w-full mb-base-button">
                <vs-button color="primary" icon-pack="feather" icon="icon-download-cloud" class="mb-2 w-full" @click="sincronizarTodos()">Sincronizar todos</vs-button>
            </div>
        </div>
        <div class="vx-row">
            <div class="w-full sm:w-1/2 mb-2" :key="indextr" v-for="(sinc, indextr) in sincronizacao">
                <vx-card :title="sinc.titulo" class="vx-card-sinc">
                    <template slot="no-body">
                        <div class="my-5">
                            <div class="flex justify-between">
                                <div class="flex flex-col" style="font-size: 11px;">
                                    Última Sincronização: {{ sinc.dataSincronizacao | formatDateTime }} </br>
                                    Duração {{ sinc.tempoSincronizacao }} segundos
                                </div>
                                <div class="flex flex-col text-right" v-show="sinc.total">
                                    {{ sinc.parcial +' de '+ sinc.total }} </br>
                                    <h5>{{ sinc.percent }}%</h5>
                                </div>
                            </div>
                            <vs-progress :height="10" :percent="sinc.percent" color="success" v-if="sinc.percent == 100"></vs-progress>
                            <vs-progress :height="10" :percent="sinc.percent" color="warning" v-else-if="sinc.percent >= 60"></vs-progress>
                            <vs-progress :height="10" :percent="sinc.percent" color="primary" v-else></vs-progress>
                        </div>
                    </template>

                    <div class="flex justify-between text-center" slot="no-body-bottom">
                        <div class="w-full border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0">
                            <div class="vx-col my-5">
                                <vs-button type="filled" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-download-cloud" :id="'button-with-loading-'+sinc.type" class="vs-con-loading__container w-full" @click.stop="sincronizar(sinc)" ref="loadableButton">Sincronizar</vs-button>
                            </div>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
    </div>
</template>

<script>

import _ from 'lodash'
import produtoService from '../../rapidsoft/service/produtoService'
import imagemService from '../../rapidsoft/service/imagemService'
import sincDataDB from '../../rapidsoft/db/sincDataDB'
import produtoDB from '../../rapidsoft/db/produtoDB'
import imagemDB from '../../rapidsoft/db/imagemDB'

export default {
    data() {
        return {
            backgroundLoading:'default',
            colorLoading:'#fff',
            sincronizacao: [],
        }
    },
    components: {
    },
    methods: {
        sincronizarTodos() {
            this.sincronizacao.forEach(sinc => {
                this.sincronizar(sinc);
            });
        },
        sincronizar(sinc) {
            if(!sinc.ativo) {
                sinc.ativo = true;
                sinc.parcial = 0;
                sinc.percent = 0;
                sinc.inicio = Date.now();

                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading-"+sinc.type,
                    scale: 0.7
                });
                if (sinc.methodo && sinc.methodo != "") {
                    _.defer(() => this[sinc.methodo](sinc));
                } else {
                    _.defer(() => this.closeLoading(sinc));
                }
            }
        },
        closeLoading(sinc) {
            sinc.erro = false;
            sincDataDB.finalizaSinc(_.clone(sinc)).then((sincResult) => {
                sinc.dataSincronizacao = sincResult.dataSincronizacao;
                sinc.tempoSincronizacao = sincResult.tempoSincronizacao;

                setTimeout(()=> {
                     this.$vs.loading.close("#button-with-loading-"+sinc.type+" > .con-vs-loading");
                     if (sinc.percent >= 99) sinc.percent = 100;
                     sinc.ativo = false;
                 }, 1000);
            })
        },
        errorSinc(sinc, error) {
            console.log(error);
            
            sinc.erro = true;
            const mensagem = error.response.data.mensagem ? error.response.status +" "+ error.response.data.mensagem : error.response.status +" "+ error.response.statusText;
            this.$vs.notify({
                title: 'Erro!',
                text: mensagem,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            })
            _.defer(() => this.closeLoading(sinc));
        },
        sincProduto(sinc) {
            produtoService.sincProduto().then((produtos) => {
                sinc.total = produtos.length;
                produtoDB.limparBase().then(() => {
                    produtos.forEach(produto => {
                        produtoDB.salvar(produto).then(() => {
                            this.atuaizaParcialSincImagem(sinc, 1);
                            if(_.last(produtos) === produto) this.closeLoading(sinc);
                        });
                    });
                });
            }).catch((error) => {
                this.errorSinc(sinc, error);
            });
        },        
        atuaizaParcialSincImagem(sinc, imagensSalvas) {
            sinc.parcial = (sinc.parcial + imagensSalvas);
            sinc.percent = _.round((sinc.parcial)/sinc.total * 100, 1);
        },
        downloadImagensFromData(sinc, data) {
            return new Promise((resolve, reject) => {
                const quantidadeSinc = 60;
                let idsFotos = _.take(data.fotos, quantidadeSinc);
                
                imagemService.sincImagemFoto(idsFotos).then((resultFotos) => {
                    imagemDB.salvarFotos(resultFotos).then((fotosSalvas) => {
                        data.fotos = _.pullAll(data.fotos, idsFotos);
                        this.atuaizaParcialSincImagem(sinc, fotosSalvas);

                        let idsCores = _.take(data.cores, quantidadeSinc);
                        imagemService.sincImagemCor(idsCores).then((resultCores) => {
                            imagemDB.salvarCores(resultCores).then((coresSalvas) => {
                                data.cores = _.pullAll(data.cores, idsCores);
                                this.atuaizaParcialSincImagem(sinc, coresSalvas);

                                let idsSelos = _.take(data.selos, quantidadeSinc);
                                imagemService.sincImagemSelo(idsSelos).then((resultSelos) => {
                                    imagemDB.salvarSelos(resultSelos).then((selosSalvos) => {
                                        data.selos = _.pullAll(data.selos, idsSelos);
                                        this.atuaizaParcialSincImagem(sinc, selosSalvos);

                                        let idsSimbolos = _.take(data.simbolos, quantidadeSinc);
                                        imagemService.sincImagemSimbolo(idsSimbolos).then((resultSimbolos) => {
                                            imagemDB.salvarSimbolos(resultSimbolos).then((simbolosSalvos) => {
                                                data.simbolos = _.pullAll(data.simbolos, idsSimbolos);
                                                this.atuaizaParcialSincImagem(sinc, simbolosSalvos);

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
        sincImagem(sinc) {           
            produtoDB.getIdsImagens().then((retorno) => {
                sinc.parcial = 0;
                sinc.total = retorno.quantidade;
                
                imagemDB.limparBase().then(() => {
                    this.downloadImagensFromData(sinc, retorno.data).then(() => {
                        this.closeLoading(sinc);
                    })
                })
            });
        },

    },

    beforeMount() {
        this.$vs.loading();
        sincDataDB.getAll().then((sinData) => {
            this.sincronizacao = sinData;
            this.$vs.loading.close();
        });
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
</style>