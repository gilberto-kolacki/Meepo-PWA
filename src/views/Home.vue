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
                                    {{this.carrinho.cliente ? this.carrinho.cliente.nome : " - " | capitalize }}
                                </vs-td>
                                <vs-td>
                                    {{this.carrinho.grupoCliente ? this.carrinho.grupoCliente.nome : " - " | capitalize}}
                                </vs-td>
                                <vs-td style="text-align:right">
                                    {{this.carrinho.itens.length}}
                                </vs-td>
                                <vs-td style="text-align:right">
                                    {{this.carrinho.valorTotal | moneyy }}
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table >
                </vx-card>
            </div>
        </div>
        <div class="vx-row flex justify-center" style="margin-top:10px" v-if="this.existePedidoEmDigitacao">
            <div class="vx-col w-full">
                <vx-card class="cursor-pointer">
                    <vs-table ref="table" :data="pedidosEmDigitacao">
                        <template slot="header">
                            <h4>Pedidos em Digitação</h4>
                        </template>
                        <template slot="thead">
                            <vs-th style="width:5%">Abrir</vs-th>
                            <vs-th style="width:35%">CNPJ</vs-th>
                            <vs-th style="width:30%">Cliente</vs-th>
                            <vs-th style="width:10%">Itens</vs-th>
                            <vs-th style="width:20%">Total</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr v-for="(pedido, indextr) in data" :key="indextr">
                                <vs-td>
                                    <div class="flex">
                                        <div class="p-1">
                                            <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="success" icon="icon-maximize-2" @click="abrirPedido(data[indextr])" />
                                        </div>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    {{pedido.cliente.cpfCnpj}}
                                </vs-td>
                                <vs-td>
                                    {{pedido.cliente.nome | capitalize }}
                                </vs-td>
                                <vs-td style="text-align:right">
                                    {{pedido.quantidade }}
                                </vs-td>
                                <vs-td style="text-align:right">
                                    {{ pedido.totalLiquido | moneyy(pedido.grupoCliente)}}
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

import PedidoDB from '../rapidsoft/db/pedidoDB';
import Storage from '../rapidsoft/utils/storage';

export default {
    data() {
        return { 
            clientes: [],
            pedidos: null,
            showScreen: false,
            carrinho:[],
            pedidosEmDigitacao:[],
        }
    },
	components: {
        
    },
    computed: {
        existeCarrinho() {
            return Storage.existeCarrinho();
        },
        existePedidoEmDigitacao() {
            if (this.pedidosEmDigitacao.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        abrirPedido(pedido) {
            if (pedido) {
                this.$router.push({ name: 'pedidoEditar', params: {pedidoId: pedido._id} });
            } else {
                this.$router.push('/pedido/cadastro');
            }
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                PedidoDB.existePedidoEmDigitacao().then((result) => {
                    this.pedidosEmDigitacao = result;
                    this.carrinho = Storage.getCarrinho();   
                    this.showScreen = true;
                    document.getElementById('loading-bg').style.display = "none";
                    resolve();
                });
            });
        }
    },
    created() {

    },
    async mounted() {
        await this.carregaItensTela();
    },
}

</script>