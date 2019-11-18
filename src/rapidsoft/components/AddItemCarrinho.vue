<template>
    <div class="parentx">
        <add-item-carrinho-item idColapse="accordion-ref-a" :toggle="true" title="Referencia A" :produtoAdd="this.produtoAdd.produtoA"></add-item-carrinho-item>
        <add-item-carrinho-item idColapse="accordion-ref-b" :toggle="false" title="Referencia B" :produtoAdd="this.produtoAdd.produtoB"></add-item-carrinho-item>
        <div style="margin-top: 1rem;">
            <vs-button class="pull-right mr-1"  size="small" color="success" type="border" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
            <vs-button class="pull-right mr-1"  size="small" color="danger" type="border" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Cancelar</vs-button>
        </div>
    </div>    
</template>    
<script>

import _ from 'lodash'
import AddItemCarrinhoItem  from '../../rapidsoft/components/AddItemCarrinhoItem'
import Storage  from '../../rapidsoft/utils/storage'
import PedidoUtils  from '../../rapidsoft/utils/pedidoUtils'

export default {
    name: 'add-item-carrinho',
    props: {
        produtoAdd: {
            type: Object,
            required: true,
        }
    },
    data: () => ({
        maxHeight: '0px',
        openItems: false,
        carrinho: {},
    }),
    components: {
        AddItemCarrinhoItem,
    },
    computed: {

    },
    methods: {
        cancelarAdd () {
            this.$emit('cancelar-add', {});
        },
        addReferenciaCarrinho() {
            console.log(this.produtoAdd);

        },
    
    },
    beforeCreate() {       
        this.carrinho = Storage.getPedidoCarrinho();
        
    },
}
</script>    

<style lang="scss">



    
</style>