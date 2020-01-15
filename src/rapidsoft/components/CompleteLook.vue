<template>
    <div class="complete-look-itens" style="margin-bottom:40px">
        <div style="display:flex;justify-content:center;">
            <strong><h2 style="margin-top:10px;margin-bottom:20px">Complete o Look</h2></strong>
        </div>
        <!-- swiper -->
        <div class="vx-row flex justify-cente">
        <swiper :options="swiperOption" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="$vs.rtl">
            <swiper-slide v-for="(produto, indexproduto) in getProdutosLook" :key="indexproduto">
                <div class="vx-col w-full">
                    <div class="vx-row">
                        <!-- <img class="responsive" :src="produto.imagemProdutoPrincipal" alt="banner"> -->
                        <img class="responsive" src="https://imagens.liveoficial.com.br/app/img/product/500x750/95223_5168100CZ39_5.jpeg" alt="banner">
                    </div>
                    <div class="vx-row flex justify-center" style="margin-top:10px">
                        {{produto.id}}
                    </div>
                    <div class="vx-row flex justify-center">
                        Esse Produto é Novo
                    </div>
                </div>
            </swiper-slide>
            
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
            <!-- <div class="swiper-pagination" slot="pagination"></div> -->
        </swiper>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import ImagemDB from '../../rapidsoft/db/imagemDB'

export default {
    data: () => ({
        swiperOption: {
            slidesPerView: 5,
            spaceBetween: 50,
            // init: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 40
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20
                }
            }
        },
        imagemProdutoPrincipal:null
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
        swiperSlide
    },
    mounted() {
        console.log('this = ',this.produtoAdd)
        this.ProdutosLook();
    }, 
    computed: {
        
        
        getProdutosLook() {
            console.log("this.produtoAdd = ", this.produtoAdd);
            return this.produtoAdd.cores[0].produtosLook
        },
    },
    methods: {
        ProdutosLook(){
            this.produtoAdd.cores[0].produtosLook.map((itemLook) => {
                ImagemDB.getFotoPrincipal(this.produtoAdd).then((result) => {
                    itemLook.imagemProdutoPrincipal = result;
                    this.imagemProdutoPrincipal = result;
                    this.$vs.loading.close();
                })
            })
            return this.produtoAdd.cores[0].produtosLook
        },
    }

}
</script>
          