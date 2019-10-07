<template>
    <div id="page-catalogo" class="page-catalogo" v-if="!popupAddProduto">
        <vs-button @click.stop="prevRef" color="primary" type="filled" radius class="btn-left" icon-pack="feather" icon="icon-chevron-left"></vs-button>
        <vs-button @click.stop="nextRef" color="primary" type="filled" radius class="btn-right" icon-pack="feather" icon="icon-chevron-right"></vs-button>
        <vs-col vs-type="block" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-row">
                
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5 h-12" style="z-index: 50;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="dark" type="filled" icon-pack="feather" class="w-full" icon="icon-menu" @click.stop="showSidebar"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top2">
                        <!-- <vs-divider position="left" border-style="dashed" color="primary">Imagens</vs-divider> -->
                        <vx-card>
                            <div class="vx-row items-center justify-center">
                                <h6>{{this.produtoA.cores[this.corSelecionada].nome}}</h6>
                            </div>
                            <feather-icon icon="ChevronUpIcon" class="produto-image-gallery-button produto-image-gallery-button-up" @click="scrollUp" style="margin-top: -10px" />
                            <div id="produto-image-gallery" class="produto-image-gallery" v-if="getImagensCorProduto.length > 0">
                                <div class="produto-image-gallery-item" v-for="(imagem, index) in getImagensCorProduto" :key="index" @click="selectSequenciaImagemProduto(index)">
                                    <img :src="imagem.base64" :id="'produto-image-gallery-item-'+imagem.seq" class="mb-4 responsive img-ref">
                                </div>
                            </div>
                            <div id="produto-image-gallery" class="produto-image-gallery" v-else>
                                <div class="produto-image-gallery-item">
                                    <img :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="mb-4 responsive img-ref">
                                </div>
                            </div>
                            <feather-icon icon="ChevronDownIcon" class="produto-image-gallery-button produto-image-gallery-button-down" @click="scrollDown" style="margin-bottom: -10px; margin-top: 10px" />
                        </vx-card>
                    </div>
                    <div class="vx-row items-center justify-center mt-base-top3">
                        <!-- <vs-divider position="left" border-style="dashed" color="primary">Cor</vs-divider> -->
                        <!-- <vx-card style="width: 18rem;"> -->
                            <!-- <div class="vx-row items-center justify-center"  v-for="(cor, index) in getCoresProduto" :key="index">
                                <img :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.nome}.png`)" alt="latest-upload" class="rounded mb-4 user-latest-image responsive img-cor">
                            </div> -->
                        <!-- </vx-card> -->
                        <div class="mr-2" v-for="(cor, index) in getCoresProduto" :key="index">
                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="cor.imagemCor" size="36px" @click="selectCorImagemProduto(index)" v-if="cor.imagemCor"/>
                            <vs-avatar class="m-0" size="36px" :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" v-else/>
                        </div>
                    </div>
                    <div class="vx-row items-center justify-center mt-base-top2">
                        <div class="btn-group centex w-full" v-if="this.produtoA.video">
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-youtube" @click.stop="showVideo()"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-zoom-in" @click.stop="showZoom()"></vs-button>
                        </div>
                        <vs-button color="rgb(123, 123, 123)" type="filled" icon-pack="feather" v-else class="w-full" icon="icon-zoom-in" @click.stop="showZoom()"></vs-button>
                    </div>
                </div>
                <!-- IMAGEM PRINCIPAL -->
                <vs-col id="col-img-principal" vs-type="inline-grid" vs-justify="center" vs-align="center" vs-lg="7" vs-sm="7" vs-xs="12" style="z-index: 10;" v-if="this.produtoA">
                    <div class="vx-row items-center justify-center" style="z-index: 15;">
                        <h6 class="title-ref">{{produtoA.referencia}} - {{produtoA.nome}}</h6>
                    </div>
                    <Vue2InteractDraggable
                        @draggedLeft="nextRef"
                        @draggedRight="prevRef"
                        interact-lock-y-axis
                        :interact-max-rotation="8"
                        :interact-out-of-sight-x-coordinate="1000"
                        :interact-x-threshold="120"                         
                        v-if="isShowing">
                        <div>
                            <img :src="imagemProdutoPrincipal" class="card-img-principal" id="produto-swipe-area" v-if="imagemProdutoPrincipal"/>
                            <img :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="card-img-principal" v-else>
                        </div>
                    </Vue2InteractDraggable>
                    <div v-else>
                    </div>
                    <div class="vx-row pt-2 items-center justify-center" style="display: block; z-index: 15;" v-if="produtoB">
                        <h6 class="title-ref">{{produtoB.referencia}} - {{produtoB.nome}}</h6>
                    </div>
                </vs-col>
                <div class="vx-col w-full md:w-1/5 h-12" style="z-index: 50;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="primary" type="filled" icon-pack="feather" class="w-full" icon="icon-search" @click.stop="abrirListaPodutos()"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top3">
                        <h6 class="title-ref">Ref A: {{produtoA.referencia}}</h6>
                        <div class="btn-group centex mt-base-top1 w-full">
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-shopping-cart" @click.stop="addProduto(produtoA)"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-dollar-sign" @click.stop="viewPreco(produtoA)"></vs-button>
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-book-open" @click.stop="monteSeuLook(produtoA)"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top3" v-if="produtoB">
                        <h6 class="title-ref">Ref B: {{produtoB.referencia}}</h6>
                        <div class="btn-group centex mt-base-top1 w-full">
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-shopping-cart" @click.stop="addProduto(produtoB)"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-dollar-sign" @click.stop="viewPreco(produtoB)"></vs-button>
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-book-open" @click.stop="monteSeuLook(produtoB)"></vs-button>
                        </div>
                    </div>                     
                    <div class="vx-row mt-base-top2">
                        <!-- <vs-divider position="right" border-style="dashed" color="primary">Categorias</vs-divider> -->
                        <!-- <vx-card>
                            <ul class="leftx">
                                <li v-for="(categoria, index) in categorias" :key="index" style="margin-bottom: 0.5rem;">
                                    <vs-radio v-model="filtro.categoria" :vs-value="categoria.codigo">{{categoria.nome}}</vs-radio>
                                </li>
                            </ul> -->
                            <!-- <div class="flex w-full items-center justify-center">
                                <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus" @click="abrirListaPodutos()">Lista</vs-button>
                            </div> -->
                        <!-- </vx-card> -->
                    </div>
                    <!-- <div class="vx-row">
                        <vs-divider position="right" border-style="dashed" color="primary"></vs-divider>
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="success" radius type="border" icon-pack="feather" icon="icon-shopping-cart"></vs-button>
                            <vs-button color="success" radius type="border" icon-pack="feather" icon="icon-shopping-cart"></vs-button>
                        </div>
                    </div> -->
                </div>
            </div>
        </vs-col>
        <vs-popup v-bind:class="'popup-produto-search'" title="Pesquisa" :active.sync="popupListaProdutos">
            
            <div class="flex flex-wrap-reverse items-center">
                <div v-for="(categoria, index) in getCategoriasCardPesquisa" :key="index" style="padding: 2px;">
                    <vs-button v-show="categoria.check"
                        type="filled"
                        color="primary" 
                        icon-pack="feather" 
                        size="small"
                        v-on:click.stop="searchProduct(categoria)"
                        icon="icon-check">
                        {{categoria.nome}}
                    </vs-button>
                    <vs-button v-show="!categoria.check"
                        type="border"
                        color="primary" 
                        icon-pack="feather" 
                        size="small"
                        v-on:click.stop="searchProduct(categoria)"
                        icon="icon-x">
                        {{categoria.nome}}
                    </vs-button>
                </div>
            </div>
            

            <vs-table ref="table" v-model="selectSearchProduto" @selected="selectProduto(selectSearchProduto)" search :data="getProdutosPesquisa">
                <!-- <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                </div> -->
                <template slot="thead">
                    <vs-th>Image</vs-th>
                    <vs-th sort-key="referencia">Referencia</vs-th>
                    <vs-th sort-key="nome">Nome</vs-th>
                </template>
                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].imagem">
                                <!-- <img :src="require(`@/assets/images/rapidsoft/produtos/${getImage(tr)}`)" class="rounded mb-4 user-latest-image responsive img-popup product-img" /> -->
                            </vs-td>
                            <vs-td :data="data[indextr].referencia">
                                <p class="product-name font-medium">{{ tr.referencia }}</p>
                            </vs-td>
                            <vs-td :data="data[indextr].nome">
                                <p class="product-category">{{ tr.nome }}</p>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>
            </vs-table>
        </vs-popup>        
        
        <vs-popup class="popup-produto-zoom" fullscreen :title="'Produto: '+ produtoZoom.referencia" :active.sync="popupZoomProduto" v-if="produtoZoom">
            <div class="vx-row">
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5">
                    <div id="produto-image-gallery-zoom" class="produto-image-gallery produto-image-gallery-zoom">
                        <div class="produto-image-gallery-item" v-for="(imagem, index) in getImagensCorProduto" :key="index" @click="selectSequenciaImagemProduto(index)">
                            <img :src="imagem.base64" :id="'produto-image-gallery-item-'+imagem.id" class="mb-4 responsive img-ref">
                        </div>
                    </div>
                </div>
                <div class="vx-col w-full lg:w-4/5 sm:w-4/5">
                    <div class="vx-row items-center justify-center">
                        <img :src="imagemProdutoPrincipal" class="card-img-zoom" id="produto-swipe-area"/>
                    </div>
                </div>
            </div>        
        </vs-popup>
    </div>
    <div id="page-catalogo-add" class="page-catalogo-add" v-else>
        <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle.accordion-ref-a>
            <h5><strong>Referencia A:</strong> {{produtoAdd.produtoA.referencia}} - {{produtoAdd.produtoA.nome}}</h5>
            <h6><strong>Política:</strong></h6>
        </b-card-header>
        <b-collapse id="accordion-ref-a" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
                <div class="row">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered" id="table-add-produto-a">
                            <thead>
                                <tr>
                                    <th scope="col">Cor/Tamanho</th>
                                    <th scope="col" style="text-align: center;" v-for="(tamanho, indexTr) in getTamanhosProdutoA" :key="indexTr">
                                        <div class="flex w-full items-center justify-center">
                                            <!-- <vs-checkbox :id="'tamanho-check-2-'+tamanho.codigo" v-model="tamanho.ativo" @input="disabledCorTamanho(produtoAdd.produtoA, tamanho, 2)"></vs-checkbox> -->
                                            <b-form-checkbox :id="'tamanho-check-'+tamanho.codigo" v-model="tamanho.ativo" @input="disabledCorTamanho(produtoAdd.produtoA, tamanho, 2)"></b-form-checkbox>
                                            {{tamanho.codigo}}
                                        </div>
                                    </th>
                                    <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(cor, indexCor) in getCoresProdutoA" :key="indexCor">
                                    <th scope="row">
                                        <div class="flex w-full items-center justify-center">
                                            <!-- <vs-checkbox v-model="cor.ativo"></vs-checkbox> -->
                                            <b-form-checkbox :id="'cor-check-'+cor.codigo" v-model="cor.ativo" @input="disabledCorTamanho(produtoAdd.produtoA, cor, 1)"></b-form-checkbox>
                                            <vs-avatar class="m-0" :src="cor.imagemCor" size="25px"/>
                                            <span class="ml-1">{{cor.codigo}}</span>                                                
                                        </div>
                                    </th>
                                    <td v-for="(tamanho, indexTamanho) in getTamanhosProdutoA" :key="indexTamanho">
                                        <div v-if="produtoAdd.produtoA.cores[indexCor].tamanhos[indexTamanho].ativo && tamanho.ativo">
                                            <input type="number" :class="'input-quantidade-tam-'+tamanho.codigo+ ' input-quantidade-cor-'+cor.codigo " v-model="produtoAdd.produtoA.cores[indexCor].tamanhos[indexTamanho].quantidade" class="form-control" style="margin-top: 0rem; min-width: 5rem;">
                                            <div class="produto-add-button2">
                                                <feather-icon icon="MinusIcon" svgClasses='h-4 w-4' class="produto-add-button-menos2" />
                                                <feather-icon icon="PlusIcon" svgClasses='h-4 w-4' class="produto-add-button-mais2" />
                                            </div>
                                        </div>
                                        <div v-else>
                                            <input type="number" class="form-control" placeholder="Inativado" disabled style="margin-top: 0.6rem; min-width: 5rem;">
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </b-card-body>
        </b-collapse>
        <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle.accordion-ref-b v-if="produtoAdd.produtoB">
            <h5><strong>Referencia B:</strong> {{produtoAdd.produtoA.referencia}} - {{produtoAdd.produtoA.nome}}</h5>
            <h6><strong>Política:</strong></h6>
        </b-card-header>
        <b-collapse id="accordion-ref-b" accordion="my-accordion" role="tabpanel">
            <b-card-body>
                <div class="row">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered" id="table-add-produto-b">
                            <thead>
                                <tr>
                                    <th scope="col">Cor/Tamanho</th>
                                    <th scope="col" style="text-align: center;" v-for="(tamanho, indextr) in produtoAdd.produtoA.produtoAddTamanhos" :key="indextr">
                                        <div class="flex w-full items-center justify-center">
                                            <vs-checkbox v-model="tamanho.ativo"></vs-checkbox>
                                            {{tamanho.codigo}}
                                        </div>
                                    </th>
                                    <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(cor, indexCor) in produtoAdd.produtoA.produtoAddCores" :key="indexCor">
                                    <th scope="row" @click="cor.ativo = !cor.ativo">
                                        <div class="flex w-full items-center justify-center">
                                            <vs-checkbox v-model="cor.ativo"></vs-checkbox>
                                            <vs-avatar class="m-0" :src="cor.imagemCor" size="25px" @click="selectCorImagemProduto(index)" />
                                            <span class="ml-1">{{cor.codigo}}</span>                                                
                                        </div>
                                    </th>
                                    <td v-for="(tamanho, indextr) in produtoAdd.produtoA.produtoAddTamanhos" :key="indextr">
                                        <input type="number" class="form-control" style="margin-top: -6px; min-width: 5rem;">
                                        <div class="produto-add-button2">
                                            <feather-icon icon="MinusIcon" svgClasses='h-4 w-4' class="produto-add-button-menos2" />
                                            <feather-icon icon="PlusIcon" svgClasses='h-4 w-4' class="produto-add-button-mais2" />
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </b-card-body>
        </b-collapse>
        <div style="margin-top: 1rem;">
            <vs-button class="pull-right mr-1"  size="small" color="success" type="border" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
            <vs-button class="pull-right mr-1"  size="small" color="danger" type="border" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Cancelar</vs-button>
        </div>
    </div>
</template>
<script>

import { Vue2InteractDraggable } from "vue2-interact";
import _ from 'lodash'
import produtoDB from '../../rapidsoft/db/produtoDB'
import produtoUtils from '../../rapidsoft/utils/produtoUtils'
import { setTimeout } from 'timers';

export default {

    data() {
        return {
            imagemProdutoPrincipal: null,
            produtoA: null,
            produtoB: null,
            categorias: [],
            popupListaProdutos: false,
            selectSearchProduto: null,
            popupAddProduto: false,
            // produtoAdd: null,
            produtoAdd: {
                produtoA: {
                    cores:[]
                },
                produtoB: {
                    cores:[]
                }
            },
            produtoAddOpen: false,
            filtro:{
                categoria: 0
            },
            corSelecionada: 0,
            imagens: [],
            produtos: [],
            produtosFiltro: [],
            isShowing: true,
            produtoZoom: null,
            popupZoomProduto: false,
            disabledInputCor: [],
            disabledInputTamanho: [],
        }
    },
    components: {
        Vue2InteractDraggable,
    },
    watch: {
        // 'tamanho.ativo' () {
        //     console.log(this.produtoAdd.produtoA.produtoAddCores[0]);
        // }
    },
    computed: {
        getCoresProdutoA() {
            return this.produtoAdd.produtoA.produtoAddCores;
        },
        getTamanhosProdutoA() {
            return this.produtoAdd.produtoA.produtoAddCores[0].produtoAddTamanhos;
        },
        getProdutosPesquisa() {
            return this.produtos.filter((produto) => {
                return this.getCategoriasCardPesquisa.some((categoria) => {
                    return categoria.check && produto.hasOwnProperty('categoria') && produto.categoria.hasOwnProperty('codigo') && produto.categoria.codigo == categoria.codigo;
                });
            });
        },
        getCategoriasCardPesquisa() {
            return this.categorias.filter((categoria) => {
                return categoria.codigo != 0;
            });
        },
        getImagensCorProduto() {
            if (this.produtoA) {
                return this.produtoA.cores[this.corSelecionada].imagens
            } else {
                return [];
            }
        },        
        getCoresProduto() {
            if (this.produtoA) {
                return this.produtoA.cores
            } else {
                return [];
            }
        },        
    },
    methods: {
        maisQuantidade(tamanho) {
            tamanho.quantidade = tamanho.quantidade+1;
        },
        viewPreco(produto) {
            this.$vs.notify({
                title:'REF: '+produto.referencia,
                text:'R$ '+ produto.preco,
                color:'dark',
                time: 4000,
                iconPack: 'feather',
                icon:'icon-dollar-sign'
            })
        },
        disabledInputCorTamanho(indexCor, indexTamanho) {
            if (this.disabledInputCor.length == 0 && this.disabledInputTamanho.length == 0) return false;
            if (this.disabledInputCor[indexCor].disabled || this.disabledInputTamanho[indexTamanho].disabled) {
                return true;
            } else {
                return false;
            }
        },
        // 1- cor, 2- tamanho
        disabledCorTamanho(produto, corTamanho, tipo) {
            console.log('evento');
            console.log(corTamanho);
            
            // let linhas = [];
            // if (tipo === 1) {
            //     linhas = document.getElementById("table-add-produto-a").getElementsByClassName("input-cor-"+index);
            // } else {
            //     linhas = document.getElementById("table-add-produto-a").getElementsByClassName("input-tamanho-"+index);
            // }
            // for (let index = 0; index < linhas.length; index++) {
            //     const element = linhas[index];
            //     element.disabled = !corTamanho.ativo;
            // }
            // this.produtoAdd.produtoA.produtoAddTamanhos[index] = corTamanho;
            // produto.produtoAddCores.forEach(cor => {
            //     if ((tipo === 1 && cor.codigo == corTamanho.codigo) || tipo === 2) {
            //         if (tipo === 1) cor.ativo = corTamanho.ativo;
            //         console.log(tipo);                
            //         console.log(cor);                
            //         cor.produtoAddTamanhos.forEach(tamanho => {
            //             if (tipo === 2 && tamanho.codigo === corTamanho.codigo) {
            //                 tamanho.ativo = corTamanho.ativo;
            //             } else {
            //                 tamanho.ativo = corTamanho.ativo;
            //             }
            //         });

            //         produto.produtoAddCores.splice();
            //     }
            // });

            let produtoAddCoresNew = _.clone(produto.produtoAddCores);
            for (let indexCor = 0; indexCor < produtoAddCoresNew.length; indexCor++) {
                let cor = produtoAddCoresNew[indexCor];
                if (tipo === 1) cor.ativo = corTamanho.ativo;

                for (let indexTamanho = 0; indexTamanho < cor.produtoAddTamanhos.length; indexTamanho++) {
                    let tamanho = cor.produtoAddTamanhos[indexTamanho];
                    if (tipo === 2) {
                        // if (tamanho.codigo === corTamanho.codigo) produtoAddCoresNew[indexCor].produtoAddTamanhos[indexTamanho].ativo = corTamanho.ativo;
                        if (tamanho.codigo === corTamanho.codigo) {
                            // this.$set(this.produtoAdd.produtoA.produtoAddCores[indexCor].produtoAddTamanhos, indexTamanho, corTamanho);
                            let linhas = document.getElementById("table-add-produto-a").getElementsByClassName("input-quantidade-tam-"+tamanho.codigo);
                            for (let index = 0; index < linhas.length; index++) {
                                linhas[index].disabled = !corTamanho.ativo;
                            }             
                        } 
                        else continue;
                    } else {
                        // this.$set(this.produtoAdd.produtoA.produtoAddCores[indexCor].produtoAddTamanhos, indexTamanho, corTamanho)
                        let linhas = document.getElementById("table-add-produto-a").getElementsByClassName("input-quantidade-cor-"+corTamanho.codigo);
                        for (let index = 0; index < linhas.length; index++) {
                            linhas[index].disabled = !corTamanho.ativo;
                        } 
                    }
                }
            }
            // this.$set(this.produtoAdd, "produtoA", produto.produtoAddCores);
            console.log(this.produtoAdd.produtoA.produtoAddCores);
        },
        searchProduct(categoria) {
            categoria.check = !categoria.check;

        },
        selectCorImagemProduto(indexCor) {
            this.corSelecionada = indexCor;
            this.selectSequenciaImagemProduto(0);
        },
        selectSequenciaImagemProduto(imagemSelecionada) {        
            this.imagemProdutoPrincipal = this.getImagemCorProduto(imagemSelecionada);
        },
        getImagemCorProduto(imagem) {
            var cor = _.cloneDeep(this.produtoA.cores[this.corSelecionada]);
            console.log(cor.imagens);
            
            return cor.imagens[imagem].base64;
        },
        scrollUp() {
            let gallery = document.getElementById("produto-image-gallery");
            gallery.scrollTop = gallery.scrollTop - 80;
        },
        scrollDown() {
            let gallery = document.getElementById("produto-image-gallery");
            gallery.scrollTop = gallery.scrollTop + 80;
        },
        hideCard() {
            setTimeout(() => {
                this.isShowing = false;
            }, 100);
            setTimeout(() => {
                this.isShowing = true;
            }, 100);
        },
        prevRef() {
            let anterior = this.produtos.indexOf(this.produtoA)-1;
            if (anterior >= 0) {
                this.selectProduto(this.produtos[this.produtos.indexOf(this.produtoA)-1]);
            } else {
                this.selectProduto(this.produtos[this.produtos.length-1]);
            }
            document.getElementById("produto-image-gallery").scrollTop = 0;
            this.corSelecionada = 0;
            this.hideCard();
        },
        nextRef() {
            let proxima = this.produtos.indexOf(this.produtoA)+1;
            if (proxima < this.produtos.length) {
                this.selectProduto(this.produtos[this.produtos.indexOf(this.produtoA)+1]);
            } else {
                this.selectProduto(this.produtos[0]);
            }
            document.getElementById("produto-image-gallery").scrollTop = 0;
            this.corSelecionada = 0;
            this.hideCard();
        },
        showSidebar() {
            return this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
        showZoom() {
            this.popupZoomProduto = true;
            this.produtoZoom = this.produtoA;
        },
        showVideo() {

        },
        getProdutoNome(produto) {
            return produto.referencia +"-"+ produto.nome;
        },
		getImage(produto) {
			return produto.imagem;
        },
        abrirListaPodutos() {
            this.popupListaProdutos=true
            this.selectSearchProduto = null;
        },
        addProduto(produto) {
            this.produtoAdd = {};
            this.produtoAdd.produtoA = _.cloneDeep(produto);
            this.produtoAdd.produtoA.produtoAddCores = produtoUtils.getCoresProduto(this.produtoAdd.produtoA);
            this.produtoAdd.produtoA.produtoAddCores.forEach(cor => {
                cor.produtoAddTamanhos = produtoUtils.getTamanhosProduto(this.produtoAdd.produtoA);
            });

            // document.getElementById("popup-produto-add").style.display = null;
            this.popupAddProduto = true;
        },
        cancelarAdd() {
            // _.defer(() => document.getElementById("popup-produto-add").style.display = "none", 'deferred');
            this.popupAddProduto = false;
            this.produtoAdd=null;
        },
        addReferenciaCarrinho() {
            console.log(this.produtoAdd);
        },
        monteSeuLook() {

        },
        selectProduto(produto) {
            this.$vs.loading();
            produtoDB.getImagensProduto(produto).then((result) => {
                this.popupListaProdutos = false;
                this.produtoA = result;
                this.imagemProdutoPrincipal = this.produtoA.cores[0].imagens.length > 0 ? this.produtoA.cores[0].imagens[0].base64 : null ;
                this.corSelecionada = 0;
                if(this.produtoA.tipo === 2) {
                    this.produtoDown = this.produtos[1];
                }
                this.$vs.loading.close();
            })
            
        },
    },
    beforeCreate() {
        this.$vs.loading();
        produtoDB.getProdutosCatalogo().then(result => {
            this.produtos = result;
            this.categorias = produtoDB.getCategorias()
            this.categorias.forEach(categoria => {
                categoria.check = true;
            });
            this.selectProduto(this.produtos[0]);
            this.$vs.loading.close();
        });
    },
    created() {
        console.log('created');
    },
    beforeMount() {
        console.log('beforeMount');
    },
    mounted() {
        console.log('mounted');
        
        document.getElementById("page-catalogo").ontouchmove = (e) => {
            if(!(e.target.className == "produto-image-gallery-item" || e.target.className == "mb-4 responsive img-ref")) {
                e.preventDefault();
            }
        }
    },
    
}
</script>

<style lang="scss" scoped>

html {
  position: fixed;
  width: 100%; 
  height: 100%
}

// .page-catalogo{
//   -webkit-overflow-scrolling: touch;
// }

.mt-base-bottom {
    margin-bottom: 2rem !important
}

.mt-base-top3 {
    margin-top: 2rem !important
}

.mt-base-top2 {
    margin-top: 1.2rem !important
}
.mt-base-top1 {
    margin-top: 0.6rem !important
}

.vs-divider--text {
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    white-space: nowrap;
    background: #fff0;
    padding-left: 12px;
    padding-right: 12px;
    font-size: .9375em;
}

.img-ref {
    max-height: 6rem;
    width: auto;
    /* max-width: 10rem; */
    
}

.img-cor {
    max-height: 4rem;
    max-width: 6rem;
}

.card-img-principal {
    width: 40vh;
    -webkit-animation: rebound .4s;
    animation: rebound .4s;
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important
}

@media only screen and (min-width: 992px) {
    .card-img-principal {
        max-width: 40vh;
    }
}

.card-img-zoom {
    width: 100%;
    -webkit-animation: rebound .4s;
    animation: rebound .4s;
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important
}

.img-popup {
    max-height: 7rem;
    max-width: 4rem;
}

.btn-left{
    position: fixed;
    top:50%;
    left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    z-index: 1000;

    .vs-icon{
        animation: spin 1.5s linear infinite;
    }
}

.btn-right {
    position: fixed;
    top:50%;
    right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 1000;

    .vs-icon{
        animation: spin 1.5s linear infinite;
    }
}

.title-ref {
    text-transform: uppercase;
}
.produto-image-gallery {
    height: 32vh;
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

    .selected {
        border-radius: 2%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border-bottom: 2px solid #e41c40;
    }
}

.produto-image-gallery::-webkit-scrollbar-track
{
	background-color: #fff;
}

.produto-image-gallery::-webkit-scrollbar
{
	width: 4px;
    height: 10px;
	background-color: #fff;
}

.produto-image-gallery::-webkit-scrollbar-thumb
{
	background-color: #fff;    
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

.produto-image-gallery-zoom {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;    
}

.header-colapse-add {
    background-color: #403e3e;
    color: #fff;
}

.produto-add-button {
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
    border-radius: .2rem !important;
}

.produto-add-button-mais {
    color: #28a745;
}

.produto-add-button-menos {
    color: #dc3545;
}

.produto-add-button2 {
    margin-top: 3px;
    margin-bottom: -10px;
}

.produto-add-button-mais2 {
    background-color: #fff;
    width: 50% !important;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;        
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    border-radius: .2rem !important;
    border: 0.9px solid #808992;
    // border-right: 1px solid #080808;
    // border-left: 1px solid #080808;
    color: #28a745;
}

.produto-add-button-menos2 {
    background-color: #fff;
    width: 50% !important;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;        
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    border-radius: .2rem !important;
    border: 0.9px solid #808992;
    // border-right: 1px solid #080808;
    // border-left: 1px solid #080808;
    color: #dc3545;
}

.page-catalogo {
    top: 2rem;
}


</style>
<style lang="scss">

.popup-produto-search .vs-popup {
    right: 0;
    height: 100%;
    width: 60%;        
}

.popup-produto-search .vs-table--search  {
    justify-content: center;
    max-width: 100%;
    position: relative;
    margin-left: auto;

    .input-search {
        width: 100vw;
    }
}

.popup-produto-add {
    z-index: 60000;
}

.modal-xl {
    max-width: 1024px;
    width: 100%;
    margin: 0.3rem 0.0rem 0.3rem 0.0rem;
    z-index: 60000;
}

.modal-content {
    border-radius: 10px;
    align-content: center;
    justify-content: center;
}

.modal {
    z-index: 53000;
}

.card-body {
    padding-left: 1.2rem;
    padding-right: 1.2rem;
    padding-top: 0.1rem;
    padding-bottom: 0.0rem;
}

.custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: #e41c40;
    background-color: #e41c40;
}

</style>