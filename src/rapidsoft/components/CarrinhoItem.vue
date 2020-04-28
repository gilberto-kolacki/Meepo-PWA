<template>
    <div class="parentx">
        <div class="flex flex-wrap" style="margin-bottom:20px;">
            <div class="w-1/5">
                <div clas="vx-col flex items-center justify-start" style="margin-top:1rem;">
                    <b-dropdown text="Ações" size="sm" variant="danger" class="m-1">
                        <b-dropdown-item>
                            <span class="flex items-center">
                                <feather-icon icon="CheckSquareIcon" svgClasses="h-4 w-4" class="mr-2" />
                                <span @click="selecionarTodos()">Selecionar Todos</span>
                            </span>
                        </b-dropdown-item>
                        <div v-if="itensSelecionados.length">
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item>
                                <span class="flex items-center">
                                    <feather-icon icon="XSquareIcon" svgClasses="h-4 w-4" class="mr-2" />
                                    <span @click="removerSelecao()">Desmarcar Seleção</span>
                                </span>
                            </b-dropdown-item>
                        </div>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item>
                            <span class="flex items-center">
                                <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                                <span @click="confirmacaoDeletarItem()">Deletar Itens Selecionados</span>
                            </span>
                        </b-dropdown-item>
                        <div v-if="itensSelecionados.length">
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item>
                                <span class="flex items-center">
                                    <feather-icon icon="PackageIcon" svgClasses="h-4 w-4" class="mr-2" />
                                    <span @click="criarNovoEmbarque()">Criar Embarque</span>
                                </span>
                            </b-dropdown-item>
                        </div>
                        <div v-if="getArrayEmbarquesMover.length > 0">
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-text>
                                <feather-icon icon="RefreshCwIcon" svgClasses="h-4 w-4" class="mr-2" />
                                Mover Itens Selecionados
                            </b-dropdown-text>
                            <b-dropdown-item v-for="(embarque, indexEmbarque) in getArrayEmbarquesMover" :key="indexEmbarque">
                                <span class="flex items-center mt-2">
                                    <span @click="moverItemEmbarque(embarque)">{{embarque.nome +' - '+ embarque.seq}}</span>
                                </span>
                            </b-dropdown-item>
                        </div>
                    </b-dropdown>
                </div>     
            </div>     
            <div class="w-4/5">
                <div class="flex flex-wrap">
                    <div class="w-1/4">
                        <div class="mr-2">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary mr-2">
                                <label for="cpfCnpj" class="vs-input--label">Cliente</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="cliente.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-3/4">
                        <vs-input v-validate="'required'" id="nomeCliente" name="nomeCliente" v-model="cliente.nome" disabled class="w-full input-line-group-rapid input-group-rapid" />
                        <vs-button
                            color="primary"
                            type="filled"
                            icon-pack="feather"
                            class="w-full btn-line-group-rapid"
                            icon="icon-search"                                    
                            @click.stop="abrirPesquisaCliente()"
                        ></vs-button>
                    </div>
                </div>
            </div>   
        </div>
        
        <div role="tablist" v-if="produtosCarrinho.length > 0">
            <b-card no-body class="mb-1" v-for="(embarque, indexEmbarque) in getArrayEmbarquesProdutos" :key="indexEmbarque">
                <b-card-header header-tag="header" class="p-1" role="tab" v-b-toggle="'embarque-'+embarque.id+'-'+embarque.seq">
                    <h5 class="m-3 font-bold">{{embarque.id}} - {{embarque.nome}}. Seq: {{embarque.seq}}</h5>
                    <vx-card class="w-full">
                        <div slot="no-body">
                            <div class='vx-row flex pr-6 pl-6'>
                                <div class="vx-col w-full sm:w-1/5 flex" style="padding: 8px;">
                                    <vs-avatar class="mr-23" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-package" size="30px" />
                                    <div class="truncate">
                                        <h5 class="mt-3 font-bold">{{embarque.quantidade}}</h5>
                                    </div>
                                </div>
                                <div class="vx-col w-full sm:w-2/5 flex" style="padding: 8px;">
                                    <vs-avatar class="mr-3" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-dollar-sign" size="30px" />
                                    <div class="truncate">
                                        <h5 class="mt-3 font-bold">{{embarque.totalBruto | moneyy}}</h5>
                                    </div>
                                </div>
                                <div class="vx-col w-full sm:w-2/5 flex" style="padding: 8px;">
                                    <vs-avatar class="mr-3" color="rgb(123, 123, 123)" icon-pack="feather" icon="icon-calendar" size="30px" />
                                    <div class="truncate">
                                        <h5 class="mt-3 font-bold">{{embarque.dataEmbarque | formatDate}}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vx-card>
                </b-card-header>
                <b-collapse :id="'embarque-'+embarque.id+'-'+embarque.seq" visible accordion="my-accordion" role="tabpanel">
                    <b-card-body style="background-color: rgba(0, 0, 0, 0.03); padding: 10px;">
                        <div class="flex carrinho-item" v-for="(produtoCor, indexItem) in getProdutosCarrinhoPorEmbarque(embarque)" :key="indexItem">
                            <div class="vx-col mx-3" style="justify-content:center;margin:auto">
                                <div class="flex w-full items-center justify-center">
                                    <vs-checkbox :id="produtoCor.idProduto" v-model="itensSelecionados" :vs-value="produtoCor" />
                                </div>
                            </div>
                            <div class="vx-col mx-1 w-1/6" style="justify-content:center; margin:auto">
                                <img 
                                    :src="produtoCor.imagemPrincipal ? produtoCor.imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)"
                                    class="rounded m-2 responsive" style="max-width:70px;" 
                                />
                            </div>
                            <div class="vx-col mx-1 w-1/6" style="justify-content:center;margin:auto; max-width: 7rem;">
                                <div class="vx-row">{{produtoCor.nome}}</div>
                                <div class="vx-row" style="font-weight:bold;">{{'Ref: ' + produtoCor.referencia}}</div>
                                <div class="vx-row" style="font-weight:bold;">{{'Cor: ' + produtoCor.nomeCor}}</div>
                            </div>
                            <div class="vx-col mx-6 w-3/6" style="justify-content:center; margin:auto; min-width: 6.5rem;">
                                <table>
                                    <thead class="border-solid">
                                        <th class="grade-tam-prod-title" 
                                            v-for="(tamanho, indexTamanho) in getTamanhosProduto(produtoCor.idProduto)" :key="indexTamanho + ' - ' + tamanho.sku">
                                            {{tamanho.codigo}}
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="grade-tam-prod-qtde"
                                                v-for="(tamanho, indexTamanho) in getTamanhosProduto(produtoCor.idProduto)" :key="indexTamanho + ' - ' + tamanho.sku">
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
                                    <span style="font-weight:bold">{{getValorTotalCor(produtoCor) | moneyy}}</span>
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
        <!-- Agrupador de Linhas -->
		<b-card no-body class="mb-1" v-for="(linha, indexCat) in totalizadorLinhas" :key="indexCat">
			<b-card-header header-tag="header" class="p-1" role="tab"  v-b-toggle="'linha-'+linha.id">
				<span class="font-bold card-header-linhas">+ {{linha.nome}}: {{getQuantidadeCat(linha)}} </span>
			</b-card-header>
			<b-collapse :id="'linha-'+linha.id" :ref="'embarque-'+linha.id">
				<b-card-body style="padding: 5px;">
					<table class="table-linhas">
						<thead class="border-solid">
							<th class="grade-tam-prod-title" v-for="(tamanho, indexTamanho) in getTamanhosItens(linha)" :key="indexTamanho + ' - ' + tamanho.codigo">
								{{tamanho.codigo}}
							</th>
						</thead>
						<tbody>
							<tr>
								<td class="grade-tam-prod-qtde" v-for="(tamanho, indexTamanho) in getTamanhosItens(linha)" :key="indexTamanho + ' - ' + tamanho.codigo">
									{{tamanho.quantidade}}
								</td>
							</tr>
						</tbody>
					</table>
				</b-card-body>
			</b-collapse>
		</b-card>
		<b-card no-body class="mb-1">
			<b-card-header header-tag="header" class="p-1" role="tab">
				<span class="font-bold card-header-linhas">Total peças: {{this.getTotalPecas}}</span>
			</b-card-header>
		</b-card>
		<b-card no-body class="mb-1">
			<b-card-header header-tag="header" class="p-1" role="tab">
				<span class="font-bold card-header-linhas">Total: {{this.getTotalValor() | moneyyGrupo}}</span>
			</b-card-header>
		</b-card>

        <!-- Modal seleção de novo embarque -->
		<vs-popup title="Selecione o embarque" :active.sync="popupNovoEmbarque" :button-close-hidden="false" v-if="this.embarquesNovos.length > 0">
            <table style="width:100%" class="border-collapse">
                <tr>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Embarque</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light text-center">A partir de</th>
                    <th class="p-2 border border-solid d-theme-border-grey-light">Sel.</th>
                </tr>
                <tr v-for="(embarque, indexEmbarque) in this.embarquesNovos" :key="indexEmbarque">
                    <td class="p-2 border border-solid d-theme-border-grey-light">{{embarque.nome}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light text-center">{{embarque.dataInicio | formatDate}}</td>
                    <td class="p-2 border border-solid d-theme-border-grey-light">
						<div class="flex w-full items-center justify-center">
                            <vs-button color="success" type="filled" size="small" icon-pack="feather" class="w-full" icon="icon-check" @click.stop="gerarNovoEmbarque(embarque)"></vs-button>
                        </div>
					</td>
                </tr>      
            </table>
        </vs-popup>
    </div>    
</template>
<script>

import Storage from "../../rapidsoft/utils/storage";
import ProdutoDB from "../../rapidsoft/db/produtoDB";
import CarrinhoDB from "../../rapidsoft/db/carrinhoDB";
import ErrorDB from "../../rapidsoft/db/errorDB";
import LinhaDB from "../../rapidsoft/db/linhaDB";
import EmbarqueDB from "../../rapidsoft/db/embarqueDB";

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
        cliente: {
            type: Object,
            required: true,
        }
    },
	data: () => ({
        dataAtual: new Date().getTime(),
        itensSelecionados: [],
        produtosCarrinho: [],
        totalizadorLinhas: [],
        embarques: [],
        embarquesNovos: [],
        popupNovoEmbarque: false,
    }),
    watch: {
        cliente() {}
    },
	components: {
	},
	computed: {
        getValueEmbarques() {
            return [...this.embarques];
        },
        getArrayEmbarquesProdutos() {
            const percentual = Storage.getGrupoCarrinho().porcentagem;
            const arrayEmbarquesProdutos = this.lodash.orderBy(this.produtosCarrinho.reduce((arrayEmbarquesProdutos, produto) => {
                const index = arrayEmbarquesProdutos.findIndex((embarque) => this.isEqualsEmbarque(embarque, produto));
                if (index >= 0) {
                    const embarque = {...arrayEmbarquesProdutos[index]};
                    embarque.quantidade = embarque.quantidade + produto.quantidade;
                    embarque.totalBruto = embarque.totalBruto + ((produto.precoCusto + ((percentual/100) * produto.precoCusto)) * produto.quantidade);
                    arrayEmbarquesProdutos[index] = embarque;
                } else {
                    const embarque = {...this.getValueEmbarques.find((embarque) => embarque.id === produto.embarqueSelecionado.id)};
                    embarque.seq = produto.embarqueSelecionado.seq;
                    embarque.quantidade = produto.quantidade;
                    embarque.totalBruto = ((produto.precoCusto + ((percentual/100) * produto.precoCusto)) * produto.quantidade);
                    arrayEmbarquesProdutos.push(embarque);
                }
                return arrayEmbarquesProdutos;
            }, []), ['id', 'seq']);
            return arrayEmbarquesProdutos;
        },
        getArrayEmbarquesMover() {
            const embarques = this.itensSelecionados.reduce((embarques, item) => {
                return embarques.concat(this.getArrayEmbarquesProdutos.reduce((embarquesArray, embSel) => {
                    if ((embSel.dataInicio <= this.dataAtual || embSel.dataFim >= this.dataAtual)
                            && (this.maiorEmbarqueItensSelecionados.dataInicio <= embSel.dataInicio && this.maiorEmbarqueItensSelecionados.dataFim >= embSel.dataFim)
                                && !this.isEqualsEmbarque(embSel, item)) {
                                    embarquesArray.push({id: embSel.id, seq: embSel.seq});
                    }
                    return embarquesArray;
                }, []))
            }, []);
            return this.getArrayEmbarquesProdutos.filter((embarque) => embarques.some((emb) => emb.id === embarque.id && emb.seq === embarque.seq));
        },
        maiorEmbarqueItensSelecionados() {
            return this.itensSelecionados.reduce((embarque, item) => {
                const embSel = this.getValueEmbarques.find((embarque) => embarque.id === item.embarque);
                return (embarque == null || embSel.dataInicio > embarque.dataInicio) ? embSel : embarque;
            }, null);
        },        
        getTotalPecas() {
			return this.produtosCarrinho.reduce((qtdeTotal, item) => qtdeTotal + item.quantidade, 0);
		},
	},
    methods: {
        isEqualsEmbarque(embarque, produto) {
            return embarque.id === produto.embarqueSelecionado.id && embarque.seq === produto.embarqueSelecionado.seq ? true : false;
        },
        getTotalValor() {
			return this.produtosCarrinho.reduce((qtdeTotal, item) => qtdeTotal + (item.quantidade * item.precoCusto), 0);
		},
		getTamanhosItens(linha) {
			return linha.itens.reduce((tamanhosLinha, item) => {
				return tamanhosLinha.concat(item.tamanhos.reduce((tamanhos, tamanho) => {
					const indexTam = tamanhosLinha.findIndex((tam) => tam.codigo == tamanho.codigo);
					if (indexTam >= 0 ) tamanhosLinha[indexTam].quantidade = tamanhosLinha[indexTam].quantidade + tamanho.quantidade;
					else tamanhos.push({codigo: tamanho.codigo, quantidade: tamanho.quantidade});
					return tamanhos;
				}, []));
			}, []);
		},
		getQuantidadeCat(linha) {
			return linha.itens.reduce((qtdeTotal, item) => qtdeTotal + this.getQtdeTamItem(item), 0);
		},
		getQtdeTamItem(item) {
			return item.tamanhos.reduce((qtde, tamanho) => qtde + tamanho.quantidade, 0);
		},
		getTamanhosProduto(idProduto) {
            return this.lodash.orderBy(this.produtosCarrinho.find((produto) => produto.idProduto === idProduto).tamanhos, ['seq'], ['asc']);
        },
		setPopupAddProduto(produto){
			ProdutoDB.getProdutoEdicaoCarrinho(produto).then((result) => {
                this.$emit('edicao-item-carrinho', result);
            });
		},
		getValorTotalCor(produto) {
            const percentual = Storage.getGrupoCarrinho().porcentagem;
            const preco = produto.precoCusto * produto.quantidade;
            return preco + ((percentual/100) * preco);
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
            CarrinhoDB.getCarrinho().then((carrinho) => {
                carrinho.itens = this.getProdutosListNew(carrinho.itens);
                CarrinhoDB.setCarrinho(carrinho).then(() => {
                    if (carrinho.itens.length > 0) {
                        this.produtosCarrinho = this.getProdutosListNew(this.produtosCarrinho);
                        this.notification('Removido!', this.montaMensagem(this.itensSelecionados.length), 'primary');
                        this.itensSelecionados = [];
                        this.$forceUpdate();
                    } else {
                        this.$router.push({ name: 'home'});
                    }
                });
            });
        },
        selecionarTodos() {
            this.itensSelecionados = this.produtosCarrinho;
        },
        removerSelecao() {
            this.itensSelecionados = []
        },
        criarNovoEmbarque() {
            EmbarqueDB.getFromEmbarque(this.maiorEmbarqueItensSelecionados).then((result) => {
                this.embarquesNovos = result;
                this.popupNovoEmbarque = true;
            });
        },
        gerarNovoEmbarque(embarque) {
            embarque = {...embarque};
            if (this.getArrayEmbarquesProdutos.some((emb) => emb.id === embarque.id)) {
                embarque.seq = this.lodash.findLast(this.getArrayEmbarquesProdutos, (emb) => emb.id === embarque.id).seq+1;
            } else {
                this.embarques.push(embarque);
                embarque.seq = 1;
            }
            this.moverItemEmbarque(embarque);
            this.popupNovoEmbarque = false;
        },
        getProdutosListNew(produtos){
            return produtos.filter((produto) => {
                return !this.itensSelecionados.some((item) => {
                    return produto.idProduto === item.idProduto && this.lodash.isEqual(produto.embarqueSelecionado, item.embarqueSelecionado);
                });
            });
        },
        getProdutosCarrinhoPorEmbarque(embarque) {
            return this.produtosCarrinho.filter((produto) => produto.embarqueSelecionado.id === embarque.id && produto.embarqueSelecionado.seq === embarque.seq);
        },
        atualizaEmbarqueSelecioando(produtos, embarqueSelecionado) {
            return produtos.map((produto) => {
                if (this.itensSelecionados.some((item) => item.idProduto === produto.idProduto)) produto.embarqueSelecionado = embarqueSelecionado;                
                return produto;
            });
        },
        setEmbarqueCarrinho(embarqueSelecionado) {
            CarrinhoDB.getCarrinho().then((carrinho) => {
                carrinho.itens = this.atualizaEmbarqueSelecioando(carrinho.itens, embarqueSelecionado);
                CarrinhoDB.setCarrinho(carrinho).then(() => {
                    this.itensSelecionados = [];
                });
            });
        },
        moverItemEmbarque(embarque) {
            const embarqueSelecionado = {id: embarque.id, seq: embarque.seq};
            this.produtosCarrinho = this.atualizaEmbarqueSelecioando(this.produtosCarrinho, embarqueSelecionado);
            this.setEmbarqueCarrinho(embarqueSelecionado);
            this.notification('Movidos!', 'Itens Selecionados foram movidos para o Embarque', 'success');
            this.$forceUpdate();
        },
        abrirPesquisaCliente() {
			this.$bvModal.show("popup-cliente-search");
        },
        buscaEmbarques(produtos) {
            return new Promise((resolve) => {
                EmbarqueDB.getEmbarquesCarrinhoSegmento(this.segmento, produtos).then((embarques) => {
                    this.embarques = embarques;
                    resolve();
                });
            });
        },
        buscaAgrupadorLinhas(carrinho) {
			return new Promise((resolve) => {
				const totLinhas = carrinho.reduce((linhasCarrinho, item) => {
					return linhasCarrinho.concat(item.linhas.reduce((linhas, linha) => {
						if (!linhasCarrinho.some((lin) => lin === linha)) linhas.push(linha)
						return linhas;
					}, []));
				}, []).reduce((totLinhas, lin) => {
					const linha = {id: lin};
					linha.itens = carrinho.reduce((totaisLinha, item) => {
						if (item.linhas.some((linhaItem) => linhaItem === linha.id)) {
							totaisLinha.push({
								idProduto: item.idProduto,
								preco: item.precoCusto,
								tamanhos: item.tamanhos.map((tamanho) => ({codigo: tamanho.codigo, quantidade: tamanho.quantidade}))
							});
						}
						return totaisLinha;
					}, []);
					totLinhas.push(linha)
					return totLinhas;
				}, []);
				LinhaDB.getArrayAgrupadoresLinhas(totLinhas).then((totalizadorLinhas) => {
					this.totalizadorLinhas = totalizadorLinhas;
					resolve();
				});
			});
		},
	},
	beforeCreate() {		                
    },
	created() {
        try {
            this.buscaEmbarques(this.produtos).then(() => {
                this.buscaAgrupadorLinhas(this.produtos).then(() => {
                    this.produtosCarrinho = this.produtos;
                });
            })
        } catch (error) {
            console.log(error);
            alert(error);
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

.grade-tam-prod-title {
    background-color:#808080;
    color:white;
    border-style: solid !important
}

.grade-tam-prod-qtde {
    border-color:#808080;
    font-weight:bold;
    text-align: center !important;
    border-style: solid !important
}

.carrinho-item {
    padding: 2px;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3); 
    margin-top: 3px;
    margin-bottom: 6px;
    background-color: #fff;
}

</style>