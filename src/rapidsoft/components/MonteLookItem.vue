<template>
    <div class="parentx">
        <div class="vx-row mt-4">
            <div class="vx-col w-full mr-6">
                <!-- <vx-card> --> 
                <div class="vx-row flex justify-center mt-4">
                    <div v-if="!produto.corSelecionada">
                        <b-img-lazy center :src="produto.corSelecionada ? produto.corSelecionada.imagens[0].imagemCor : require(`@/assets/images/rapidsoft/no-image.jpg`)" style="" class="card-img-principal responsive" id="produto-swipe-area"/>
                    </div>
                    <div v-else>
                        <b-carousel
                            class="card-img-principal responsive"
                            id="produto-swipe-area"
                            v-model="slide"
                            controls
                            indicators
                            :interval="0"
                            background="#ababab"
                            style="text-shadow: 1px 1px 2px #333;"
                        >
                        <!-- Text slides with image -->
                            <b-carousel-slide  v-for="(imagem,index) in produto.corSelecionada.imagens" :key="index">
                                <template v-slot:img>
                                <img
                                    class="d-block img-fluid w-100"
                                    width="480"
                                    height="220"
                                    :src="imagem.imagemCor"
                                    alt="image slot"
                                >
                                </template>
                            </b-carousel-slide>

                        </b-carousel>
                    </div>
                </div>
                <div class="vx-row flex justify-center mt-4 ">
                    <div class="btn-group centex w-full" >
                        <vs-button @click="mostrarProdutos()" :disabled="disabledProdutos" color="primary" type="filled" class="customizer-btn w-1/4" icon-pack="feather" icon="icon-list">Produtos</vs-button>
                        <vs-button @click="showZoom()" :disabled="buttonsConfig" color="rgb(123, 123, 123)" type="filled" class="customizer-btn w-1/4" icon-pack="feather" icon="icon-zoom-in">Zoom</vs-button>
                        <vs-button @click="mostrarCores()" :disabled="buttonsConfig" color="primary" type="filled" class="customizer-btn w-1/4" icon-pack="feather" icon="icon-settings">Cor</vs-button>
                    </div>
                </div>
                <!-- </vx-card> -->
            </div>
        </div>
        
        <fun-modal title="Cores Disponíveis" :active.sync="popupCorProduto" :button-close-hidden="false" :footer-hidden="true">
            <div slot="body">
                <div class="vx-row flex w-full montelookitem-lista-produtos p-2 ml-2" style="height: auto; overflow-x: hidden;">
                    <div @click="setProdutoCor(cor)" class="vx-col lg:w-1/12 md:w-1/12 sm:w-1/3 mr-2" v-for="(cor, index) in produto.cores" :key="index">
                        <vs-avatar :src="cor.imagemCor ? cor.imagemCor : require(`@/assets/images/rapidsoft/no-image.jpg`)" class="m-0" size="40px"/>
                    </div>
                </div>
            </div>
        </fun-modal>

        <div id="zoom-produto" v-if="this.showProdutoZoom">
            <zoom-produto @zoom-closed="hideZoom" :produtoZoom="this.produto" :produtoImagens="this.produto.corSelecionada.imagens" :id="idPopUpZoom"></zoom-produto>
        </div>
    </div>
</template>

<script>

import ZoomProduto from './ZoomProduto';

export default {
    data: () => ({
        popupCorProduto: false,
        buttonsConfig: true,
        slide: 0,
        sliding: null,
        produtoZoom:{},
        showProdutoZoom: false,
        idPopUpZoom: 'popup-produto-zoom',
    }),

    name: 'monte-look-item',
    model: {
        prop: 'produto', 
    },
    components: {
        ZoomProduto,
    },
    props: {
        produto: {
            type: Object,
            required: true,
        },
        produtoSeq: {
            type: Number,
            required: true,
        },
        disabledProdutos: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        'produto'(value) {
            if (value.referencia) this.buttonsConfig = false;
            else this.buttonsConfig = true;
        },
    },
    methods: {
        mostrarCores() {
            this.popupCorProduto = true;
            this.$emit('mostrar-cores-produto',this.produto.cores,this.produtoSeq);
        },
        showZoom() {
            this.showProdutoZoom = true;
            this.produto.corSelecionada.imagens.map((imagem) => {
                imagem.base64 = imagem.imagemCor
            })
            
            setTimeout(() => {
                this.$bvModal.show(this.idPopUpZoom)
            }, 150);
        },
        hideZoom() {
            this.produtoZoomShow = false;
        },
        mostrarProdutos() {
            this.$emit('mostrar-produtos-categorias',this.produtoSeq);
        },
        setProdutoCor(cor) {
            this.produto.corSelecionada = cor;
            this.$forceUpdate();
            this.$emit('set-cor-produto', this.produto);
        },
    },
    created(){
    }
}
</script>

<style lang='scss' scoped>
    .monte-look-item {
        z-index: 1000;
    }
    .card-img-principal {
        width: 15vh;
        -webkit-animation: rebound .4s;
        animation: rebound .4s;
        -webkit-box-pack: center !important;
        -ms-flex-pack: center !important;
        justify-content: center !important
    }
    .montelookitem-lista-produtos {
        overflow-x: scroll;
        overflow-y: hidden;
        flex-wrap: nowrap;    
    }
    .on-scroll {
        overflow-x: hidden;
        overflow-y: scroll;
    }

</style>