<template>
	<div class="vx-row" id="page-atualizacao">
		<div class="vx-col w-full md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/cliente/consulta')">
            <vx-card :card-background="'rgb(234, 86, 87)'" class="text-center cursor-pointer">
                <img :src="require(`@/assets/images/rapidsoft/icons2/customer.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                <h4 class="mb-4">Clientes</h4>
            </vx-card>
        </div>
		<div class="vx-col w-full md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/pedido/consulta')">
            <vx-card :card-background="'rgb(234, 86, 87)'" class="text-center cursor-pointer">
                <img :src="require(`@/assets/images/rapidsoft/icons2/order.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                <h4 class="mb-4">Pedidos</h4>
            </vx-card>
        </div>
		<div class="vx-col w-full md:w-1/4 sm:w-1/3 mb-base" @click="$router.push('/pedido/catalogo')">
            <vx-card :card-background="'rgb(234, 86, 87)'" class="text-center cursor-pointer">
                <img :src="require(`@/assets/images/rapidsoft/icons2/catalog.png`)" alt="graphic" width="40" class="mx-auto mb-4">
                <h4 class="mb-4">Catálogo</h4>
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