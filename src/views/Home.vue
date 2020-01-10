<template>
    <div class="page-home">
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
        <div class="vx-row">
        <!-- <div class="vx-row" v-if="this.carrinho"> -->
            <div class="vx-col w-full mb-base" @click="$router.push('/carrinho')">
                <vx-card class="text-center cursor-pointer border-solid">
                    <img :src="require(`@/assets/images/rapidsoft/icons1/carrinho.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                    <h4 class="mb-4">Carrinho</h4>
                </vx-card>
            </div>
        </div>
        <div class="vx-row" v-if="this.pedidos">
        
        </div>
    </div>
</template>

<script>

import ClienteDB from '../rapidsoft/db/clienteDB';
import PedidoDB from '../rapidsoft/db/pedidoDB';
import ErrorDB from '../rapidsoft/db/errorDB';

export default {
    data() {
        return { 
            clientes: [],
            carrinho: null,
            pedidos: null,
        }
	},
	components: {
        
    },
    computed: {
    
    },
    methods: {
    
    },
    created() {
        
    },
    mounted() {
        ClienteDB._sincNuvem().then(() => {
            PedidoDB._sincNuvem().then(() => {
               ErrorDB._sincNuvem();
            });
        });

    },
}

</script>