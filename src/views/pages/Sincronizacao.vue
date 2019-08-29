<template>
    <div id="page-sincronizacao">
        <div class="vx-row">
            <div class="vx-col w-full mb-base-button">
                <vs-button color="primary" class="mb-2 w-full" @click="sincronizarTodos()">Sincronizar todos</vs-button>
            </div>
        </div>
        <div class="vx-row">
            <div class="w-full sm:w-1/2 mb-2" :key="indextr" v-for="(sinc, indextr) in sincronizacao">
                <vx-card :title="sinc.titulo" :class="'vx-card-sinc'">
                    <template slot="no-body">
                        <div class="my-5">
                            <vs-progress :height="10" :percent="sinc.percent" color="success" v-if="sinc.percent == 100"></vs-progress>
                            <vs-progress :height="10" :percent="sinc.percent" color="primary" v-else></vs-progress>
                        </div>
                    </template>

                    <div class="flex justify-between text-center" slot="no-body-bottom">
                        <div class="w-full border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0">
                            <div class="vx-col my-5">
                                <vs-button color="rgb(62, 201, 214)" :id="'button-with-loading-'+sinc.type" class="vs-con-loading__container w-full" v-on:click.stop="sincronizar(sinc)" type="relief" ref="loadableButton">Sincronizar</vs-button>
                            </div>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
    </div>
</template>

<script>

import cidadeDB from '../../rapidsoft/db/cidadeDB'

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
                },
                {
                    titulo: "Cidades",
                    type:"cidade",
                    percent: 0,
                },
                {
                    titulo: "Coleções",
                    type:"colecao",
                    percent: 0,
                },
                {
                    titulo: "Imagens/Videos",
                    type:"imagem",
                    percent: 0,
                },
                {
                    titulo: "Clientes",
                    type:"cliente",
                    percent: 0,
                },
                {
                    titulo: "Condição de Pagamentos",
                    type:"condPagto",
                    percent: 0,
                }
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

                for (let index = 0; index <= 10000; index++) {
                    sinc.percent = index/100;

                    if(index == 10000) {
                        setTimeout(()=> {
                            this.$vs.loading.close("#button-with-loading-"+sinc.type+" > .con-vs-loading")
                            sinc.ativo = false;
                        }, 1000);
                    }
                }        
            }
        }
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