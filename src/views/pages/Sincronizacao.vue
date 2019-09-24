<template>
    <div id="page-sincronizacao">
        <div class="vx-row">
            <div class="vx-col w-full mb-base-button">
                <vs-button color="primary" icon-pack="feather" icon="icon-download-cloud" class="mb-2 w-full" @click="sincronizarTodos()">Sincronizar todos</vs-button>
            </div>
        </div>
        <div class="vx-row">
            <div class="w-full sm:w-1/2 mb-2" :key="indextr" v-for="(sinc, indextr) in sincronizacao">
                <vx-card :title="sinc.titulo" :class="'vx-card-sinc'">
                    <template slot="no-body">
                        <div class="my-5">
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
import produtoDB from '../../rapidsoft/db/produtoDB'
import imagemDB from '../../rapidsoft/db/imagemDB'

export default {
    data() {
        return {
            backgroundLoading:'default',
            colorLoading:'#fff',
            sincronizacao: [
                {
                    titulo: "Produtos",
                    type:"produto",
                    percent: 0,
                    methodo: "sincProduto"
                },
                {
                    titulo: "Imagens/Videos",
                    type:"imagem",
                    percent: 0,
                    methodo: "sincImagem"
                },
            ],            
            
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
                sinc.percent = 0;

                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading-"+sinc.type,
                    scale: 0.7
                });
                if (sinc.methodo && sinc.methodo != "") {
                    this[sinc.methodo](sinc);
                } else {
                    _.defer(() => this.closeLoading(sinc));
                }
            }
        },
        closeLoading(sinc) {
           setTimeout(()=> {
                this.$vs.loading.close("#button-with-loading-"+sinc.type+" > .con-vs-loading");
                if (sinc.percent >= 99) sinc.percent = 100;
                sinc.ativo = false;
            }, 1000);
        },
        errorSinc(error) {
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
            produtoService.sincProduto().then((result) => {
                if (result.status === 200) {
                    const produtos = result.data;
                    for (let index = 0; index < produtos.length; index++) {
                        sinc.percent = _.round(index/produtos.length * 100, 1);
                        produtoDB.salvar(produtos[index]).then(() => {
                            if (index+1 === produtos.length) _.defer(() => this.closeLoading(sinc));
                        });
                    }
                }
            }).catch((error) => {
                this.errorSinc(error);
            });
        },
        sincImagem(sinc) {
            produtoService.sincImagem().then((result) => {
                if (result.status === 200) {
                    console.log(result.data);
                    
                    const fotos = result.data.fotos;
                    const cores = result.data.cores;
                    const selos = result.data.selos;
                    const simbolos = result.data.simbolos;
                    
                    for (let index = 0; index < cores.length; index++) {
                        sinc.percent = _.round(index/cores.length * 100, 1);
                        const imagem = cores[index];
                        imagemDB.salvarFoto(imagem).then(() => {
                            
                            if (index+1 === cores.length) _.defer(() => this.closeLoading(sinc));
                        });
                    }
                }
            }).catch((error) => {
                this.errorSinc(error);
            });
        },
    }
}

</script>

<style lang="scss">
    .my-5 {
        margin: 1rem;
    }
    .vx-card-sinc {
        width: 99% !important
    }
    .mb-base-button {
        margin-bottom: 0.8rem !important;
    }
</style>