<template>
    <div v-if="showScreen">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-save" v-if="pedido.status == 1"  @click="finalizarPedido(pedido)" >Salvar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarPedido()" icon="icon-x">Voltar</vs-button>
        <b-tabs content-class="mt-5" justified>
            <b-tab  active lazy>
                <template v-slot:title>
                    <strong>
                        <feather-icon icon="FileTextIcon" style="color:warning;" class="cursor-pointer"/>
                        Capa
                    </strong>
                </template>
                <div class="my-6" v-if="this.pedido">
                    <div class="vx-row">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="3" vs-sm="3" vs-xs="3">
                            <vs-input label="Código" id="id" name="emailNfe" v-model="pedido.id" class="w-full" disabled />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="3" vs-sm="3" vs-xs="3">
                            <vs-input label="Status" id="status" name="emailNfe" v-model="getStatus" class="w-full" disabled />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="3" vs-sm="3" vs-xs="3">
                            <vs-input label="Data Embarque" id="dataEmbarque" name="dataEmbarque" v-model="getDataEmbarque" class="w-full" disabled />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="3" vs-sm="3" vs-xs="3">
                            <vs-input label="Total Líquido" id="totalLiquido" name="totalLiquido" v-model="getTotalLiquido" class="w-full" disabled />
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="2" vs-sm="3" vs-xs="12" >
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">CPF/CNPJ</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="pedido.cliente.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                            </div>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="9" vs-xs="12">
                            <vs-input v-validate="'required'" label="Nome" id="nome" name="nome" disabled v-model="pedido.cliente.nome" class="w-full" />
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="pedido.cliente.emailNfe" class="w-full" type="email" inputmode="email" :disabled="pedido.status > 1" />
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full">
                            <label for="estadosFiltro" class="vs-input--label">Endereço de entrega</label>
                            <v-select
                                id="endEntrega"
                                v-model="endEntregaSel"
                                :options="getEnderecosEntrega"
                                :clearable=false>
                                :disabled="pedido.status > 1"
                            </v-select>
                        </div>
                    </div>
                    
                    <vs-divider class="mb-0">Formas de Pagamento</vs-divider>
                    
                    <div class="vx-row flex justify-between" style="padding-left:25px;padding-right:25px;padding-top:10px">
                        <vs-col vs-type="flex" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desc. Volume" icon="icon-percent" v-model="pedido.desconto1" inputmode="decimal" icon-after disabled/>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desc. Showroom" icon="icon-percent" v-model="pedido.desconto2" inputmode="decimal" icon-after disabled/>
                        </vs-col>
                        <vs-col style="display:flex;justify-content: flex-end;" vs-lg="4" vs-sm="4" vs-xs="12">
                            <vs-input type="number" icon-pack="feather" label="Desc. Comercial" icon="icon-percent" v-model="pedido.desconto3" inputmode="decimal" icon-after disabled/>
                        </vs-col>
                    </div>
                
                    <div class="vx-row flex justify-between" style="margin-left:20px;margin-right:20px;padding-top:20px">
                        <vs-col vs-lg="5" vs-xs="12">
                            <div class="vx-row" style="justify-content: flex-start;">
                                <vs-checkbox v-model="pedido.pedidoParcial" :disabled="pedido.status > 1"></vs-checkbox>
                                <label>Aceita Pedido Parcial</label>
                            </div>
                            <div class="vx-row" style="justify-content: flex-start;">
                                <vs-checkbox v-model="pedido.antecipacaoPedido" :disabled="pedido.status > 1"></vs-checkbox>
                                <label>Aceita Antecipação do Pedido </label>
                            </div>
                        </vs-col>
                        <vs-col vs-lg="5" vs-sm="5" vs-xs="12">
                            <div class="vx-row" style="justify-content: flex-end;">
                                <label>Enviar Cópia Por Email </label>
                                <vs-checkbox v-model="pedido.copiaEmail" :disabled="pedido.status > 1"></vs-checkbox>
                            </div>
                        </vs-col>
                    </div>

                    <div class="vx-row mt-10" style="padding-right:25px;padding-left:25px">
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12">
                            <label style="font-size:smaller">Forma de Pagamento</label>
                            <v-select 
                                @input="setFormaDePagamento()"
                                id="formaPgto" 
                                style="width:100%" 
                                :clearable=false 
                                v-model="formaDePagamentoSelecionada" 
                                :options="getFormasPagto" 
                                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                                disabled
                            />
                        </vs-col>
                        <vs-col vs-lg="6" vs-sm="6" vs-xs="12" v-if="temCondicaoDePagamento" >
                            <label style="font-size:smaller">Condição de Pagamento</label>
                            <v-select
                                @input="setCondicaoDePagamento()"
                                id="condicaoPgto" 
                                style="width:100%" 
                                :clearable=false
                                v-model="condicaoDePagamentoSelecionada" 
                                :options="getCondicoesDePagamento" 
                                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                                disabled
                            />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-textarea v-model="pedido.observacao" style="margin-top:30px" label="Observação" height="100" :disabled="pedido.status > 1"/>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                            <vs-button 
                                v-if="pedido.status == 2"
                                class='w-full' 
                                color="danger" 
                                type="filled" 
                                icon-pack="feather" 
                                icon="icon-lock"
                                @click="mensagemMudarParaDigitacao(pedido)"
                            >
                                Bloquear Sincronização
                            </vs-button>
                            <vs-button 
                                v-else-if="pedido.status == 1"
                                class='w-full' 
                                color="success" 
                                type="filled" 
                                icon-pack="feather" 
                                icon="icon-unlock"
                                @click="mensagemMudarParaEnviar(pedido)"
                            > 
                              Finalizar Pedido
                            </vs-button>
                        </vs-col>
                    </div>
                </div>
            </b-tab>
            <b-tab>
                <template v-slot:title>
                    <strong>
                        <feather-icon icon="ServerIcon" style="color:warning;" class="cursor-pointer"/>
                        Itens
                    </strong>
                </template>
                <div class="parentx">
                    <div class="flex carrinho-item" v-for="(itemCor, indexItem) in itensPedido" :key="indexItem">            
                        <div class="vx-col mx-1 w-1/4" style="justify-content:center; margin:auto">
                            <img 
                                :src="itemCor.imagemPrincipal ? itemCor.imagemPrincipal : require(`@/assets/images/rapidsoft/no-image.jpg`)"
                                class="rounded m-2 responsive" style="max-width:80px;" 
                            />
                        </div>
                        <div class="vx-col mx-1 w-1/3" style="justify-content:center;margin:auto; max-width: 7rem;">
                            <div class="vx-row">{{itemCor.nome}}</div>
                            <div class="vx-row" style="font-weight:bold;">{{'Ref: ' + itemCor.referencia}}</div>
                            <div class="vx-row" style="font-weight:bold;">{{'Cor: ' + itemCor.cor}}</div>
                        </div>
                        <div class="vx-col mx-6 w-3/6" style="justify-content:center; margin:auto; min-width: 6.5rem; margin-right: 3.5rem !important">
                            <table>
                                <thead class="border-solid">
                                    <th class="grade-tam-prod-title">Tam</th>
                                    <th class="grade-tam-prod-title" v-for="(tamanho, indexTamanho) in itemCor.tamanhos" :key="indexTamanho">
                                        {{tamanho.codigo}}
                                    </th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="grade-tam-prod-qtde">Pçs</td>
                                        <td class="grade-tam-prod-qtde" v-for="(tamanho, indexTamanho) in itemCor.tamanhos" :key="indexTamanho">{{tamanho.quantidade}}</td>
                                    </tr>
                                    <tr>
                                        <td class="grade-tam-prod-abert">Aber</td>
                                        <td class="grade-tam-prod-abert" v-for="(tamanho, indexTamanho) in itemCor.tamanhos" :key="indexTamanho">{{tamanho.quantidadeAberto}}</td>
                                    </tr>
                                    <tr>
                                        <td class="grade-tam-prod-fatu">Fatu</td>
                                        <td class="grade-tam-prod-fatu" v-for="(tamanho, indexTamanho) in itemCor.tamanhos" :key="indexTamanho">{{tamanho.quantidadeFaturado}}</td>
                                    </tr>
                                    <tr>
                                        <td class="grade-tam-prod-canc">Canc</td>
                                        <td class="grade-tam-prod-canc" v-for="(tamanho, indexTamanho) in itemCor.tamanhos" :key="indexTamanho">{{tamanho.quantidadeCancelado}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>    
                        <div class="vx-col mx-2 w-1/6 float-right" style="justify-content:center;margin:auto">
                            <div class="vx-col text-center">
                                <span style="font-weight:bold">Qntd: {{itemCor.quantidade}}</span>
                            </div>
                            <div class="vx-row text-center justify-center">
                                <span style="font-weight:bold">{{getValorTotalCor(itemCor) | moneyy}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>

import vSelect from 'vue-select';
import FormaPagtoDB from "../../rapidsoft/db/formaPagtoDB";
import ProdutoDB from "../../rapidsoft/db/produtoDB";
import ErrorDB from '../../rapidsoft/db/errorDB'
import PedidoDB from "../../rapidsoft/db/pedidoDB";
import ClienteDB from "../../rapidsoft/db/clienteDB";
import StatusDB from "../../rapidsoft/db/statusDB";
import GrupoClienteDB from '../../rapidsoft/db/grupoClienteDB';

export default {
    data() {
        return {  
            idPopUpSearch: 'popup-cliente-search',  
            pedido: null,
            data:null,
            formasPagto:[],
            condicoesPagto:[],
            condigoBrinde: 5,
            condigoBoleto: 1,
            itensPedido: [],
            formaDePagamentoSelecionada: {},
            condicaoDePagamentoSelecionada: {},
            temCondicaoDePagamento: true,
            showScreen:false,
            endEntregaSel: {},
            listStatus: [],
        }
    },
    components: {
        'v-select': vSelect,
    },
    watch: {
        endEntregaSel(val) {
            this.pedido.endEntrega = {...val.value};
        },
    },
    computed:{
        getTotalLiquido() {
            return this.$options.filters.money(this.pedido.totalLiquido);
        },
        getDataEmbarque() {
            return this.$options.filters.formatDate(this.pedido.dataEmbarque);
        },
        getStatus() {
            return this.listStatus.find((status) => status.id === this.pedido.status).nome;
        },
        getFormasPagto() {
            return this.formasPagto.map((formaPagto) => {
                return {value:formaPagto.id, label:formaPagto.nome, condicoes: formaPagto.condicoes};
            });
        },
        getCondicoesDePagamento() {
            if (this.formaDePagamentoSelecionada && this.formaDePagamentoSelecionada.condicoes.length > 0) {
                return this.formaDePagamentoSelecionada.condicoes.map((condicaoDePagamento) => {
                    return {value:condicaoDePagamento.id, label:condicaoDePagamento.nome};
                });
            } else return [];
        },
        
        getEnderecosEntrega() {
            const listaEnderecos = [this.getEndEntregaOption(this.pedido.cliente.endereco)];
            if (this.pedido.cliente.enderecos && this.pedido.cliente.enderecos.length > 0) {
                this.pedido.cliente.enderecos.map((endereco) => {
                    listaEnderecos.push(this.getEndEntregaOption(endereco));
                });
            }
            return listaEnderecos
        },
        
    },
    methods: {
        getValorTotalCor(itemCor) {
            return itemCor.quantidade * itemCor.precoCusto;
        },
        getEndEntregaOption(endereco) {
            return {label: this.getLabelEndereco(endereco), value: {...endereco}};
        },
        getLabelEndereco(endereco) {
            return endereco ? endereco.endereco +', Nº'+ endereco.numero +' - CEP: '+ endereco.cep : null;
        },
        mensagemMudarParaDigitacao(pedido) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Deseja reabrir o pedido?',
                text: 'Será criado um carrinho com os itens dos pedidos selecionados.',
                accept: this.mudarStatusPedido,
                acceptText: 'Reabrir',
                cancelText: 'Cancelar',
                parameters: pedido
            })
        },
        mensagemMudarParaEnviar(pedido) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Deseja finalizar a geração de pedido?',
                text: 'Após finalizar a geração de pedido, os pedidos gerados estarão disponíveis para sincronização.',
                accept: this.mudarStatusPedido,
                acceptText: 'Finalizar',
                cancelText: 'Cancelar',
                parameters: pedido
            });
        },
        mudarStatusPedido(pedido) {
            if (pedido.status === 2) {
                pedido.status = 1;
                PedidoDB.atualizarStatusPedido(pedido);
                this.$forceUpdate();
            } else {
                pedido.status = 2;
                this.finalizarPedido(pedido);
                this.$forceUpdate();
            }
        },
        selectSearchCliente(cliente) {
            this.pedido.cliente = cliente;
        },

        abrirPesquisaCliente() {
            this.$bvModal.show(this.idPopUpSearch);
        },

        setCondicaoDePagamento() {
            this.pedido.condicaoPagamento = this.condicaoDePagamentoSelecionada.value;
        },

        setFormaDePagamento() {
            this.pedido.formaPagamento = this.formaDePagamentoSelecionada.value;
            if (this.formaDePagamentoSelecionada.value == this.condigoBrinde) {
                this.pedido.brinde = true;
                this.setBrinde();
            } else {
                // FormaPagtoDB._getById()
                this.condicaoDePagamentoSelecionada = {
                    value: this.formaDePagamentoSelecionada.condicoes[0].id,
                    label:this.formaDePagamentoSelecionada.condicoes[0].nome,
                };
                this.pedido.condicaoPagamento = this.condicaoDePagamentoSelecionada.value;
                this.pedido.brinde = false;
                this.temCondicaoDePagamento = true;
            }
        },

        setBrinde(){
            this.temCondicaoDePagamento = !this.pedido.brinde;
            this.pedido.formaPagamento = this.pedido.brinde ? this.condigoBrinde : null;
            this.pedido.condicaoPagamento = null;
        },
        deletarMessage(data) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Deseja excluir o item?',
                text: 'O item será excluído do pedido.',
                accept: this.deletarItemPedido,
                acceptText: 'Excluir',
                cancelText: 'Cancelar',
                parameters: data
            })
        },
        notification(titulo,mensagem,cor) {
            this.$vs.notify({
                title: titulo,
                text: mensagem,
                color: cor,
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            });
        },
        deletarItemPedido(parametersItemPedido) {
            this.pedido.itens = this.lodash.remove(this.pedido.itens, (itemPedido) => itemPedido.sku !== parametersItemPedido.sku);
            PedidoDB.deletarItemPedido(this.pedido).then(() => {
                this.notification('Excluído!','Item excluído do pedido com sucesso!','primary');
                setTimeout(() => {
                    this.carregaItensTela();
                }, 400);
            });
        },
        finalizarPedido(pedido) {
            PedidoDB.atualizarPedido(pedido).then(() => {
                this.notification('Sucesso!','As alterações foram salvas com sucesso!','success');
                setTimeout(() => {
                    this.voltarPedido();
                }, 400);
            });
        },
        voltarPedido() {
            this.$router.push('/pedido/consulta');
        },
        async carregaItensTela() {
			return new Promise((resolve) => {
                StatusDB._getAll().then((listStatus) => {
                    this.listStatus = listStatus;
                    PedidoDB.getPedido(this.$route.params.pedidoId, true).then((pedido) => {
                        ClienteDB.findById(pedido.cliente.id).then((cliente) => {
                            pedido.cliente = cliente;
                            GrupoClienteDB.findById(cliente.grupoCliente).then((grupoCliente) => {
                                pedido.grupoCliente = grupoCliente;
                                this.pedido = pedido;
                                ProdutoDB.getFromPedido(this.pedido.itens).then((itensPedido) => {
                                    this.endEntregaSel = this.getEndEntregaOption(this.pedido.endEntrega);
                                    this.itensPedido = itensPedido;
                                    FormaPagtoDB.getDadosPagamento(this.pedido.formaPagamento, this.pedido.condicaoPagamento).then((dadosPagamento) => {
                                        this.formasPagto = dadosPagamento.formasDePagamento;
                                        this.formaDePagamentoSelecionada = dadosPagamento.formaPagamentoSelecionada;
                                        this.condicaoDePagamentoSelecionada = dadosPagamento.condicaoPagamentoSelecionada;
                                        resolve();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },
    },
    async mounted() {
        const error = (erro) => {
            console.log(erro);
            alert(erro);
            this.$router.go(-1);
        }
        try {
            this.carregaItensTela().then(() => {
				this.showScreen = true;
			}).catch((erro) => error(erro));
        } catch (erro) {
            error(erro)
        }
    },
    beforeCreate() {
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    },
}

</script>

<style lang="scss">

.celulaTable {
    border-color:#808080;
    font-weight:bold;
    min-width:30px;
    padding:5px;
}

.carrinho-item {
    padding:10px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2); 
    margin-top:10px;
}

.mb-base-button {
    margin-bottom: 0.8rem !important;
}

.con-img-upload .img-upload {
    width: 185px;
    height: 185px;
}

.my-5-top {
    margin-top: 1.25rem !important;    
}

.vx-card {
    width: 100%
}

.vs-input--input.normal {
    font-size: 0.75rem;
}

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

.grade-tam-prod-abert {
    border-color:#808080;
    font-weight:bold;
    text-align: center !important;
    border-style: solid !important;
    color: #189b36;
}

.grade-tam-prod-fatu {
    border-color:#808080;
    font-weight:bold;
    text-align: center !important;
    border-style: solid !important;
    color: #7179f4;
}

.grade-tam-prod-canc {
    border-color:#808080;
    font-weight:bold;
    text-align: center !important;
    border-style: solid !important;
    color: #f15b5b;
}

</style>
