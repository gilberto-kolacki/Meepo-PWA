<template>
    <div id="page-catalogo" class="page-catalogo">
        <vs-button @click.stop="prevRef" color="primary" type="filled" radius class="btn-left" icon-pack="feather" icon="icon-chevron-left"></vs-button>
        <vs-button @click.stop="nextRef" color="primary" type="filled" radius class="btn-right" icon-pack="feather" icon="icon-chevron-right"></vs-button>
        <vs-col vs-type="block" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-row">
                
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5 h-12" style="z-index: 50;">
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
                            <div id="produto-image-gallery" class="produto-image-gallery">
                                <div class="produto-image-gallery-item" v-for="(imagem, index) in getImagensCorProduto" :key="index" @click="selectSequenciaImagemProduto(imagem)">
                                    <img :src="require(`@/assets/images/rapidsoft/produtos/${getImagemCorProduto(imagem)}`)" :id="'produto-image-gallery-item-'+imagem" class="mb-4 responsive img-ref">
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
                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.nome}.png`)" size="36px" @click="selectCorImagemProduto(index)" />
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
                <vs-col vs-type="inline-grid" vs-justify="center" vs-align="center" vs-lg="7" vs-sm="7" vs-xs="12" style="z-index: 10;">
                    <div class="vx-row items-center justify-center">
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
                            <img :src="require(`@/assets/images/rapidsoft/produtos/${imagemProdutoPrincipal}`)" class="card-img-principal" id="produto-swipe-area"/>
                        </div>
                    </Vue2InteractDraggable>
                    <div v-else>
                        <img :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="card-img-principal">
                    </div>
                    <div class="vx-row pt-2 items-center justify-center" style="display: block;" v-if="produtoB">
                        <h6 class="title-ref">{{produtoB.nome}}</h6>
                    </div>
                </vs-col>
                <div class="vx-col w-full md:w-1/5 h-12" style="z-index: 50;">
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
                                <img :src="require(`@/assets/images/rapidsoft/produtos/${getImage(tr)}`)" class="rounded mb-4 user-latest-image responsive img-popup product-img" />
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

        <b-modal 
            id="popup-produto-add" 
            v-model="popupAddProduto"
            size="xl"             
            no-close-on-backdrop                         
            hide-header>
            <!-- <vs-collapse accordion type="border" v-if="produtoAdd">
                <vs-collapse-item v-if="produtoAdd.produtoA" icon-arrow="arrow_downward" :open="true">
                    <div slot="header">                            
                        <h5><strong>Referencia A:</strong> {{produtoAdd.produtoA.referencia}} - {{produtoAdd.produtoA.nome}}</h5>
                        <h6><strong>Política:</strong></h6>
                    </div>
                    <div class="row">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered" id="table-add-produto-a">
                                <thead>
                                    <tr>
                                        <th scope="col">Cor/Tamanho</th>
                                        <th scope="col" v-for="(tamanho, indextr) in produtoAdd.produtoA.produtoAddTamanhos" :key="indextr" @click.prevent="disabledTamanho(indextr, tamanho)">
                                            <div class="flex w-full items-center justify-center">
                                                <vs-checkbox v-model="tamanho.ativo" :checked="tamanho.ativo">{{tamanho.codigo}}</vs-checkbox>
                                            </div>
                                        </th>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(cor, indexCor) in produtoAdd.produtoA.cores" :key="indexCor">
                                        <th scope="row" @click="cor.ativo = !cor.ativo">
                                            <div class="flex w-full items-center justify-center">
                                                <vs-checkbox v-model="cor.ativo"></vs-checkbox>
                                                <vs-avatar class="m-0" :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.codigo}.png`)" size="25px" @click="selectCorImagemProduto(index)" />
                                                <span class="ml-1">{{cor.codigo}}</span>                                                
                                            </div>
                                        </th>
                                        <td v-for="(tamanho, indexTamanho) in produtoAdd.produtoA.cores[indexCor].tamanhos" :key="indexTamanho">
                                            <feather-icon icon="PlusIcon" svgClasses='h-4 w-4' class="produto-add-button produto-add-button-mais" @click="maisQuantidade(produtoAdd.produtoA.cores[indexCor].tamanhos[indexTamanho])"/>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                :class="'input-tamanho-'+indexTamanho"
                                                v-model="produtoAdd.produtoA.cores[indexCor].tamanhos[indexTamanho].quantidade"
                                                :disabled="!produtoAdd.produtoA.cores[indexCor].tamanhos[indexTamanho].ativo"
                                                style="margin-top: 5px; margin-bottom: 5px; min-width: 4rem;" 
                                            />
                                            <feather-icon icon="MinusIcon" svgClasses='h-4 w-4' class="produto-add-button produto-add-button-menos" @click="menosQuantidade(produtoAdd.produtoA.cores[indexCor].tamanhos[indexTamanho])"/>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </vs-collapse-item>
                <vs-collapse-item v-if="produtoAdd.produtoA" icon-arrow="arrow_downward">
                    <div slot="header">                            
                        <h5><strong>Referencia B:</strong> {{produtoAdd.produtoA.referencia}} - {{produtoAdd.produtoA.nome}}</h5>
                        <h6><strong>Política:</strong></h6>
                    </div>
                    <div class="row">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered">
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
                                                <vs-avatar class="m-0" :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.codigo}.png`)" size="25px" @click="selectCorImagemProduto(index)" />
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
                </vs-collapse-item>
            </vs-collapse> -->

            <b-card no-body class="mb-1" v-if="produtoAdd">
                <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle.accordion-ref-a>
                    <h5><strong>Referencia A:</strong> {{produtoAdd.produtoA.referencia}} - {{produtoAdd.produtoA.nome}}</h5>
                    <h6><strong>Política:</strong></h6>
                </b-card-header>
                <b-collapse id="accordion-ref-a" visible accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <div class="row">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered">
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
                                                    <vs-avatar class="m-0" :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.codigo}.png`)" size="25px" @click="selectCorImagemProduto(index)" />
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
                <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle.accordion-ref-b>
                    <h5><strong>Referencia B:</strong> {{produtoAdd.produtoA.referencia}} - {{produtoAdd.produtoA.nome}}</h5>
                    <h6><strong>Política:</strong></h6>
                </b-card-header>
                <b-collapse id="accordion-ref-b" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <div class="row">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered">
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
                                                    <vs-avatar class="m-0" :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.codigo}.png`)" size="25px" @click="selectCorImagemProduto(index)" />
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
            </b-card>

            <template v-slot:modal-footer="{ ok, cancel, hide }">
                <vs-button class="pull-right mr-1"  size="small" color="danger" type="border" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Cancelar</vs-button>
                <vs-button class="pull-right mr-1"  size="small" color="success" type="border" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
            </template>
        </b-modal>
        
        <vs-popup class="popup-produto-zoom" fullscreen :title="'Produto: '+ produtoZoom.referencia" :active.sync="popupZoomProduto" v-if="produtoZoom">
            <div class="vx-row">
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5">
                    <div id="produto-image-gallery-zoom" class="produto-image-gallery produto-image-gallery-zoom">
                        <div class="produto-image-gallery-item" v-for="(imagem, index) in getImagensCorProduto" :key="index" @click="selectSequenciaImagemProduto(imagem)">
                            <img :src="require(`@/assets/images/rapidsoft/produtos/${getImagemCorProduto(imagem)}`)" :id="'produto-image-gallery-item-'+imagem" class="mb-4 responsive img-ref">
                        </div>
                    </div>
                </div>
                <div class="vx-col w-full lg:w-4/5 sm:w-4/5">
                    <div class="vx-row items-center justify-center">
                        <img :src="require(`@/assets/images/rapidsoft/produtos/${imagemProdutoPrincipal}`)" class="card-img-zoom" id="produto-swipe-area"/>
                    </div>
                </div>
            </div>        
        </vs-popup>
    </div>
    
    
</template>
<script>

import { Vue2InteractDraggable } from "vue2-interact";
import _ from 'lodash'
import produtoDB from '../../rapidsoft/db/produtoDb'
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
            produtoAdd: null,
            // produtoAddOpen: true,
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
        }
    },
    components: {
        Vue2InteractDraggable,
    },
    watch: {
        // 'produtoAdd' () {
        //     console.log(this.produtoAdd);
            
        // }
    },
    computed: {
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
        disabledTamanho(index, tamanho) {
            console.log(index);
            tamanho.ativo = !tamanho.ativo;
            console.log(tamanho);

            // let cores = produtoAdd.produtoA.cores;

            let linhas = document.getElementById("table-add-produto-a").getElementsByClassName("input-tamanho-"+index);
            for (let index = 0; index < linhas.length; index++) {
                const element = linhas[index];
                element.disabled = !tamanho.ativo;
            }
            // console.log(table);
            console.log(linhas);
            
            this.produtoAdd.produtoA.produtoAddTamanhos[index] = tamanho;
        },
        searchProduct(categoria) {
            categoria.check = !categoria.check;

        },
        selectCorImagemProduto(indexCor) {
            this.corSelecionada = indexCor;
            this.selectSequenciaImagemProduto('1')
        },
        selectSequenciaImagemProduto(imagemSelecionada) {        
            this.imagemProdutoPrincipal = this.getImagemCorProduto(imagemSelecionada);
        },
        getImagemCorProduto(imagem) {
            var cor = _.cloneDeep(this.produtoA.cores[this.corSelecionada]);
            if (cor.nome) {
                return this.produtoA.referencia +'_'+ cor.nome +'_'+ imagem +'.png';
            } else {
                return this.produtoA.referencia +'_'+ imagem +'.png';
            }
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
            this.produtoAdd.produtoA.produtoAddTamanhos = produtoUtils.getTamanhosProduto(this.produtoAdd.produtoA);

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
            this.popupListaProdutos = false;
            this.produtoA = produto;
            this.imagemProdutoPrincipal = this.produtoA.imagem;
            this.corSelecionada = 0;
            if(this.produtoA.tipo === 2) {
                this.produtoDown = this.produtos[1];
            }
        }
    },
    created() {
        this.produtos = produtoDB.getProdutos();
        this.categorias = produtoDB.getCategorias()
        this.categorias.forEach(categoria => {
            categoria.check = true;
        });
        this.selectProduto(this.produtos[0]);
    },
    mounted() {
        // this.selectImagemProduto('1');
    },
    
}
</script>

<style lang="scss" scoped>

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

</style>