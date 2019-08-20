<template>
    <div class="flex w-full vx-row no-gutter items-center justify-center" id="page-atualizacao">
        <div class="vx-col w-full lg:w-1/2">
            <vx-card class="text-center cursor-pointer">
                <img :src="require(`@/assets/images/pages/graphic-6.png`)" alt="graphic" width="180" class="mx-auto mb-4">
                <h4 class="mb-4">Dados da Aplicação</h4>
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
    computed: {
        isIOS() {
            return this.$store.state.isIOS;
        }
    
    },
    methods: {
    
    },
    created() {
        
    },
    mounted() {
        console.log(this.isIOS);

    },
    beforeCreate() {
        
    }
}

</script>