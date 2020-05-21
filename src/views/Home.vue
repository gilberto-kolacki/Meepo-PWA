<template>
    <div class="page-home" v-if="this.showScreen">
        <div class="vx-row">
            <div class="vx-col w-full lg:w-1/5 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/cliente/consulta')">
                <vx-card class="text-center cursor-pointer border-component-home">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/customer.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Clientes</h4>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/5 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/pedido/consulta')">
                <vx-card class="text-center cursor-pointer border-component-home">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/order.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Pedidos</h4>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/5 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/orcamento/consulta')">
                <vx-card class="text-center cursor-pointer border-component-home">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/009-wishlist.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Orçamentos</h4>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/5 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/catalogo')">
                <vx-card class="text-center cursor-pointer border-component-home">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/catalog.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Catálogo</h4>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/5 mb-base" @click="$router.push('/pages/sincronizacao')">
                <vx-card class="text-center cursor-pointer border-component-home">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/sinc.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Sinc</h4>
                </vx-card>
            </div>
        </div>
        <div class="vx-row flex justify-center" v-if="this.existeCarrinho">
            <div class="vx-col w-full" @click="$router.push('/carrinho')">
                <vx-card class="cursor-pointer border-component-home">
                    <h5>Carrinho</h5>
                    <table style="width:100%" class="border-collapse">
                        <tr>
                            <th class="p-2 border border-solid d-theme-border-grey-light">Cliente</th>
                            <th class="p-2 border border-solid d-theme-border-grey-light">Total de Peças</th>
                            <th class="p-2 border border-solid d-theme-border-grey-light">Total</th>
                        </tr>
                        <tr>
                            <td class="p-2 border border-solid d-theme-border-grey-light">{{this.carrinho.cliente ? this.carrinho.cliente.nome : " - " | capitalize}}</td>
                            <td class="p-2 border border-solid d-theme-border-grey-light">{{getTotalPecas}}</td>
                            <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{this.carrinho.valorTotal | moneyy}}</td>
                        </tr>
                    </table>
                </vx-card>
            </div>
        </div>
        <div class="vx-row flex justify-center" style="margin-top:10px" v-if="this.existePedidoEmDigitacao">
            <div class="vx-col w-full" @click="$router.push('/pedido/consulta')">
                <vx-card class="cursor-pointer border-component-home">
                    <h5>Pedidos em Digitação</h5>
                    <table style="width:100%" class="border-collapse">
                        <tr>
                            <th class="p-2 border border-solid d-theme-border-grey-light">Cliente</th>
                            <th class="p-2 border border-solid d-theme-border-grey-light">Itens</th>
                            <th class="p-2 border border-solid d-theme-border-grey-light">Total</th>
                        </tr>
                        <tr v-for="(pedido, indextr) in pedidosEmDigitacao" :key="indextr">
                            <td class="p-2 border border-solid d-theme-border-grey-light">{{pedido.cliente.nome | capitalize }}</td>
                            <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{pedido.quantidade }}</td>
                            <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{ pedido.totalLiquido | moneyy(pedido.grupoCliente)}}</td>
                        </tr>
                    </table>
                </vx-card>
            </div>
        </div>
    </div>
</template>

<script>

import PedidoDB from '../rapidsoft/db/pedidoDB';
import CarrinhoDB from '../rapidsoft/db/carrinhoDB';
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
        lastDateSinc() {
            return this.$store.state.lastDateSinc;
        },
        existePedidoEmDigitacao() {
            if (this.pedidosEmDigitacao.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        getTotalPecas() {
            return this.carrinho.itens.reduce((total, item) => {
                return total + item.quantidade;
            }, 0);
        },
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
                PedidoDB.buscaPedidosEmDigitacao().then((result) => {
                    this.pedidosEmDigitacao = result;
                    CarrinhoDB.getCarrinho().then((carrinho) => {
                        this.carrinho = carrinho;
                        this.showScreen = true;
                        document.getElementById('loading-bg').style.display = "none";
                        resolve();
                    });
                });
            });
        }
    },
    created() {

    },
    mounted() {
        this.carregaItensTela().then(() => {
            const dataLimite = new Date().setDate(new Date().getDate() - 5);
            if (this.lastDateSinc <= dataLimite) {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: 'Deseja sincronizar?',
                    text: 'Já fazem 5 dias ou mais desde a sua última sincronização completa.',
                    acceptText: 'Sincronizar',
                    cancelText: 'Cancelar',
                    accept: () => this.$router.push({ name: 'sincronizacao'})
                });
            }
        });
    },
}

</script>

<style lang="scss">

.border-component-home {
    border: 2px solid #919093;    
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);
}

</style>