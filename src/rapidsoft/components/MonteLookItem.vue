<template>
    <div class="parentx on-scroll">
        <div class="vx-row mt-4">
            <div class="vx-col w-full mr-6">
                <!-- <vx-card> -->
                <div class="vx-row flex justify-center mt-4">
                    <div>
                        <b-img-lazy center :src="produto.imagemPrincipal ? produto.imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)" style="" class="card-img-principal responsive" id="produto-swipe-area"/>
                    </div>
                </div>
                <div class="vx-row flex justify-center mt-4 ">
                    <vs-button @click="mostrarCores()" color="primary" type="filled" class="customizer-btn ml-3 w-1/4" icon-pack="feather" icon="icon-settings">Cor</vs-button>
                    <vs-button @click="mostrarProdutos()" color="primary" type="filled" class="customizer-btn ml-3 w-1/4" icon-pack="feather" icon="icon-list">Produtos</vs-button>
                </div>
                <!-- </vx-card> -->
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data: () => ({
        produtoList: [],
        selectCorAcessorio: []
    }),

    name: 'monte-look-item',
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
            this.$emit('mostrar-cores-produto',this.produtoSeq);
        },
        mostrarProdutos() {
            this.$emit('mostrar-produtos-categorias',this.produto.cores,this.produtoSeq);
        },
        setProdutoCor(cor,pos) {
            this.produtos[pos].imagemPrincipal = cor.imagens[0].imagemCor;
            this.produtos[pos].corSelecionada = cor;
            this.$forceUpdate();
        },
        setProduto(pos,produto) {
            this.produtos[pos] = produto;
            this.produtos[pos].corSelecionada = this.produtos[pos].cores[0];
            this.$emit('atualiza-produtos',this.produtos,pos);
            this.$forceUpdate();
        },
        setProdutosList(produto) {
            this.produtoList = produto.listaProdutosCategoria;
            this.$emit('cores-disponiveis');
        }
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
        width: 22vh;
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
          