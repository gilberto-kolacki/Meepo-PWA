<template>
    <div v-if="showProdutosLook && getProdutosLook.length > 0">
        <strong class="flex justify-center" style="margin-top:20px" ><h2>Complete o Look:</h2></strong>
        
        <div class="complete-look-itens flex justify-center" style="margin-bottom:40px">

            <div class="vx-row flex justify-center" style="width:90%">
                
                <swiper :options="swiperOption" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="$vs.rtl">
                    
                    <swiper-slide v-for="(produto, indexproduto) in getProdutosLook" :key="indexproduto">
                        
                        <div class="vx-col w-full">

                            <div class="vx-row flex justify-center">
                                <img class=" responsive" style="max-width:80px" @click="addProduto(produto.produto)" :src="produto.imagem" alt="banner">
                            </div>

                            <div class="vx-row flex justify-center"  style="margin-top:10px;">
                                <p class="flex justify-center" style="text-align:center ;max-width:150px;font-weight:bold;">
                                    {{"Ref: " + produto.id}}
                                </p>
                            </div>

                            <div class="vx-row flex justify-center">
                                <p class="flex justify-center" style="align-items: stretch;text-align:center ;max-width:150px;font-weight:bold;">{{produto.produto.nome}}</p>
                            </div>

                        </div>

                    </swiper-slide>
                    
                    <div class="swiper-button-prev" slot="button-prev"></div>
                    <div class="swiper-button-next" slot="button-next"></div>

                </swiper>

            </div>
        </div>
    </div>
</template>

<script>

import 'swiper/dist/css/swiper.min.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ProdutoDB from '../../rapidsoft/db/produtoDB';
// import _ from 'lodash';
// import AddItemCarrinho from "../../rapidsoft/components/AddItemCarrinho";

export default {
    data: () => ({
        swiperOption: {
            slidesPerView: 5,
            spaceBetween: 20,
            // init: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 40,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                }
            }
        },
        produtosLook:[],
        showAddCarrinhoItem:false,
        produtoLookSelecionado:{},
        showProdutosLook: false,

    }),

    name: 'complete-look',
    props: {
        produtoA: {
            type: Object,
            required: true,
        }
    },
    components: {
        swiper,
        swiperSlide,
        // AddItemCarrinho,
    },
    mounted() {
        this.ProdutosLook();
    }, 
    computed: {
        
        getProdutosLook() {
            return this.produtosLook;
        },
    },
    methods: {

        addProduto(produto) {
            this.produtoLookSelecionado = {
                produtoA: produto,
            };
            this.showAddCarrinhoItem = true;
            this.$emit('produto-look',this.produtoLookSelecionado);
        },
        showAddCarrinho(show) {
            this.showAddCarrinhoItem = show;
            this.produtoLookSelecionado=null;
        },
        ProdutosLook() {
            this.produtoA.produtosLook.map((produtoLook) => {
                ProdutoDB.getById(produtoLook).then((produto) => {
                    if (produto.existe) {
                        ProdutoDB.getImagensProduto(produto.result).then(() => {
                            this.produtosLook.push({
                                id: produtoLook,
                                produto: produto.result,
                                imagem:produto.result.cores[0].imagens[0].base64
                            });
                            setTimeout(() => {
                                this.showProdutosLook = true;
                            }, 500)
                        });
                    }
                });
            });
            
            return this.produtosLook;
        },
        mounted() {
            this.carrinho = Storage.getCarrinho();
        }
    },
}
</script>
          