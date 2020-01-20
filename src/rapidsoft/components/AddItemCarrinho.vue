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
                v-model="this.produtoA"
                @replica-todas-grades='replicarTodasGrades'
            >
            </add-item-carrinho-item>
            <add-item-carrinho-item 
                v-if="this.produtoB"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                idColapse="accordion-ref-b" 
                :toggle="false" 
                title="Referencia B" 
                v-model="this.produtoB"
                @replica-todas-grades='replicarTodasGrades'
            >
            <!-- <add-item-carrinho-item 
                v-if="this.produtoA"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                idColapse="accordion-ref-a" 
                :toggle="true" 
                title="Referencia A" 
                :produtoAdd="this.produtoA"
                @replica-todas-grades='replicarTodasGrades'
            >
            </add-item-carrinho-item>
            <add-item-carrinho-item 
                v-if="this.produtoB"
                @atualiza-qtde-itens="atualizaQuantidadeItens" 
                idColapse="accordion-ref-b" 
                :toggle="false" 
                title="Referencia B" 
                :produtoAdd="this.produtoB"
                @replica-todas-grades='replicarTodasGrades'
            > -->
            </add-item-carrinho-item>
        </div>
        <div>
            <complete-look
                v-if="this.produtoA" 
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
        // const done = _.after(tamanhos.length, () => resolve(tamanhoResult));
        // this.produtoAdd[key].cores.map((itemCor,indexCor) => {
        //     const listaProdutosCores = _.find(produto.cores, function(cor) { return cor.idCor == itemCor.idCor; });
        //     if (listaProdutosCores) {
        //         itemCor.tamanhos.map((produtoTamanho,indexTamanho) => {
        //             const listaProdutosTamanhos = _.find(listaProdutosCores.tamanhos, function(tam) { 
        //                 return tam.codigo == produtoTamanho.codigo; 
        //             });
        //             this.produtoAdd[key].cores[indexCor].tamanhos[indexTamanho].quantidade = _.clone(listaProdutosTamanhos ? listaProdutosTamanhos.quantidade : 0);
        //             this.atualizarGrade(indexCor, indexTamanho,key);
        //         });
        //     }
        // })

        replicarTodasGrades(produto) {

            this.$forceUpdate();

            return new Promise(() => {
                // const done = _.after(Object.keys(this.produtoAdd).length, () => resolve(this.update()));
                
                for (const key in this.produtoAdd) {
                    
                    // const done = _.after(this.produtoAdd[key].cores.length, () => resolve(this.update()));
                    
                    if (this.produtoAdd.hasOwnProperty(key)) {
                        
                        this.produtoAdd[key].cores.forEach((itemCor,indexCor) => {
                            const listaProdutosCores = _.find(produto.cores, function(cor) { return cor.idCor == itemCor.idCor; });
                            if (listaProdutosCores) {
                                itemCor.tamanhos.forEach((itemTamanho,indexTamanho) => {

                                    const listaProdutosTamanhos = _.find(listaProdutosCores.tamanhos, function(tam) { 
                                        return tam.codigo == itemTamanho.codigo; 
                                    });
                                    itemTamanho.quantidade = listaProdutosTamanhos ? _.clone(listaProdutosTamanhos.quantidade) : 0;
                                    this.atualizarGrade(indexCor,indexTamanho,key)
                                    // done();
                                })
                            }
                        });
                        
                    }
                    //  done();
                }
            
                setTimeout(() => {this.$forceUpdate()}, 1000);
            
            });
            

        },

        update() {
            console.log("done");
            this.$forceUpdate();
        },

        atualizarGrade(indexCor, indexTamanho,key) {
            const tamanho = this.criaTamanho(indexCor, indexTamanho,key);
            tamanho.quantidade = _.isNil(tamanho.quantidade) ? 
                0 : (tamanho.quantidade === 0 ? 0 :tamanho.quantidade);
            this.atualizaQuantidadeItens(_.clone(tamanho))
        },

        criaTamanho(indexCor, indexTamanho, key) {
            const tamanho = this.produtoAdd[key].cores[indexCor].tamanhos[indexTamanho];
            tamanho.ref = this.produtoAdd[key].referencia;
            tamanho.cor = this.produtoAdd[key].cores[indexCor].idCor;
            tamanho.precoCusto = this.produtoAdd[key].cores[indexCor].precoCusto;
            tamanho.idProduto = this.produtoAdd[key].cores[indexCor].idProduto;
            tamanho.idSegmento = this.produtoAdd[key].segmento;
            return tamanho
        },

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
            if (tamanho.quantidade) {
                if (tamanho.ativo && tamanho.quantidade > 0) {
                    delete tamanho['ativo'];
                    delete tamanho['estoque'];
                    itens.push(tamanho);
                }
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