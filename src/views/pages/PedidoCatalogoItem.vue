<template>
    <div id="page-catalogo" class="page-catalogo" v-if="!popupAddProduto">
        <div v-if="this.produtoA">
            <vs-button @click.stop="prevRef" color="primary" type="filled" radius class="btn-left" icon-pack="feather" icon="icon-chevron-left"></vs-button>
            <vs-button @click.stop="nextRef" color="primary" type="filled" radius class="btn-right" icon-pack="feather" icon="icon-chevron-right"></vs-button>
        </div>
        <vs-col vs-type="block" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-row">
                
                <div class="vx-col w-full lg:w-1/5 sm:w-1/5 h-12" style="z-index: 50;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="dark" type="filled" icon-pack="feather" class="w-full" icon="icon-menu" @click.stop="showSidebar"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top2">
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
                        <div class="mr-2" v-for="(cor, index) in getCoresProduto" :key="index">
                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="cor.imagemCor" size="36px" @click="selectCorImagemProduto(index)" v-if="cor.imagemCor" style="border: 0.9px solid #7b7b7b;"/>
                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" size="36px" @click="selectCorImagemProduto(index)" style="border: 0.9px solid #7b7b7b;" v-else/>
                        </div>
                    </div>
                    <div class="vx-row items-center justify-center mt-base-top2">
                        <div class="btn-group centex w-full" >
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-youtube" @click.stop="showVideo()" v-if="this.produtoA.video && false"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-zoom-in" @click.stop="showZoom()"></vs-button>
                        </div>
                    </div>
                </div>
                <!-- IMAGEM PRINCIPAL -->
                <div class="vx-col w-full lg:w-3/5 sm:w-3/5 h-12" style="z-index: 10;" v-if="this.produtoA">
                    <div class="vx-row items-center justify-center" style="z-index: 15; margin-bottom: 2rem;">
                        <h6 class="title-ref">{{produtoA.referencia}} - {{produtoA.nome}}</h6>
                    </div>
                    <Vue2InteractDraggable
                        class="vx-row items-center justify-center"
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
                    <div class="vx-row items-center justify-center" style="z-index: 15; margin-top: 2rem;" v-if="this.produtoB">
                        <h6 class="title-ref">{{produtoB.referencia}} - {{produtoB.nome}}</h6>
                    </div>
                </div>
                <div class="vx-col w-full md:w-1/5 h-12" style="z-index: 50;" v-if="this.produtoA">
                    <div class="vx-row">
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="primary" type="filled" icon-pack="feather" class="w-full" icon="icon-search" @click.stop="abrirPesquisaPodutos()"></vs-button>
                        </div>
                    </div>
                    <div class="vx-row mt-base-top3">
                        <h6 class="title-ref" v-if="this.produtoA">Ref A: {{produtoA.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoB">Ref B: {{produtoB.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoC">Ref C: {{produtoC.referencia}}</h6>
                        <h6 class="title-ref" v-if="this.produtoD">Ref D: {{produtoD.referencia}}</h6>
                        <div class="btn-group centex mt-base-top1 w-full">
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-shopping-cart" @click.stop="addProduto()"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-dollar-sign" @click.stop="viewPreco(produtoA)"></vs-button>
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-book-open" @click.stop="monteSeuLook(produtoA)"></vs-button>
                        </div>
                    </div>
                    <!-- <div class="vx-row mt-base-top3" v-if="produtoB">
                        <h6 class="title-ref">Ref B: {{produtoB.referencia}}</h6>
                        <div class="btn-group centex mt-base-top1 w-full">
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-shopping-cart" @click.stop="addProduto(produtoB)"></vs-button>
                            <vs-button class="w-full" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-dollar-sign" @click.stop="viewPreco(produtoB)"></vs-button>
                            <vs-button class="w-full" color="primary" icon-pack="feather" icon="icon-book-open" @click.stop="monteSeuLook(produtoB)"></vs-button>
                        </div>
                    </div>                      -->
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

            
            <!-- <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-select
                        class="vx-col w-full mb-2"
                        label="Segmentos"
                        v-model="segmentoSelecionado" @change="searchCategorias()">
                        <vs-select-item :key="index" :value="item.id" :text="item.nome" v-for="(item,index) in getSegmentosSearch" />
                    </vs-select>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-select
                        class="vx-col w-full mb-2"
                        label="Categorias"
                        v-model="categoriaSelecionada" >
                        <vs-select-item :key="index" :value="item.id" :text="item.nome" v-for="(item,index) in getCategoriasSearch" />
                    </vs-select>
                </div>
            </div> -->
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full">
                    <vs-input v-validate="'required'" label="Pesquisar" v-model="textoSearch" class="w-full" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <label for="segmentoFiltro" class="vs-input--label">Segmentos</label>
                    <v-select id="segmentoFiltro" name="segmento" v-model="segmentoSelecionado" label="nome" :options="getSegmentosSearch"/>
                </div>
            </div>
            <div class="vx-col w-full mb-2">
                <label for="categoriaFiltro" class="vs-input--label">Categorias</label>
                <v-select multiple id="categoriaFiltro" name="segmento" v-model="categoriasSelecionadas" label="nome" :options="getCategoriasSearch"/>
            </div>
            
            <!-- <div class="flex flex-wrap-reverse items-center">
                <div v-for="(categoria, index) in getCategoriasCardPesquisa" :key="index" style="padding: 1.5px;" class="items-center justify-center">
                    <b-button
                        squared 
                        
                        v-bind:variant="categoria.check ? 'danger' : 'outline-danger'"
                        class="w-full"
                        v-on:click="searchProduct(categoria)">
                        <small class="flex cursor-pointer">
                            <feather-icon :icon="categoria.check ? 'CheckIcon' : 'XIcon'" svgClasses='h-4 w-4'></feather-icon>
                            {{categoria.nome}}
                        </small>
                    </b-button>
                </div>
            </div> -->
            

            <vs-table ref="table" v-model="produtoSearch" @selected="selectSearchProduto(produtoSearch)" :data="listaProdutosPesquisa">
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
                            <vs-td :data="data[indextr].imagemPrincipal">
                                <img :src="data[indextr].imagemPrincipal" class="rounded mb-4 user-latest-image responsive img-popup product-img" v-if="data[indextr].imagemPrincipal"/>
                                <img :src="require(`@/assets/images/rapidsoft/no-image.jpg`)" class="rounded mb-4 user-latest-image responsive img-popup product-img" v-else />
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
    <!-- Adicao de itens -->
    <div id="page-catalogo-add" class="page-catalogo-add" v-else>
        <add-item-carrinho idColapse="accordion-ref-a" :toggle="true" :title="'Referencia A: '+produtoAdd.produtoA.referencia +''+ produtoAdd.produtoA.nome" :produtoAdd="this.produtoAdd.produtoA"></add-item-carrinho>
        <add-item-carrinho idColapse="accordion-ref-b" :toggle="false" :title="'Referencia B: '+produtoAdd.produtoB.referencia +''+ produtoAdd.produtoB.nome" :produtoAdd="this.produtoAdd.produtoB"></add-item-carrinho>
        <div style="margin-top: 1rem;">
            <vs-button class="pull-right mr-1"  size="small" color="success" type="border" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
            <vs-button class="pull-right mr-1"  size="small" color="danger" type="border" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Cancelar</vs-button>
        </div>
    </div>
</template>
<script>

import { Vue2InteractDraggable } from "vue2-interact";
import _ from 'lodash'
import vSelect from 'vue-select';
import ProdutoDB from '../../rapidsoft/db/produtoDB'
import SegmentoDB from '../../rapidsoft/db/segmentoDB'
import CategoriaDB from '../../rapidsoft/db/categoriaDB'
import ImagemDB from '../../rapidsoft/db/imagemDB'
import produtoUtils from '../../rapidsoft/utils/produtoUtils'
import AddItemCarrinho  from '../../rapidsoft/components/AddItemCarrinho'

export default {

    data() {
        return {
            idSegmento: null,
            clientePedido: null,
            imagemProdutoPrincipal: null,
            produtoA: null,
            produtoB: null,
            produtoC: null,
            produtoD: null,
            categoriasFiltro: [],
            segmentosFiltro: [],
            segmentoSelecionado: null,
            categoriasSelecionadas: [],
            popupListaProdutos: false,
            produtoSearch: null,
            popupAddProduto: false,
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
            // produtos: [],
            paginaAtual: null,
            paginas: [],
            paginasProduto: [],
            produtosFiltro: [],
            isShowing: true,
            produtoZoom: null,
            popupZoomProduto: false,
            disabledInputCor: [],
            disabledInputTamanho: [],
            listaProdutosPesquisa: [],
            textoSearch: "",
        }
    },
    components: {
        Vue2InteractDraggable,
        'v-select': vSelect,
        AddItemCarrinho,
    },
    watch: {
        segmentoSelecionado() {
            this.searchCategorias();
        },
        categoriasSelecionadas() {
            this.searchFindProduto();
        },
        textoSearch(newValue, oldValue) {
            if ((newValue === "" && oldValue.length > 0) || newValue.length >= 3) {
                console.log('pesquisa');
                
                this.searchFindProduto();
            }
        }
    },
    computed: {
        // getProdutosPesquisa() {
        //     return this.produtos.filter((produto) => {
        //         return this.getCategoriasCardPesquisa.some((categoria) => {
        //             return categoria.check && produto.hasOwnProperty('categoria') && produto.categoria.hasOwnProperty('codigo') && produto.categoria.codigo == categoria.codigo;
        //         });
        //     });
        // },
        getCategoriasCardPesquisa() {
            return this.categoriasFiltro.map((categoria) => {
                return {id: categoria.id, nome: categoria.nome};
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
        getSegmentosSearch() {
            return this.segmentosFiltro.map((segmento) => {
                return segmento;
            })
        },
        getCategoriasSearch() {
            return this.categoriasFiltro.map((categoria) => {
                return categoria;
            })
        } 
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
        //tipo 1- cor, 2- tamanho
        // disabledCorTamanho(produto, corTamanho, tipo) {
        //     let produtoAddCoresNew = _.clone(produto.produtoAddCores);
        //     for (let indexCor = 0; indexCor < produtoAddCoresNew.length; indexCor++) {
        //         let cor = produtoAddCoresNew[indexCor];
        //         if (tipo === 1) cor.ativo = corTamanho.ativo;

        //         for (let indexTamanho = 0; indexTamanho < cor.produtoAddTamanhos.length; indexTamanho++) {
        //             let tamanho = cor.produtoAddTamanhos[indexTamanho];
        //             if (tipo === 2) {
        //                 // if (tamanho.codigo === corTamanho.codigo) produtoAddCoresNew[indexCor].produtoAddTamanhos[indexTamanho].ativo = corTamanho.ativo;
        //                 if (tamanho.codigo === corTamanho.codigo) {
        //                     // this.$set(this.produtoAdd.produtoA.produtoAddCores[indexCor].produtoAddTamanhos, indexTamanho, corTamanho);
        //                     let linhas = document.getElementById("table-add-produto-a").getElementsByClassName("input-quantidade-tam-"+tamanho.codigo);
        //                     for (let index = 0; index < linhas.length; index++) {
        //                         linhas[index].disabled = !corTamanho.ativo;
        //                     }             
        //                 } 
        //                 else continue;
        //             } else {
        //                 // this.$set(this.produtoAdd.produtoA.produtoAddCores[indexCor].produtoAddTamanhos, indexTamanho, corTamanho)
        //                 let linhas = document.getElementById("table-add-produto-a").getElementsByClassName("input-quantidade-cor-"+corTamanho.codigo);
        //                 for (let index = 0; index < linhas.length; index++) {
        //                     linhas[index].disabled = !corTamanho.ativo;
        //                 } 
        //             }
        //         }
        //     }
        //     this.$set(this.produtoAdd, "produtoA", produto.produtoAddCores);
        // },
        searchProduct(categoria){
            categoria.check = !categoria.check;
            this.$forceUpdate();
            ProdutoDB.getProdutosSearch(this.getCategoriasCardPesquisa).then((result) => {
                this.listaProdutosPesquisa = result;
            });
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
            }, 110);
            this.$forceUpdate();
        },
        prevRef() {
            const anterior = _.findIndex(this.paginas, (pagina) => { return pagina.pag === this.paginaAtual.pag })-1;
            if (anterior >= 0) {
                this.selectProduto(this.paginas[anterior]);
            } else {
                this.selectProduto(this.paginas[this.paginas.length-1]);
            }
            document.getElementById("produto-image-gallery").scrollTop = 0;
            this.corSelecionada = 0;
            this.hideCard();
        },
        nextRef() {
            const proxima = _.findIndex(this.paginas, (pagina) => { return pagina.pag === this.paginaAtual.pag })+1;
            if (proxima < this.paginas.length) {
                this.selectProduto(this.paginas[proxima]);
            } else {
                this.selectProduto(this.paginas[0]);
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
        searchCategorias() {
            this.categoriasSelecionadas = [];
            CategoriaDB.getAllBySegmento(this.segmentoSelecionado.id).then((categorias) => {
                this.categoriasFiltro = _.cloneDeep(categorias);
            });
        },
        searchFindProduto() {
            if (this.categoriasSelecionadas.length > 0 || this.textoSearch.length >= 3) {
                const idsCategorias = this.categoriasSelecionadas.map((categoria) => {return categoria.id})
                ProdutoDB.getProdutosSearch2(idsCategorias, this.textoSearch).then((result) => {
                    this.listaProdutosPesquisa = result;
                });
            } else {
                this.listaProdutosPesquisa = [];
            }
        },
        showVideo() {

        },
        abrirPesquisaPodutos() {
            this.produtoSearch = null;
            this.popupListaProdutos=true
        },
        addProduto() {
            this.produtoAdd = {
                produtoA: produtoUtils.createProdutoAdd(this.produtoA)
            };
            if(!_.isNil(this.produtoB)) {
                this.produtoAdd.produtoB = produtoUtils.createProdutoAdd(this.produtoB);
            }
            this.popupAddProduto = true;
        },
        cancelarAdd() {
            this.popupAddProduto = false;
            this.produtoAdd=null;
        },
        addReferenciaCarrinho() {
            console.log(this.produtoAdd);
        },
        monteSeuLook() {

        },
        selectProduto(pagina) {
            this.$vs.loading();
            this.paginaAtual = pagina;
            ProdutoDB.getProdutoPagina(pagina).then((result) => {
                this.popupListaProdutos = false;
                this.produtoA = result.produtoA;
                this.produtoB = result.produtoB;

                console.log("produtoA", this.produtoA);
                
                ImagemDB.getFotoPrincipal(this.produtoA).then((result) => {
                    this.imagemProdutoPrincipal = result;
                    this.corSelecionada = 0;
                    this.$vs.loading.close();
                })
            })
        },
        selectSearchProduto(produto) {
            const index = _.findIndex(this.paginas, (pagina) => { return pagina.produtoA.ref === produto.referencia })
            this.selectProduto(this.paginas[index]);
        },
    },
    beforeCreate() {
        if (this.$route.params.idCatalogo) {
            document.getElementById('loading-bg').style.display = null;
            ProdutoDB.getProdutosCatalogo(this.$route.params.idCatalogo).then(result => {
                this.paginas = result;
                this.selectProduto(result[0]);
                SegmentoDB.getAll().then((segmentos) => {
                    this.segmentosFiltro = _.cloneDeep(segmentos);
                    this.segmentoSelecionado = this.segmentosFiltro[0];
                    CategoriaDB.getAllBySegmento(this.segmentoSelecionado.id).then((categorias) => {
                        this.categoriasFiltro = _.cloneDeep(categorias);
                        document.getElementById('loading-bg').style.display = "none";
                    });
                });
            });
        } else {
            this.$router.push('/catalogo');
        }
    },
    created() {
        console.log('created');
    },
    beforeMount() {
        console.log('beforeMount');
    },
    mounted() {
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
    width: 50vh;
    -webkit-animation: rebound .4s;
    animation: rebound .4s;
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important
}

@media only screen and (max-width: 768px) {
    .card-img-principal {
        // max-width: 50vh;
        width: 45vh;
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

.page-catalogo {
    top: 2rem;
}


</style>
<style lang="scss">

.con-select .vs-select--input {
    font-size: 0.9rem;
}

.popup-produto-search .vs-popup {
    // right: 0;
    height: 100%;
    // width: 60%;        
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

.vs-input--input.normal {
    font-size: 0.75rem;
}

.not-data-table {
    min-height: 60vh;
}

</style>