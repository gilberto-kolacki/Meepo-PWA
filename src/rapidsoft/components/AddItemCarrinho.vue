<template>
    <div class="parentx">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Voltar</vs-button>
        <div>
            <add-item-carrinho-item idColapse="accordion-ref-a" :toggle="true" title="Referencia A" :produtoAdd="this.produtoAdd.produtoA"></add-item-carrinho-item>
            <add-item-carrinho-item idColapse="accordion-ref-b" :toggle="false" title="Referencia B" :produtoAdd="this.produtoAdd.produtoB"></add-item-carrinho-item>
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

.btn-confirm {
    position: fixed;
    top: 50%;
    right: -50px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 1000;
    width: 10rem;
    transform: rotate(-90deg);
}

.btn-cancel {
    position: fixed;
    top: 50%;
    left: -50px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 1000;
    width: 10rem;
    transform: rotate(90deg);
}

    
</style>