<template>
	<div class="vx-row" id="page-atualizacao">
		<div class="vx-col w-full lg:w-1/6 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/cliente/consulta')">
            <vx-card class="text-center cursor-pointer border-solid">
                <img :src="require(`@/assets/images/rapidsoft/icons1/customer.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                <h4 class="mb-4">Clientes</h4>
            </vx-card>
        </div>
		<div class="vx-col w-full lg:w-1/6 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/pedido/consulta')">
            <vx-card class="text-center cursor-pointer border-solid">
                <img :src="require(`@/assets/images/rapidsoft/icons1/order.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                <h4 class="mb-4">Pedidos</h4>
            </vx-card>
        </div>
		<div class="vx-col w-full lg:w-1/6 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/catalogo')">
            <vx-card class="text-center cursor-pointer border-solid">
                <img :src="require(`@/assets/images/rapidsoft/icons1/catalog.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                <h4 class="mb-4">Catálogo</h4>
            </vx-card>
        </div>
        <div class="vx-col w-full lg:w-1/6 md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/pages/sincronizacao')">
            <vx-card class="text-center cursor-pointer border-solid">
                <img :src="require(`@/assets/images/rapidsoft/icons1/sinc.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                <h4 class="mb-4">Sinc</h4>
            </vx-card>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return { 
            clientes: [],
        }
	},
	components: {},
    computed: {
    
    },
    methods: {
    
    },
    created() {
        
    },
    mounted() {

    },
    beforeCreate() {
        
    }
}

</script>