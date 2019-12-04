<template>
    <div>
        {{JSON.stringify(this.carrinho)}}
    </div>
</template>

<script>

import Storage  from '../../rapidsoft/utils/storage'
import ProdutoUtils  from '../../rapidsoft/utils/produtoUtils'

export default {
    data: () => ({
        carrinho: null,
        selected: [],
        itemsPerPage: 4,
        isMounted: false,
        addNewDataSidebar: false,
        sidebarData: {},

    }),
    components: {
        
    },
    computed: {
        currentPage() {
            if(this.isMounted) {
                return this.$refs.table.currentx
            }
            return 0
        },
        products() {
            return this.carrinho;
        },
        queriedItems() {
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.products.length
        }
    },
    methods: {
        toggleDataSidebar(val=false) {
            this.addNewDataSidebar = val
        }


    },
    beforeCreate() {       
        
    },
    created() {        
        
    },
    mounted() {
        ProdutoUtils.getCarrinho().then((carrinho) => {
            this.carrinho = carrinho;
            console.log(this.carrinho);
        })
        
    }
}

</script>