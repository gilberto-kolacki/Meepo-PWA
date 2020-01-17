<template>
    <div class="page-home" v-if="this.showScreen">
        <div class="vx-row">
            <div class="vx-col w-full lg:w-1/4 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/cliente/consulta')">
                <vx-card class="text-center cursor-pointer border-solid">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/customer.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Clientes</h4>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/4 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/pedido/consulta')">
                <vx-card class="text-center cursor-pointer border-solid">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/order.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Pedidos</h4>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/4 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/catalogo')">
                <vx-card class="text-center cursor-pointer border-solid">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/catalog.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Catálogo</h4>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/4 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/pages/sincronizacao')">
                <vx-card class="text-center cursor-pointer border-solid">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/sinc.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Sinc</h4>
                </vx-card>
            </div>
        </div>
        <div class="vx-row flex justify-center" v-if="this.existeCarrinho">
            <div class="vx-col w-full" @click="$router.push('/carrinho')">
                <vx-card class="cursor-pointer">
                    <vs-table ref="table" :data="carrinho">
                        <template slot="header">
                            <h4>Carrinho</h4>
                        </template>
                        <template slot="thead">
                            <vs-th style="width:40%">Cliente</vs-th>
                            <vs-th style="width:30%">Grupo</vs-th>
                            <vs-th style="width:10%">Itens</vs-th>
                            <vs-th style="width:20%;">Total</vs-th>
                        </template>
                        <template>
                            <vs-tr>
                                <vs-td>
                                    {{this.carrinho.cliente ? this.carrinho.cliente.nome : " - "}}
                                </vs-td>
                                <vs-td>
                                    {{this.carrinho.grupoCliente ? this.carrinho.grupoCliente.nome : " - "}}
                                </vs-td>
                                <vs-td style="text-align:right">
                                    {{this.carrinho.itens.length}}
                                </vs-td>
                                <vs-td style="text-align:right">
                                    {{this.carrinho.valorTotal}}
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table >
                </vx-card>
            </div>
        </div>
    </div>
</template>

<script>

import ClienteDB from '../rapidsoft/db/clienteDB';
import PedidoDB from '../rapidsoft/db/pedidoDB';
import ErrorDB from '../rapidsoft/db/errorDB';
import Storage from '../rapidsoft/utils/storage';

export default {
    data() {
        return { 
            clientes: [],
            pedidos: null,
            showScreen: false,
            carrinho:[],
        }
    },
    watch: {
        showScreen(val) {
            if (val) {
                document.getElementById('loading-bg').style.display = "none";
            } else {
                document.getElementById('loading-bg').style.display = null;
            }
        }
    },
	components: {
        
        
    },
    computed: {
        existeCarrinho() {
            return Storage.existeCarrinho();
        }
    },
    methods: {
        abrirCarrinho() {
            this.$router.push({ name: 'carrinho'});
        },
    },
    beforeCreate() {
        document.getElementById('loading-bg').style.display = null;
    },
    created() {
    },
    mounted() {
        ClienteDB._sincNuvem().then(() => {
            PedidoDB._sincNuvem().then(() => {
                ErrorDB._sincNuvem().then(() => {
                    this.carrinho = Storage.getCarrinho();   
                    this.showScreen = true;
                });
            });
        });
    },
}

</script>