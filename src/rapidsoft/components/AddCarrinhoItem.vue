<template>
    <div class="parentx">
    <div class="vx-row items-center justify-center" v-if="this.cliente.nome">
                    <div class="truncate">
                        <h6>CLIENTE: {{this.cliente.nome}}</h6>
                    </div>
                    </div>
        <b-card-header header-tag="header" class="p-1" role="tab">
            <vx-card class="w-full">
                <div slot="no-body">
                    <div class='vx-row flex pr-6 pl-6'>
                        <div class="vx-col w-full sm:w-2/3 flex" style="padding: 8px;">
                            <vs-avatar class="mr-23" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-package" size="30px" />
                            <div class="truncate">
                                <h5 class="mt-3 font-bold">{{produtoAdd.referencia +' - '+ produtoAdd.nome}}</h5>
                            </div>
                        </div>
                        <div class="vx-col w-full sm:w-1/3 flex" style="padding: 8px;">
                            <vs-avatar class="mr-23" @click="popupPreco=true" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-dollar-sign" size="30px" />
                            <div class="truncate">
                                <h5 class="mt-3 font-bold">Preço</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </b-card-header>
        <b-collapse :id="idColapse" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
                <div class="row">
                    <div class="table-responsive">    
                        <table class="table table-striped table-bordered" id="table-add-produto-a">
                            <thead>
                                <tr>
                                    <th scope="col">Replicar</th>
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
                                    <td>
                                        <div class="flex w-full items-center justify-center">
                                            <vs-button 
                                                v-if="getCoresProduto.length > 1"
                                                type="filled" 
                                                size="small" 
                                                icon-pack="feather" 
                                                color="danger" 
                                                icon="icon-repeat" 
                                                @click="replicarGrade(indexCor)"
                                            />
                                            <vs-button v-else disabled type="filled" size="small" icon-pack="feather" color="danger" icon="icon-repeat" />
                                        </div>
                                    </td>
                                    <th scope="row">
                                        <div class="flex w-full items-center justify-center">
                                            <vs-checkbox :id="'cor-check-'+cor.codigo" v-model="produtoAdd.produtoAddCores[indexCor].ativo" @input="disabledCorTamanho(produtoAdd, cor, 1)"></vs-checkbox>
                                            <vs-avatar class="m-0" :id="'icon-cor-'+cor.nome" :src="cor.imagemCor" size="36px" v-if="cor.imagemCor" style="border: 0.9px solid #7b7b7b;"/>
                                            <span class="ml-1">{{cor.codigo}}</span>                                                
                                        </div>
                                    </th>
                                    <td v-for="(tamanho, indexTamanho) in getTamanhosProduto" :key="indexTamanho" style="padding: 0.3rem;">
                                        <div v-if="(produtoAdd.cores[indexCor].tamanhos[indexTamanho] && produtoAdd.cores[indexCor].tamanhos[indexTamanho].ativo) && tamanho.ativo && produtoAdd.produtoAddCores[indexCor].ativo">
                                            <input 
                                                @input="atualizarGrade(indexCor,indexTamanho)"
                                                type="number"
                                                :class="'input-quantidade-tam-'+tamanho.codigo+ ' input-quantidade-cor-'+cor.codigo" 
                                                v-model="produtoAdd.produtoAddCores[indexCor].produtoAddTamanhos[indexTamanho].quantidade" 
                                                class="form-control"
                                                style="margin-top: 0rem;min-width: 5rem;padding: 1px 4px;"
                                            />
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
                                    <th>
                                        
                                    </th>
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
                    <div class="flex w-full items-center justify-center">
                        <vs-button 
                            type="filled" 
                            icon-pack="feather" 
                            color="danger" 
                            icon="icon-check-square" 
                            @click="replicarGradeRef()"
                            class="w-full"
                            v-if="this.totalProdutos > 1"
                        >
                            Replicar Grade Para Todas Referências
                        </vs-button>
                    </div>
                </div>
            </b-card-body>
            
            <vs-popup title="Preço" :active.sync="popupPreco" :button-close-hidden="false">
            <table style="width:100%" class="border-collapse">
                <tr>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Ref.</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Nome</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sell In</th>
                </tr>
                <tr v-if="produtoAdd">
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{produtoAdd.referencia}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{produtoAdd.nome}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-right">{{getPreco}}</td>
                    
                </tr>
            </table>
        </vs-popup>
        </b-collapse>
 

    </div>    
