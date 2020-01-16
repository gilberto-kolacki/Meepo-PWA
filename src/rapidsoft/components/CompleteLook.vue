<template>
    <div class="complete-look-itens" style="margin-bottom:40px">

        <div id="page-catalogo-add" class="page-catalogo-add" v-if="showAddCarrinhoItem">
            <add-item-carrinho @show-add-carrinho="showAddCarrinho(false)" :produtoAdd="this.produtoLookSelecionado"></add-item-carrinho>
        </div>

        <div style="display:flex;justify-content:center;">
            <strong><h2 style="margin-top:10px;margin-bottom:20px">Complete o Look</h2></strong>
        </div>

        <div class="vx-row flex justify-cente">
            
            <swiper :options="swiperOption" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="$vs.rtl">
                
                <swiper-slide v-for="(produto, indexproduto) in getProdutosLook" :key="indexproduto">
                    
                    <div class="vx-col w-full">

                        <div class="vx-row">
                            <img class="responsive" @click="addProduto(produto.produto)" :src="produto.imagem" alt="banner">
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
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ProdutoDB from '../../rapidsoft/db/produtoDB';
// import _ from 'lodash';
import AddItemCarrinho from "../../rapidsoft/components/AddItemCarrinho";

export default {
    data: () => ({
        swiperOption: {
            slidesPerView: 5,
            spaceBetween: 50,
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
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                }
            }
        },
        produtosLook:[],
        showAddCarrinhoItem:false,
        produtoLookSelecionado:{},

    }),

    name: 'complete-look',
    props: {
        produtoAdd: {
            type: Object,
            required: true,
        }
    },
    components: {
        swiper,
        swiperSlide,
        AddItemCarrinho,
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
        },
        showAddCarrinho(show) {
            console.log("Show");
            
            this.showAddCarrinhoItem = show;
            this.produtoLookSelecionado=null;
        },
        ProdutosLook() {
            this.produtoAdd.produtosLook.map((produtoLook) => {
                ProdutoDB.getById(produtoLook).then((produto) => {
                    if (produto.existe) {
                        ProdutoDB.getImagensProduto(produto.result).then(() => {
                            this.produtosLook.push({
                                id: produtoLook,
                                produto: produto.result,
                                imagem:produto.result.cores[0].imagens[0].base64
                            });
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
          