<template>
    <div class="parentx">
        <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle="idColapse">
            <div class="vx-row">
                <div class="vx-col w-full">
                    <h5><strong>{{ title }} : </strong>  {{produtoAdd.referencia +' - '+ produtoAdd.nome}}</h5>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col w-2/3">
                    <h6><strong>Política:</strong> {{this.grupoCliente.nome}}</h6>
                </div>
                <div class="vx-col w-1/3">
                    <h6><strong>Preço :</strong> {{getPreco}}</h6>
                </div>
            </div>
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
                                    <th scope="col">Totais</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(cor, indexCor) in getCoresProduto" :key="indexCor">
                                    <th scope="row">
                                        <div class="flex w-full items-center justify-center">
                                            <vs-checkbox :id="'cor-check-'+cor.codigo" v-model="produtoAdd.produtoAddCores[indexCor].ativo" @input="disabledCorTamanho(produtoAdd, cor, 1)"></vs-checkbox>
                                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="cor.imagemCor" size="36px" v-if="cor.imagemCor" style="border: 0.9px solid #7b7b7b;"/>
                                            <span class="ml-1">{{cor.codigo}}</span>                                                
                                        </div>
                                    </th>
                                    <td v-for="(tamanho, indexTamanho) in getTamanhosProduto" :key="indexTamanho" style="padding: 0.3rem;">
                                        <div v-if="produtoAdd.cores[indexCor].tamanhos[indexTamanho].ativo && tamanho.ativo &&  produtoAdd.produtoAddCores[indexCor].ativo">
                                            <input 
                                                type="number" 
                                                :class="'input-quantidade-tam-'+tamanho.codigo+ ' input-quantidade-cor-'+cor.codigo" 
                                                v-model="produtoAdd.produtoAddCores[indexCor].produtoAddTamanhos[indexTamanho].quantidade" 
                                                class="form-control" 
                                                style="margin-top: 0rem;min-width: 5rem;padding: 1px 4px;"/>
                                            <div class="produto-add-button">
                                                <feather-icon 
                                                    icon="MinusIcon" 
                                                    svgClasses='h-4 w-4' 
                                                    class="produto-add-button-menos" 
                                                    @click="menosTamanho(indexCor, indexTamanho)"
                                                />
                                                <feather-icon 
                                                    icon="PlusIcon" 
                                                    svgClasses='h-4 w-4' 
                                                    class="produto-add-button-mais"  
                                                    @click="maisTamanho(indexCor, indexTamanho)"
                                                />
                                            </div>
                                        </div>
                                        <div v-else>
                                            <input type="number" class="form-control" placeholder="Inativado" disabled style="margin-top: 0.6rem; min-width: 5rem;"/>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="flex w-full items-center justify-center">
                                            <strong>{{getTotalPecasCor(produtoAdd.produtoAddCores[indexCor])}}</strong>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th><strong>Totais</strong></th>
                                    <th v-for="(tamanho, indexTamanho) in getTamanhosProduto" :key="indexTamanho">
                                        <div class="flex w-full items-center justify-center">
                                            <strong>{{getTotalPecasTamanho(tamanho)}}</strong>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="flex w-full items-center justify-center">
                                            <strong>{{getTotalPecas()}}</strong>
                                        </div>
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </b-card-body>
        </b-collapse>
    </div>    
</template>    
<script>

