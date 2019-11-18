<template>
    <div class="parentx">
        <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle="idColapse">
            <h5><strong>{{ title }} : </strong>  {{produtoAdd.referencia +' - '+ produtoAdd.nome}}</h5>
            <h6><strong>Política:</strong></h6>
        </b-card-header>
        <b-collapse :id="idColapse" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
                <div class="row">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered" id="table-add-produto-a">
                            <thead>
                                <tr>
                                    <th scope="col">Cor/Tamanho</th>
                                    <th scope="col" style="text-align: center;" v-for="(tamanho, indexTamanho) in getTamanhosProduto" :key="indexTamanho">
                                        <div class="flex w-full items-center justify-center">
                                            <vs-checkbox :id="'tamanho-check-'+tamanho.codigo" v-model="tamanho.ativo" @input="disabledCorTamanho(produtoAdd, tamanho, 2)"></vs-checkbox>
                                            {{tamanho.codigo}}
                                        </div>
                                    </th>
                                    <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(cor, indexCor) in getCoresProduto" :key="indexCor">
                                    <th scope="row">
                                        <div class="flex w-full items-center justify-center">
                                            <vs-checkbox :id="'cor-check-'+cor.codigo" v-model="cor.ativo" @input="disabledCorTamanho(produtoAdd, cor, 1)"></vs-checkbox>
                                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="cor.imagemCor" size="36px" v-if="cor.imagemCor" style="border: 0.9px solid #7b7b7b;"/>
                                            <span class="ml-1">{{cor.codigo}}</span>                                                
                                        </div>
                                    </th>
                                    <td v-for="(tamanho, indexTamanho) in getTamanhosProduto" :key="indexTamanho" style="padding: 0.3rem;">
                                        <div v-if="produtoAdd.cores[indexCor].tamanhos[indexTamanho].ativo && tamanho.ativo && cor.ativo">
                                            <input 
                                                type="number" 
                                                :class="'input-quantidade-tam-'+tamanho.codigo+ ' input-quantidade-cor-'+cor.codigo" 
                                                v-model="produtoAdd.cores[indexCor].tamanhos[indexTamanho].quantidade" 
                                                class="form-control" 
                                                style="margin-top: 0rem;min-width: 5rem;padding: 1px 4px;"/>
                                            <div class="produto-add-button">
                                                <feather-icon icon="MinusIcon" svgClasses='h-4 w-4' class="produto-add-button-menos" @click="menosTamanho(produtoAdd.cores[indexCor].tamanhos[indexTamanho])" />
                                                <feather-icon icon="PlusIcon" svgClasses='h-4 w-4' class="produto-add-button-mais"  @click="maisTamanho(produtoAdd.cores[indexCor].tamanhos[indexTamanho])"/>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <input type="number" class="form-control" placeholder="Inativado" disabled style="margin-top: 0.6rem; min-width: 5rem;"/>
                                        </div>
                                    </td>
                                    <td>
                                        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </b-card-body>
        </b-collapse>
    </div>    
</template>    
<script>

import _ from 'lodash'

export default {
    name: 'add-item-carrinho-tem',
    props: {
        produtoAdd: {
            type: Object,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        idColapse: {
            type: String,
            required: true,
        },
        toggle: {
            type: Boolean,
            default: true,
        }
    },
    data: () => ({
        maxHeight: '0px',
        openItems: false
    }),
    computed: {
        getCoresProduto() {
            return _.orderBy(this.produtoAdd.cores, ['codigo']);
        },
        getTamanhosProduto() {
            return this.produtoAdd.produtoAddCores[0].produtoAddTamanhos;
        },
    },
    methods: {
        // 2-tamanho, 1-cor
        disabledCorTamanho(produto, corTamanho, tipo) {
            this.$forceUpdate();
        },
        menosTamanho(tamanho) {
            tamanho.quantidade = _.isNil(tamanho.quantidade) ? 0 : (tamanho.quantidade === 0 ? 0 :tamanho.quantidade-1);
            this.$forceUpdate();
        },
        maisTamanho(tamanho) {
            tamanho.quantidade = _.isNil(tamanho.quantidade) ? 1 : tamanho.quantidade+1;
            this.$forceUpdate();
        },
    
    },
}
</script>    

<style lang="scss">

.produto-add-button {
    margin-top: 8px;
    margin-bottom: 0px;
}

.produto-add-button-mais {
    background-color: #fff;
    width: 50% !important;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;        
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    border-radius: .2rem !important;
    border: 0.9px solid #808992;
    // border-right: 1px solid #080808;
    // border-left: 1px solid #080808;
    color: #28a745;
    padding: 1px;
}

.produto-add-button-menos {
    background-color: #fff;
    width: 50% !important;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;        
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    border-radius: .2rem !important;
    border: 0.9px solid #808992;
    // border-right: 1px solid #080808;
    // border-left: 1px solid #080808;
    color: #dc3545;
    padding: 1px;
}

    
</style>