<template>
    <div class="parentx">
        <div class="vx-row flex w-full items-center justify-start" style="margin-bottom:20px">
           <div clas="vx-col flex w-full items-center justify-start">
            <b-dropdown text="Ações" split size="sm" variant="danger" class="m-1">
                <b-dropdown-item>
                    <span class="flex items-center">
                        <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                        <span @click="confirmacaoDeletarItem()">Deletar Itens Selecionados</span>
                    </span>
                </b-dropdown-item>
                <div v-if="getArrayEmbarques.length > 0">
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-text>
                        <feather-icon icon="RefreshCwIcon" svgClasses="h-4 w-4" class="mr-2" />
                        Mover Itens Selecionados
                    </b-dropdown-text>
                    <b-dropdown-item v-for="(embarque, indexEmbarque) in getArrayEmbarques" :key="indexEmbarque">
                        <span class="flex items-center mt-2">
                            <span @click="moverItemEmbarque(embarque.id)">{{embarque.nome}}</span>
                        </span>
                    </b-dropdown-item>
                </div>
            </b-dropdown>
            </div>     
              <div class="vx-col items-center justify-center" v-if="this.cliente.nome">
                    <div class="truncate">
                        <h6>CLIENTE: {{this.cliente.nome}}</h6>
                    </div>
                    </div>   
   </div>
 
        
        <div role="tablist" v-if="produtosCarrinho.length > 0">
            <b-card no-body class="mb-1" v-for="(embarque, indexEmbarque) in getArrayEmbarquesProdutos" :key="indexEmbarque">
                <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle.accordion-1  v-b-toggle="'embarque'+embarque.id">
                    <h5 class="m-3 font-bold">{{embarque.nome}}</h5>
                    <vx-card class="w-full">
                        <div slot="no-body">
                            <div class='vx-row flex pr-6 pl-6'>
                                <div class="vx-col w-full sm:w-1/3 flex" style="padding: 8px;">
                                    <vs-avatar class="mr-23" @click="somaPreviaValores()" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-package" size="30px" />
                                    <div class="truncate">
                                        <h5 class="mt-3 font-bold">Peças: {{embarque.quantidade}}</h5>
                                    </div>
                                </div>
                                <div class="vx-col w-full sm:w-1/3 flex" style="padding: 8px;">
                                    <vs-avatar class="mr-3" @click="somaPreviaValores()" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-dollar-sign" size="30px" />
                                    <div class="truncate">
                                        <h5 class="mt-3 font-bold">Valor: {{embarque.totalBruto | money}}</h5>
                                    </div>
                                </div>
                                <div class="vx-col w-full sm:w-1/3 flex" style="padding: 8px;">
                                    <vs-avatar class="mr-3" @click="somaPreviaValores()" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-calendar" size="30px" />
                                    <div class="truncate">
                                        <h5 class="mt-3 font-bold">{{embarque.dataEmbarque | formatDate}}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vx-card>
                </b-card-header>
                <b-collapse :id="'embarque'+embarque.id" visible accordion="my-accordion" role="tabpanel">
                    <b-card-body style="background-color: rgba(0, 0, 0, 0.03); padding: 10px;">
                        <div class="flex carrinho-item" v-for="(produtoCor, indexItem) in getProdutosCarrinhoPorEmbarque(embarque.id)" :key="indexItem">
                            <div class="vx-col mx-3" style="justify-content:center;margin:auto">
                                <div class="flex w-full items-center justify-center">
                                    <vs-checkbox :id="produtoCor.idProduto" v-model="itensSelecionados" :vs-value="produtoCor" />
                                </div>
                            </div>
                            <div class="vx-col mx-1 w-1/6" style="justify-content:center; margin:auto">
                                <img
                                    :src="produtoCor.imagemPrincipal ? produtoCor.imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)"
                                    class="rounded m-2 responsive"
                                    style="max-width:70px;"
                                />
                            </div>
                            <div class="vx-col mx-1 w-1/6" style="justify-content:center;margin:auto">
                                <div class="vx-row">{{produtoCor.nome}}</div>
                                <div class="vx-row">Linha Fitness</div>
                                <div class="vx-row" style="font-weight:bold;">{{'Ref: ' + produtoCor.referencia}}</div>
                                <div class="vx-row" style="font-weight:bold;">{{'Cor: ' + produtoCor.nomeCor}}</div>
                            </div>
                            <div class="vx-col mx-6 w-3/6" style="justify-content:center; margin:auto">
                                <table>
                                    <thead class="border-solid">
                                        <th 
                                            style="background-color:#808080;color:white" 
                                            class="border-solid" 
                                            v-for="(tamanho, indexTamanho) in getTamanhosProduto(produtoCor.idProduto)"
                                            :key="indexTamanho + ' - ' + tamanho.sku"
                                        >
                                            {{tamanho.codigo}}
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                style="border-color:#808080;font-weight:bold"
                                                class="border-solid text-center"
                                                v-for="(tamanho, indexTamanho) in getTamanhosProduto(produtoCor.idProduto)"
                                                :key="indexTamanho + ' - ' + tamanho.sku">
                                            {{tamanho.quantidade}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>    
                            <div class="vx-col mx-2 w-1/6 float-right" style="justify-content:center;margin:auto">
                                <div class="vx-col text-center">
                                    <span style="font-weight:bold">Qntd: {{produtoCor.quantidade}}</span>
                                </div>
                                <div class="vx-row text-center justify-center">
                                    <span style="font-weight:bold">{{getAmountValueBuy(produtoCor.precoCusto, produtoCor.quantidade) | moneyy}}</span>
                                </div>
                            </div>
                            <div class="vx-col mx-1 w-1/6 float-right" style="justify-content:center; margin:auto;">
                                <feather-icon class="cursor-pointer" icon="EditIcon" svgClasses="w-6 h-6" @click.stop="setPopupAddProduto(produtoCor)"/>
                            </div>
                        </div>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>                
    </div>
</template>
<script>
// import _ from "lodash";
import Storage from "../../rapidsoft/utils/storage";
import ProdutoDB from "../../rapidsoft/db/produtoDB";
import ErrorDB from "../../rapidsoft/db/errorDB";

export default {
    name: 'carrinho-item',
    model: {
        prop: 'produtos',        
    },
    props: {
        segmento: {
            type: Object,
            required: true,
        },
        produtos: {
            type: Array,
            required: true,
        },
        embarques: {
            type: Object,
            required: true,
        }
    },
	data: () => ({
        dataAtual: new Date().getTime(),
        itensSelecionados: [],
        produtosCarrinho: [],
        cliente:null,    		
    }),
    watch: {
    },
	components: {
	},
	computed: {
        getArrayEmbarques() {
            const embarqueCarrinho = Object.values(this.embarques);
            const embarques = this.itensSelecionados.reduce((embarques, item) => {
                const embarque = embarqueCarrinho.find((embarque) => embarque.id === item.embarque);
                return embarques.concat(embarqueCarrinho.reduce((embarquesArray, emb) => {
                    if ((emb.dataInicio <= this.dataAtual || emb.dataFim >= this.dataAtual)
                            && (emb.dataInicio >= embarque.dataInicio || emb.dataFim <= embarque.dataFim)
                                    && emb.id != item.embarqueSelecionado) {
                                        embarquesArray.push(emb.id);
                    }
                    return embarquesArray;
                }, []))
            }, []);
            return embarqueCarrinho.filter((embarque) => embarques.some((emb) => emb === embarque.id));
        },
        getArrayEmbarquesProdutos() {
            return Object.values(this.embarques).filter((embarque) => {
                return this.produtosCarrinho.some((produto) => produto.embarqueSelecionado === embarque.id);
            });
        }
	},
    methods: {
		getTamanhosProduto(idProduto) {
			return this.produtosCarrinho.find((produto) => produto.idProduto === idProduto).tamanhos;
        },
		setPopupAddProduto(produto){
			ProdutoDB.getProdutoEdicaoCarrinho(produto).then((result) => {
                this.$emit('edicao-item-carrinho', result);
            });
		},
		getAmountValueBuy(valorCompra,totalQuantidade) {
            return valorCompra * totalQuantidade;
        },
        notification(titulo, mensagem, cor) {
            this.$vs.notify({
                title: titulo,
                text: mensagem,
                color: cor,
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            });
        },
        confirmacaoDeletarItem() {
            this.$vs.dialog({
                type:'confirm',
                color:'danger',
                title:'Deseja Remover?',
                text:'Você esta prestes a remover um item do carrinho. Deseja continuar?',
                accept:this.deleteItems,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
            });
        },
        montaMensagem(totalItens) {
            if (totalItens > 1) {
                return `Foram removidos ${totalItens} itens do carrinho!`
            } else {
                return `Foi removido ${totalItens} item do carrinho!`
            }
        },
		deleteItems() {
            const itensCarrinho = Storage.getCarrinhoItens();
            Storage.setCarrinhoItens(this.getProdutosListNew(itensCarrinho));
            this.produtosCarrinho = this.getProdutosListNew(this.produtosCarrinho);
            this.itensSelecionados = [];
            this.notification('Removido!',this.montaMensagem(this.itensSelecionados.length),'primary');
            this.$forceUpdate();
        },
        getProdutosListNew(produtos){
            return produtos.filter(produto => {
                return !this.itensSelecionados.some(item => {
                    return produto.idProduto === item.idProduto;
                });
            });
        },
        getProdutosCarrinhoPorEmbarque(idEmbarque) {
            return this.produtosCarrinho.filter((produto) => {
                return produto.embarqueSelecionado === idEmbarque;
            });
        },
        setEmbarqueCarrinho(idEmbarque) {
            let itensCarrinho = Storage.getCarrinhoItens();
            itensCarrinho = itensCarrinho.map((produto) => {
                if (this.itensSelecionados.some((item) => item.idProduto === produto.idProduto)) produto.embarqueSelecionado = idEmbarque;                
                return produto;
            });
            Storage.setCarrinhoItens(itensCarrinho);
            this.itensSelecionados = [];
        },
        recalculaTotais() {
            const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
            for (const id in this.embarques) {
                if (this.embarques.hasOwnProperty(id)) {
                    this.embarques[id].quantidade = this.produtosCarrinho.reduce((total, produto) => {
                        if (produto.embarqueSelecionado == id) total = total + produto.quantidade;
                        return total;
                    }, 0);

                    this.embarques[id].totalBruto = this.produtosCarrinho.reduce((total, produto) => {
                        if (produto.embarqueSelecionado == id) total = total + ((produto.precoCusto + ((percentual/100) * produto.precoCusto)) * produto.quantidade);
                        return total;
                    }, 0);
                }
            }
        },
        moverItemEmbarque(idEmbarque) {
            this.produtosCarrinho = this.produtosCarrinho.map((produto) => {
                if (this.itensSelecionados.some((item) => item.idProduto === produto.idProduto)) produto.embarqueSelecionado = idEmbarque;
                return produto;
            });
            this.setEmbarqueCarrinho(idEmbarque);
            this.recalculaTotais();
            this.notification('Movidos!', 'Itens Selecionados foram movidos para o Embarque','success');
        }
	},
	beforeCreate() {		                
    },
	created() {
        try {
            this.produtosCarrinho = this.produtos;
            this.cliente = Storage.getClienteCarrinho();
            
            this.recalculaTotais();
        } catch (error) {
            console.log(error);
        }
	},
    mounted() {        
    },
	async errorCaptured(err, vm, info) {
        await ErrorDB._criarLog({ err, vm, info });
        return true;
    }

};
</script>

<style lang="scss">

.carrinho-item {
    padding: 2px;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3); 
    margin-top: 3px;
    margin-bottom: 6px;
    background-color: #fff;
}

</style>