import _ from 'lodash'
import Storage from '../utils/storage'
import UtilMask from '../utils/utilMask'

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
        openItems: false,
        grupoCliente: null,
    }),
    computed: {
        getCoresProduto() {
            return this.produtoAdd.cores;
        },
        getTamanhosProduto() {
            return this.produtoAdd.produtoLabelTamanhos;
        },
        getPreco() {
            const percentual = _.toNumber(this.grupoCliente.porcentagem);
            const precoProduto = this.produtoAdd.cores[0].precoVenda;
            const preco = _.round(precoProduto + ((percentual/100) * precoProduto), 2)
            return UtilMask.getMoney(preco);
        }
    },
    methods: {
        // 2-tamanho, 1-cor
        disabledCorTamanho(produto, corTamanho, tipo) {
            if(tipo === 2) {
                for (let indexCor = 0; indexCor < this.produtoAdd.produtoAddCores.length; indexCor++) {
                    const cor = this.produtoAdd.produtoAddCores[indexCor];
                    for (let indexTamanho = 0; indexTamanho < cor.produtoAddTamanhos.length; indexTamanho++) {
                        const tamanho = cor.produtoAddTamanhos[indexTamanho];
                        if (tamanho.codigo === corTamanho.codigo) {
                            tamanho.ativo = corTamanho.ativo;
                            // this.menosTamanho(indexCor, indexTamanho);
                            this.getTotalPecas();
                        }
                    }
                }
            }
            this.$forceUpdate();
        },
        criaTamanho(indexCor, indexTamanho) {
            const tamanho = this.produtoAdd.produtoAddCores[indexCor].produtoAddTamanhos[indexTamanho];
            tamanho.ref = this.produtoAdd.referencia;
            tamanho.cor = this.produtoAdd.cores[indexCor].idCor;
            tamanho.idProduto = this.produtoAdd.cores[indexCor].idProduto;
            tamanho.idSegmento = this.produtoAdd.segmento;
            return tamanho
        },
        menosTamanho(indexCor, indexTamanho) {
            const tamanho = this.criaTamanho(indexCor, indexTamanho);
            tamanho.quantidade = _.isNil(tamanho.quantidade) ? 0 : (tamanho.quantidade === 0 ? 0 :tamanho.quantidade-1);
            this.$emit('atualiza-qtde-itens', _.clone(tamanho));
            this.$forceUpdate();
        },
        maisTamanho(indexCor, indexTamanho) {
            const tamanho = this.criaTamanho(indexCor, indexTamanho);
            tamanho.quantidade = _.isNil(tamanho.quantidade) ? 1 : parseInt(tamanho.quantidade)+1;
            this.$emit('atualiza-qtde-itens', _.clone(tamanho));
            this.$forceUpdate();
        },
        getTotalPecasCor(cor) {
            let totalCor = 0;
            if (cor.ativo) {
                for (let index = 0; index < cor.produtoAddTamanhos.length; index++) {
                    const tamanho = cor.produtoAddTamanhos[index];
                    if (tamanho.ativo && tamanho.quantidade) {
                        totalCor = totalCor + parseInt(tamanho.quantidade);
                    }
                }
                return totalCor;
            } 
        },
        getTotalPecasTamanho(tamanho) {
            let totalTamanho = 0;
            if (tamanho.ativo) {
                for (let index = 0; index < this.produtoAdd.produtoAddCores.length; index++) {
                    const cor = this.produtoAdd.produtoAddCores[index];
                    if (cor.ativo) {
                        for (let index2 = 0; index2 < cor.produtoAddTamanhos.length; index2++) {
                            const tamanhoCor = cor.produtoAddTamanhos[index2];
                            if (tamanho.codigo === tamanhoCor.codigo && tamanhoCor.quantidade) {
                                totalTamanho = totalTamanho + parseInt(tamanhoCor.quantidade);
                            }
                        }
                    }
                }
                return totalTamanho;
            }
        },
        getTotalPecas() {
            let totalCorTamanho = 0;
            for (let index = 0; index < this.produtoAdd.produtoAddCores.length; index++) {
                const cor = this.produtoAdd.produtoAddCores[index];
                if (cor.ativo) {
                    for (let index2 = 0; index2 < cor.produtoAddTamanhos.length; index2++) {
                        const tamanho = cor.produtoAddTamanhos[index2];
                        if (tamanho.ativo && tamanho.quantidade) {
                            totalCorTamanho = parseInt(totalCorTamanho) + parseInt(tamanho.quantidade);
                        }
                    }
                }
            }
            return totalCorTamanho;
        }
    },
    created() {
        this.grupoCliente = Storage.getGrupoCarrinho();
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