<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full mt-4">
                <div class="vx-row flex justify-end">
                    <vs-avatar @click="produtoActiveTop = !produtoActiveTop; produtoActiveDown = false; setProdutosList(produtos[0])" class="m-0 ml-6" src="https://imagens.liveoficial.com.br/app/img/grouper/357.png" size="40px" style="border: 0.9px solid #7b7b7b;"/>
                    <vs-avatar @click="selectCorTop = !selectCorTop;" class="m-0 ml-2 mr-6" src="https://image.freepik.com/vetores-gratis/fundo-gradiente-de-papel-de-parede_1159-5356.jpg" size="40px"/>
                </div>
                <div class="vx-row mt-6 ml-2" v-if="selectCorTop">
                    <vx-card class="w-full mr-6 text-center cursor-pointer; height:100%">
                        <div class="vx-row">
                            <h6>Cores Disponíveis:</h6>
                        </div>
                        <div class="mr-2 vx-row w-full produto-image-gallery" style="height: auto;">
                            <div class="vx-col px-1 lg:w-1/12 md:w-1/12 sm:w-1/3 mr-2" v-for="(cor, index) in produtos[0].cores" :key="index">
                                <vs-avatar @click="setProdutoCorA(cor)" :src="cor.imagemCor ? cor.imagemCor : require(`@/assets/images/rapidsoft/no-image.jpg`)" class="m-0" size="40px"/>
                            </div>
                        </div>
                    </vx-card>
                </div>
                <div class="vx-row flex justify-center mt-4">
                    <div>
                        <b-img-lazy center :src="produtos[0].imagemPrincipal ? produtos[0].imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)" style="" class="card-img-principal responsive" id="produto-swipe-area"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-row mt-6 ml-2" v-if="produtoActiveTop || produtoActiveDown || acessorioActive">
            <div class="mr-2 vx-row w-full produto-image-gallery" style="height: auto;">
                <div class="vx-col px-1 lg:w-2/4 md:w-1/4 sm:w-1/3 mb-4" v-for="(produto, index) in listaProdutosCategoria[produtoActiveDown ? 1 : produtoActiveTop ? 0 : '']" :key="index" @click="produtoActiveTop ? setProduto(0,produto) : produtoActiveDown ? setProduto(1,produto) : setProduto()">
                    <vx-card class="w-full text-center cursor-pointer; height:100%;">
                        <b-card-text style="display:flex;align-items:center;justify-content:center;">
                            <b-img-lazy :src="produto.imagemPrincipal ? produto.imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)" class="rounded user-latest-image responsive img-popup product-img"/>
                        </b-card-text >
                        <b-card-text style="padding:10px">
                            <span class="vx-row" style="font-weight:bold">{{'Ref: ' + produto.referencia}}</span>
                            <span class="vx-row" style="max-width: 10ch; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{produto.nome}}</span>
                        </b-card-text>
                    </vx-card>
                </div>
            </div>
        </div>
        <!-- <div class="vx-row">
            <div class="vx-col w-full mt-4">
                <div class="vx-row flex justify-end">
                    <vs-avatar @click="produtoActiveDown = !produtoActiveDown; produtoActiveTop = false; setProdutosList(produtos[1])" class="m-0  ml-6" src="https://imagens.liveoficial.com.br/app/img/grouper/357.png" size="40px" style="border: 0.9px solid #7b7b7b;"/>
                    <vs-avatar @click="produtoActiveTop = !produtoActiveTop; produtoActiveDown = false; setProdutosList(produtos[0])" class="m-0 ml-2 mr-6" src="https://image.freepik.com/vetores-gratis/fundo-gradiente-de-papel-de-parede_1159-5356.jpg" size="40px"/>
                </div>
                <div class="vx-row flex justify-center">
                    <div>
                        <b-img-lazy center :src="produtos[1].imagemPrincipal ? produtos[1].imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)" style="" class="card-img-principal responsive" id="produto-swipe-area"/>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
// import imagemDB from '../db/imagemDB';

// import ProdutoDB from '../../rapidsoft/db/produtoDB';

export default {
    data: () => ({
        showProdutosLook: false,
        produtoActiveTop: false,
        produtoActiveDown: false,
        acessorioActive: false,
        selectCorTop: false,
        cores: [
            {imagemCor:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATEAAAClCAMAAAADOzq7AAAAA1BMVEUAAKqReXcsAAAASElEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIA/A8U6AAHe5bCKAAAAAElFTkSuQmCC',nome:'Um'},
            {imagemCor:'https://i0.wp.com/followthecolours.com.br/wp-content/uploads/2015/08/follow-the-colours-curiosidades-cor-preta-preto-10.jpg?w=960&ssl=1',nome:'Dois'}
        ],
        corSelecionadaProdutoA: {},
        produtoList: [],
    }),

    name: 'monte-look-item',
    props: {
        produtos: {
            type: Array,
            required: true,
        },
        segmento: {
            type: Number,
            required:true,
        },
        listaProdutosCategoria: {
            type: Array,
            required: true,
        }
    },
    components: {
    },
    computed: {
    },
    methods: {
        setProdutoCorA(cor) {
            this.produtos[0].imagemPrincipal = cor.imagens[0].imagemCor;
            this.produtos[0].corSelecionada = cor;
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
            this.$emit('atualiza-lista-produtos');
        }
    },
    created(){
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
        width: 30vh;
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
          