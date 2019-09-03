<template>
    <div id="page-catalogo">
    <!-- <div class="card" style="width: 20rem;">
        <img :src="require(`@/assets/images/rapidsoft/produtos/`+ getImageTipo1())" class="card-img-top" alt="...">
        <img :src="require(`@/assets/images/rapidsoft/produtos/`+ getImageTipo2())" class="card-img-top" alt="...">
        <div class="card-body">
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
    </div> -->
        <div class="vx-row">
            
            <div class="vx-col w-full sm:w-1/5">
                <div class="vx-row">
                    <vs-divider position="left" border-style="dashed" color="primary">Imagens</vs-divider>
                    <vx-card>
                        <div class="vx-row pt-2 items-center justify-center">
                            <div class="vx-col xs:w-1/3" v-for="(imagem, index) in getImagensProduto" :key="index">
                                <img :src="require(`@/assets/images/rapidsoft/produtos/${produtoUp.referencia}_${corSelecionada}_${imagem}.png`)" alt="latest-upload" class="rounded mb-4 user-latest-image responsive img-ref">
                            </div>
                        </div>
                    </vx-card>
                </div>
                <div class="vx-row">
                    <vs-divider position="left" border-style="dashed" color="primary">Cores</vs-divider>
                    <vx-card>
                        <div class="vx-row pt-2 items-center justify-center">
                            <div class="vx-col xs:w-1/3" v-for="(cor, index) in getCoresProduto" :key="index">
                                <img :src="require(`@/assets/images/rapidsoft/produtos/cores/${cor.nome}.png`)" alt="latest-upload" class="rounded mb-4 user-latest-image responsive img-cor">
                            </div>
                        </div>
                    </vx-card>
                </div>
            </div>

            <!-- <div class="vx-col w-full sm:w-4/6 lg:w-1/3 mb-base"> -->
            <vs-col vs-type="flex" vs-justify="center" vs-align="baseline" vs-lg="4" vs-sm="7" vs-xs="12">
                <vx-card :title="getProdutoNome(produtoUp)">
                    <div slot="no-body">
                        <img :src="require(`@/assets/images/rapidsoft/produtos/${getImage(produtoUp)}`)" class="card-img-top" alt="...">
                    </div>
                    <h6 class="mb-2" v-if="this.produtoUp.tipo === 2">{{ getProdutoNome(produtoDown) }}</h6>
                </vx-card>
            </vs-col>
            <!-- </div> -->

            <div class="vx-col w-full sm:w-1/5">
                <!-- <div class="flex w-full items-center justify-center">
                    <vs-button radius color="primary" type="border" icon-pack="feather" icon="icon-search"></vs-button>
                </div> -->
                <div class="vx-row">
                    <vs-divider position="right" border-style="dashed" color="primary">Categorias</vs-divider>
                    <vx-card>
                        <ul class="leftx">
                            <li style="margin-bottom: 0.5rem;">
                                <vs-radio v-model="filtro.categoria" :vs-value="0">Todas</vs-radio>
                            </li>
                            <li v-for="(categoria, index) in categorias" :key="index" style="margin-bottom: 0.5rem;">
                                <vs-radio v-model="filtro.categoria" :vs-value="categoria.codigo">{{categoria.nome}}</vs-radio>
                            </li>
                        </ul>
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-plus">Lista</vs-button>
                        </div>
                    </vx-card>
                </div>
                <div class="vx-row">
                    <vs-divider position="right" border-style="dashed" color="primary"></vs-divider>
                    <vx-card>
                        <div class="flex w-full items-center justify-center">
                            <vs-button color="success" type="filled" icon-pack="feather" icon="icon-shopping-cart">Adicionar</vs-button>
                        </div>
                    </vx-card>
                </div>
            </div>
        </div>

    </div>
    
</template>

<script>
export default {

    data() {
        return {
            categorias: [
                {codigo: 1, nome: 'Biquini'},
                {codigo: 2, nome: 'Top'},
                {codigo: 3, nome: 'Tanga'},
                {codigo: 4, nome: 'Maiô'},
                {codigo: 5, nome: 'Kids'},
                {codigo: 6, nome: 'Masculino'},
                {codigo: 7, nome: 'Acessórios'},
            ],
            filtro:{
                categoria: 0
            },
            corSelecionada: null,
            produtoUp: null,
            produtoDown: null,
            imagens: [

            ],
            produtos: [
                {
                    referencia: "44577",
                    tipo: 1,
                    nome: 'BIQUINI BEACH OXYGEN',
                    tamanhos: ['P/S', 'M/M', 'G/L'],
                    cores: [
                        {
                            nome: 'EX1819',
                            imagens: ['1', '2']
                        },
                        {
                            nome: 'EX1818',
                            imagens: ['1', '2']
                        },
                        {
                            nome: 'EX1815',
                            imagens: ['1', '2']
                        },
                    ],
                },
                {
                    referencia: "44333",
                    tipo: 2,
                    nome: 'TANGA PUSH UP REFINE TROPICAL',
                },
                {
                    referencia: "44333",
                    tipo: 3,
                    nome: 'TANGA PUSH UP REFINE TROPICAL',
                }
            ]

        }
    },
    computed: {
        getImagensProduto() {
            if (this.produtoUp) {
                return this.produtoUp.cores[0].imagens
            } else {
                return [];
            }
        },
        getCoresProduto() {
            if (this.produtoUp) {
                return this.produtoUp.cores
            } else {
                return [];
            }
        }
    },
    methods: {
        getProdutoNome(produto) {
            return produto.referencia +"-"+ produto.nome;
        },
		getImage(produto) {
            console.log(produto);
            
			return "44577_EX1819_1.png";
        },
        handleWindowResize(event) {
            this.windowWidth = event.currentTarget.innerWidth
            this.setSidebarWidth()
        },
        setSidebarWidth() {
            if(this.windowWidth < 992) {
                this.isFilterSidebarActive = this.clickNotClose = false
            }else {
                this.isFilterSidebarActive = this.clickNotClose = true
            }
        },
    },
    created() {
        this.produtoUp = this.produtos[0];
        this.corSelecionada = this.produtoUp.cores[0].nome;
        if(this.produtoUp.tipo === 2) {
            this.produtoDown = this.produtos[1];
        }
    },
    mounted() {
        
    },
    
}
</script>

<style scoped>

.mt-base-bottom {
    margin-bottom: 2rem !important
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
    max-height: 8rem;
    /* max-width: 10rem; */
}

.img-cor {
    max-height: 4rem;
    max-width: 6rem;
}

</style>