</template>    
<script>

import _ from 'lodash';
import Storage from '../utils/storage';
import ProdutoUtils from '../utils/produtoUtils';
import UtilMask from '../utils/utilMask';

export default {
    name: 'add-carrinho-item',
    model: {
        prop: 'produtoAdd',
    },
    props: {
        produtoAdd: {
            type: Object,
            required: true,
        },
        quantRef: {
            type: Object,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        idColapse: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        totalProdutos: {
            type: Number,
            required: true,
        }
    },
    components: {
        
    },
    data: () => ({
        maxHeight: '0px',
        openItems: false,
        grupoCliente: null,
        gradeRef: [],
        cliente:null,
        limitesExcedidos: [],
        popupPreco: false,
    }),
    computed: {
        getCoresProduto() {
            return this.produtoAdd.cores;
        },
        getTamanhosProduto() {
            return _.orderBy(this.produtoAdd.produtoLabelTamanhos, ['seq'], ['asc'])
        },
        getPreco() {
            return UtilMask.getMoney(ProdutoUtils.calcularPreco(this.produtoAdd.cores[0]));
        }
    },
    methods: {
        // 2-tamanho, 1-cor
        replicarGradeRef() {
            this.$emit('replica-todas-grades', this.index,  this.produtoAdd);
        },
        replicarGrade(indexCor) {
            const listaBaseGrade2 = this.produtoAdd.produtoAddCores[indexCor].produtoAddTamanhos.reduce((grade, tamanho) => {
				grade[tamanho.codigo] = tamanho.quantidade ? tamanho.quantidade : 0;
				return grade;
            }, {});
            
            for (let i = 0; i < this.produtoAdd.cores.length; i++) {
                this.produtoAdd.cores[i].tamanhos.map((itemTamanho, indexTamanho) => {
                    itemTamanho.quantidade = parseInt(listaBaseGrade2[itemTamanho.codigo]);
                    this.atualizarGrade(i,indexTamanho);
                });
            } 
        },
        atualizarGrade(indexCor, indexTamanho) {
            const tamanho = this.criaTamanho(indexCor, indexTamanho);
            tamanho.quantidade = _.isNil(tamanho.quantidade) ? 0 : (Number(tamanho.quantidade) === 0 ? 0 :Number(tamanho.quantidade));
            if (tamanho.quantidade > 10) {
                const corTamanho = _.toString(indexCor) + _.toString(indexTamanho);
                if (!_.find(this.limitesExcedidos, (corTamanhoByList) => { return corTamanho == corTamanhoByList})) {
                    this.limitesExcedidos.push(corTamanho);
                    this.alertaLimiteItens();
                }
            }
            this.$emit('atualiza-qtde-itens', _.clone(tamanho));
            this.$forceUpdate();
        },
        disabledCorTamanho(produto, corTamanho, tipo) {
            if (tipo === 1) {
                corTamanho.tamanhos.map((cor) => {
                    cor.quantidade = 0;
                    cor.ativo = corTamanho.ativo;
                    cor.ativo = cor.fixadoAtivo;
                    this.getTotalPecas();
                });
            } else {
                produto.produtoAddCores.map((produtoCor) => {
                    produtoCor.produtoAddTamanhos.map((produtoTamanho) => {
                        if (produtoTamanho.codigo === corTamanho.codigo) {
                            produtoTamanho.ativo = corTamanho.ativo;
                            produtoTamanho.ativo = produtoTamanho.fixadoAtivo;
                            produtoTamanho.quantidade = produtoTamanho.codigo == corTamanho.codigo ? 0 : produtoTamanho.quantidade;
                            this.getTotalPecas();
                        }
                    });
                });    
            }
            this.$forceUpdate();
        },
        criaTamanho(indexCor, indexTamanho) {
            const tamanho = this.produtoAdd.produtoAddCores[indexCor].produtoAddTamanhos[indexTamanho];
            tamanho.referencia = this.produtoAdd.referencia;
            tamanho.cor = this.produtoAdd.cores[indexCor].idCor;
            tamanho.precoCusto = this.produtoAdd.cores[indexCor].precoCusto;
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
            if (tamanho.quantidade > 10) {
                const corTamanho = _.toString(indexCor) + _.toString(indexTamanho);
                if (!_.find(this.limitesExcedidos, (corTamanhoByList) => { return corTamanho == corTamanhoByList})) {
                    this.limitesExcedidos.push(corTamanho);
                    this.alertaLimiteItens(); 
                }
            }
            this.$emit('atualiza-qtde-itens', _.clone(tamanho));
            this.$forceUpdate();
        },
        alertaLimiteItens() {
            this.$vs.dialog({
                color:'warning',
                title: `Atenção`,
                text: 'Você adicionou mais do que 10 peças desse item!',
                acceptText:'OK'
            });
        },
        getTotalPecasCor(cor) {
            if (cor.ativo) {
                return cor.produtoAddTamanhos.reduce((totalCor, tamanho) => {
                    if (tamanho.ativo && tamanho.quantidade) {
                        return totalCor + parseInt(tamanho.quantidade);
                    } else {
                        return totalCor;
                    }
                }, 0)
            } else {
                return 0;
            }
        },
        getTotalPecasTamanho(tamanho) {
            if (tamanho.ativo) {
                return this.produtoAdd.produtoAddCores.reduce((totalTamanho, cor ) => {
                    totalTamanho = totalTamanho ? totalTamanho : 0;
                    if (cor.ativo) {
                        return totalTamanho + cor.produtoAddTamanhos.reduce((totalCor, tamanhoCor) => {
                            if (tamanho.codigo === tamanhoCor.codigo && tamanhoCor.quantidade) {
                                return Number(totalCor) + parseInt(tamanhoCor.quantidade);
                            } else {
                                return Number(totalCor);
                            }
                        }, 0)
                    }
                }, 0);
            } else {
                return 0;
            }
        },
        getTotalPecas() {
            return this.produtoAdd.produtoAddCores.reduce((totalTamanho, cor ) => {
                if (cor.ativo) {
                    return totalTamanho + cor.produtoAddTamanhos.reduce((totalCor, tamanho) => {
                        if (tamanho.ativo && tamanho.quantidade) {
                            return totalCor + parseInt(tamanho.quantidade);
                        } else {
                            return totalCor;
                        }
                    }, 0)
                }
            }, 0);
        },

        replicarGradeRefs(quantidades) {
            for (let indexCor = 0; indexCor < this.produtoAdd.produtoAddCores.length; indexCor++) {
                const corAdd = this.produtoAdd.produtoAddCores[indexCor];
                if (quantidades[corAdd.codigo]) {
                    for (let indexTamanho = 0; indexTamanho < corAdd.produtoAddTamanhos.length; indexTamanho++) {
                        const tamanhoAdd = corAdd.produtoAddTamanhos[indexTamanho];
                        if (quantidades[corAdd.codigo][tamanhoAdd.codigo]) {
                            tamanhoAdd.quantidade = parseInt(quantidades[corAdd.codigo][tamanhoAdd.codigo]);
                            this.atualizarGrade(indexCor, indexTamanho);
                        }
                    }
                }
            }
        }
    },
    created() {
        this.grupoCliente = Storage.getGrupoCarrinho();
        this.cliente = Storage.getClienteCarrinho();
    },
    mounted() {
        
    }
}
</script>    

<style lang="scss">

.produto-add-button {
    margin-top: 12px;
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