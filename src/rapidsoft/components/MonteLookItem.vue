<template>
    <div class="parentx on-scroll">
        <div class="vx-row mt-4">
            <div class="vx-col w-full mr-6">
                <!-- <vx-card> --> 
                <div class="vx-row flex justify-center mt-4">
                    <div>
                        <b-img-lazy center :src="produto.corSelecionada ? produto.corSelecionada.imagens[0].imagemCor : require(`@/assets/images/rapidsoft/no-image.jpg`)" style="" class="card-img-principal responsive" id="produto-swipe-area"/>
                    </div>
                </div>
                <div class="vx-row flex justify-center mt-4 ">
                    <vs-button @click="mostrarProdutos()" color="primary" type="filled" class="customizer-btn ml-3 w-1/4" icon-pack="feather" icon="icon-list">Produtos</vs-button>
                    <vs-button @click="mostrarCores()" color="primary" type="filled" class="customizer-btn ml-3 w-1/4" icon-pack="feather" icon="icon-settings">Cor</vs-button>
                </div>
                <!-- </vx-card> -->
            </div>
        </div>

        <vs-popup title="Cores Disponíveis" :active.sync="popupCorProduto" :button-close-hidden="false">
            <div class="vx-row flex">
                <div class="vx-row w-full produto-image-gallery p-5" style="height: auto;">
                    <div @click="setProdutoCor(cor)" class="vx-col lg:w-1/12 md:w-1/12 sm:w-1/3 mr-2" v-for="(cor, index) in produto.cores" :key="index">
                        <vs-avatar :src="cor.imagemCor ? cor.imagemCor : require(`@/assets/images/rapidsoft/no-image.jpg`)" class="m-0" size="40px"/>
                    </div>
                </div>
            </div>
        </vs-popup>

    </div>
</template>

<script>

export default {
    data: () => ({
        popupCorProduto: false,
    }),

    name: 'monte-look-item',
    model: {
        prop: 'produto', 
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
    },
    methods: {
        mostrarCores() {
            this.popupCorProduto = true;
            // this.$emit('mostrar-cores-produto',this.produto.cores,this.produtoSeq);
        },
        mostrarProdutos() {
            console.log(`this.produtoSeq sdsdsd `,this.produtoSeq);
            
            this.$emit('mostrar-produtos-categorias',this.produtoSeq);
        },
        setProdutoCor(cor) {
            this.produto.corSelecionada = cor;
            this.$forceUpdate();
            this.$emit('set-cor-produto',this.produto);
        },
    },
    created(){
        console.log(this.listaProdutosCategoria);
    }
}
</script>

<style lang='scss' scoped>

    .btn-produto{
        position: fixed;
        bottom: 5%;
        right: 8vw;
        z-index: 1000;
        width: 60px !important;
        height: 60px !important;
        border-radius: 50%;
        
        .vs-icon{        
            color: inherit;
            text-align: center;
            font-size: 30px;
        }
    }
    .card-img-principal {
        width: 15vh;
        -webkit-animation: rebound .4s;
        animation: rebound .4s;
        -webkit-box-pack: center !important;
        -ms-flex-pack: center !important;
        justify-content: center !important
    }
    .produto-image-gallery {
        overflow-x: scroll;
        overflow-y: hidden;
        flex-wrap: nowrap;    
    }
    .on-scroll {
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .produto-image-gallery-button {
    width: 100% !important;
    cursor: pointer;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;        
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    border-radius: .5rem !important;
    background-color: #fff;
}

.produto-image-gallery-button-up {
    margin-bottom: 10px;
}
</style>
          