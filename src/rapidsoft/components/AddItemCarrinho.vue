<template>
    <div class="parentx">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="addReferenciaCarrinho()">Adicionar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="cancelarAdd()" icon="icon-x">Voltar</vs-button>
        <div>
            <add-item-carrinho-item 
                v-if="this.produtoA"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                idColapse="accordion-ref-a" 
                :toggle="true" 
                title="Referencia A" 
                :produtoAdd="this.produtoA"
                :quantRef="this.produtoB"
                >
            </add-item-carrinho-item>
            <add-item-carrinho-item 
                v-if="this.produtoB"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                idColapse="accordion-ref-b" 
                :toggle="false" 
                title="Referencia B" 
                :produtoAdd="this.produtoB"
                :quantRef="this.produtoA"
                >
            </add-item-carrinho-item>
        </div>
        <div>
            <complete-look 
                @produto-look="openLook"
                :produtoA="this.produtoA">
            </complete-look>
        </div>    
    </div>    
</template>    
<script>

import _ from 'lodash'
import AddItemCarrinhoItem  from '../../rapidsoft/components/AddItemCarrinhoItem'
import Storage  from '../../rapidsoft/utils/storage'
import ProdutoUtils  from '../../rapidsoft/utils/produtoUtils'
import CompleteLook  from '../../rapidsoft/components/CompleteLook'

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
        carrinho: null,
        produtoA: null,
        produtoB: null,
    }),
    components: {
        AddItemCarrinhoItem,
        CompleteLook,
    },
    computed: {

    },
    methods: {
        openLook(produto) {
            this.$emit('search-selected', produto.produtoA);
        },

        cancelarAdd () {
            this.$emit('show-add-carrinho');
        },
        addReferenciaCarrinho() {
            ProdutoUtils.calcularCarrinho(this.carrinho).then((carrinhoResult) => {
                Storage.setCarrinho(carrinhoResult);
                this.$emit('show-add-carrinho');     
            });
        },
        atualizaQuantidadeItens(tamanho) {           
            const itens = _.remove(this.carrinho.itens, (item) => item.id != tamanho.id );
            if (tamanho.ativo && tamanho.quantidade > 0) {
                delete tamanho['ativo'];
                delete tamanho['estoque'];
                itens.push(tamanho);
            }
            this.carrinho.itens = itens;
        },
        buscaProdutosPagina() {
            this.produtoA = ProdutoUtils.createProdutoAdd(this.produtoAdd.produtoA);
            if(!_.isNil(this.produtoAdd.produtoB)) {
                this.produtoB = ProdutoUtils.createProdutoAdd(this.produtoAdd.produtoB);
            }
        }
    },
    beforeCreate() {       
        
    },
    created() {        
        this.buscaProdutosPagina();
    },
    mounted() {
        this.carrinho = Storage.getCarrinho();
    
    }
}
</script>    

<style lang="scss">


    
</style>