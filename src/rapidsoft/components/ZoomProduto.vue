
<template>
    <b-modal 
        :id="id"
        size="xl"
        @show="zoomShow"   
        @hidden="zoomClose"
        scrollable
        class="modal-content"  
        hide-footer
        >
        <template v-slot:modal-header="{ close }">
            <header class="vs-popup--header">
                <div class="vs-popup--title">
                    <h3>Produto: {{produtoZoom.referencia}} - {{produtoZoom.nome}} </h3>
                </div>
                <i class="vs-icon notranslate icon-scale vs-popup--close vs-popup--close--icon material-icons null" style="background: rgb(255, 255, 255);" @click.stop="close()">close</i>
            </header>
        </template>
        <div class="vx-row">
            <div class="vx-col w-full lg:w-1/5 sm:w-1/5">
                <div id="produto-image-gallery-zoom" class="produto-image-gallery-zoom" v-if="produtoImagens.length > 0">
                    <div class="produto-image-gallery-item" v-for="(imagem, index) in getImagensCorProduto" :key="index" @click="selectSequenciaImagemProduto(index)">
                        <img :src="imagem.base64" :id="'produto-image-gallery-item-'+imagem.id" class="mb-4 responsive img-ref">
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-4/5 sm:w-4/5">
                <div class="vx-row items-center justify-center" style="height: 1500px" id="img">
                        <!-- <img :src="imagemProdutoPrincipal" class="card-img-zoom" id="produto-swipe-area"/> -->
                        <v-zoomer style="width: 500px; height: 100%;" maxScale="3">
                            <img :src="imagemProdutoPrincipal" style="border:none" class="card-img-zoom items-center justify-center" id="produto-swipe-area"/>
                        </v-zoomer>   
                </div>
            </div>
        </div>
    </b-modal>
</template>    
<script>

import _ from 'lodash'
import Vue from 'vue'
import VueZoomer from 'vue-zoomer'

Vue.use(VueZoomer)

export default {
    name: 'zoom-produto',
    props: {
        id: {
            type: String,
            required: true,            
        },
         produtoZoom: {
            type: Object,
            required: true,
        },
        produtoImagens: {
            type: Array,
            required: true,
        }
    },
    data: () => ({
        imagemProdutoPrincipal: null,
    }),
    watch: {

    },
    components: {
        
    },
    computed: {
        getImagensCorProduto() {
            if (this.produtoImagens) {
                return this.produtoImagens
            } else {
                return [];
            }
        },
    },
    methods: {
       
        zoomClose() {
            this.$emit('zoom-closed');
        },
        zoomShow() {
            this.imagemProdutoPrincipal = this.produtoImagens[0].base64;
        },
        selectSequenciaImagemProduto(imagemSelecionada) {        
            this.imagemProdutoPrincipal = this.produtoImagens[imagemSelecionada].base64;
        },
    },
    beforeCreate() {              
    },
    created() {
    },
    mounted() {
    },
}
</script>    

<style lang="scss" scoped>

.produto-image-gallery-zoom::-webkit-scrollbar-track
{
	background-color: #fff;
}

.produto-image-gallery-zoom::-webkit-scrollbar
{
	width: 4px;
    height: 10px;
	background-color: #fff;
}

.produto-image-gallery-zoom::-webkit-scrollbar-thumb
{
	background-color: #fff;    
}

.modal-body{
    height: 100%;
}

.produto-image-gallery-zoom {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;    
}

.card-img-zoom {
    width: 100%;
    -webkit-animation: rebound .4s;
    animation: rebound .4s;
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important
}

.img-ref {
    max-height: 6rem;
    width: auto;
}

.produto-image-gallery-zoom {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;    
}

.produto-image-gallery-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin: 0 -1rem;
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
}
    
</style>