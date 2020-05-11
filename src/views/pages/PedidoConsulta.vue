<template>
    <div id="page-orders" v-if="this.showScreen">
        <div class="vx-row">
            <div class="vx-col w-full">
                <v-select 
                    id="statusFilter"
                    name="statusFilter"
                    multiple
                    label="nome"
                    placeholder="Selecione os status de Pedido para visualizar"
                    :options="optionsStatus"
                    v-model="selectedStatus"
                    @input="filtrar()"
                />
            </div>
        </div>
        <vs-table pagination max-items="10" search :data="pedidosFiltro">           
            <template slot="header">
                <div class="w-1/5">
                    <div clas="vx-col flex items-center justify-start">
                        <b-dropdown text="Ações" size="sm" variant="danger" class="m-1">
                            <div v-if="!todosSelecionados">
                                <b-dropdown-item>
                                    <span class="flex items-center">
                                        <feather-icon icon="CheckSquareIcon" svgClasses="h-4 w-4" class="mr-2" />
                                        <span @click="selecionarTodos(true)">Selecionar Todos</span>
                                    </span>
                                </b-dropdown-item>
                            </div>
                            <div v-if="itensSel">
                                <b-dropdown-divider v-if="!todosSelecionados" />
                                <b-dropdown-item>
                                    <span class="flex items-center">
                                        <feather-icon icon="XSquareIcon" svgClasses="h-4 w-4" class="mr-2" />
                                        <span @click="selecionarTodos(false)">Desmarcar Seleção</span>
                                    </span>
                                </b-dropdown-item>
                            </div>
                            <div v-if="itensSel && itensSelPendenteSinc">
                                <b-dropdown-divider/>
                                <b-dropdown-item>
                                    <span class="flex items-center">
                                        <feather-icon icon="ExternalLinkIcon" svgClasses="h-4 w-4" class="mr-2" />
                                        <span @click="reabrirMessage()">Reabrir Seleção</span>
                                    </span>
                                </b-dropdown-item>
                            </div>
                            <div v-if="itensSel && itensSelSinc">
                                <b-dropdown-divider/>
                                <b-dropdown-item>
                                    <span class="flex items-center">
                                        <feather-icon icon="ExternalLinkIcon" svgClasses="h-4 w-4" class="mr-2" />
                                        <span @click="replicarMessage()">Replicar Seleção</span>
                                    </span>
                                </b-dropdown-item>
                            </div>
                            <b-dropdown-divider/>
                        </b-dropdown>
                    </div>
                </div>
            </template>
            <template slot="thead">
                <vs-th style="width: 5%">
                    <vs-checkbox class="inline-flex" v-model="selecteds" @click="selecionarTodos(selecteds)"/>
                </vs-th>
                <vs-th class="th-acoes">Ações</vs-th>
                <vs-th sort-key="cnpj" style="width: 30%">CNPJ</vs-th>
                <vs-th sort-key="nome">Nome</vs-th>
                <vs-th sort-key="dataEmbarque" style="width: 15%">Embarque</vs-th>
                <vs-th sort-key="status" style="width: 20%" >Status</vs-th>
            </template> 
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :state="getStatusColor(data[indextr].status)">
                    <vs-td>
                        <vs-checkbox class="inline-flex" v-model="itensSelecionados" :vs-value="data[indextr]" @click="selecionarItem()"/>
                    </vs-td>
                    <vs-td v-if="data[indextr].cliente">
                        <div class="flex">
                            <div class="p-1">
                                <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editar(data[indextr])" />
                            </div>
                            <div class="p-1">
                                <vs-button type="filled" v-if="data[indextr].status == 1" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarMessage(data[indextr])"/>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td :data="data[indextr].cliente.cpfCnpj">
                        {{ data[indextr].cliente.cpfCnpj | cpfCnpj }}
                    </vs-td>
                    <vs-td :data="data[indextr].cliente.nome">
                        {{ data[indextr].cliente.nome | capitalize }}
                    </vs-td>
                    <vs-td :data="data[indextr].dataEmbarque">
                        {{ data[indextr].dataEmbarque | formatDate }}
                    </vs-td>
                    <vs-td>
                         {{ getNameStatus(data[indextr].status) | capitalize }}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>

import PedidoDB from '../../rapidsoft/db/pedidoDB';
import ClienteDB from '../../rapidsoft/db/clienteDB';
import StatusDB from "../../rapidsoft/db/statusDB";
import Storage from '../../rapidsoft/utils/storage';
import ErrorDB from '../../rapidsoft/db/errorDB';
import vSelect from 'vue-select';

export default {
    data() {
        return { 
            pedidos: [],
            pedidosFiltro: [],
            itensSelecionados: [],
            showScreen: false,
            selecteds: false,            
            optionsStatus: [],
            selectedStatus: [],
        }
    },
    watch: {
        selecteds(newValue, oldValue) {
            if ((oldValue != null && newValue != null && newValue != oldValue)) {
                this.itensSelecionados = [];
                this.pedidosFiltro.forEach((element) => {
                    if (newValue) this.itensSelecionados.push(element);
                    element.selected = newValue;
                });
            }
        },
    },
    components: {
        'v-select': vSelect,
    },
    computed: {
        itensSel() {
            return this.itensSelecionados.length > 0 ? true : false;
        },
        itensSelPendenteSinc() {
            return this.itensSelecionados.find((item) => item.status > 2) ? false : true;
        },
        itensSelSinc() {
            return this.itensSelecionados.find((item) => item.status <= 2) ? false : true;
        },
        todosSelecionados() {
            return this.itensSelecionados.length == this.pedidosFiltro.length;
        }
    },
    methods: {
        getNameStatus(idStatus) {
            return this.optionsStatus.find((status) => status.id === idStatus).nome;
        },
        getStatusColor(status) {
            if(status == 1) return "warning";
            if(status == 2) return "success";
            else return "null";
        },
        editar(pedido) {
            this.$router.push({ name: 'pedidoEditar', params: {pedidoId: pedido.id} });
        },
        selecionarTodos(select=null) {
            this.selecteds = select;
        }, 
        selecionarItem() {
            setTimeout(() => {
                if (this.itensSelecionados.length === this.pedidosFiltro.length) {
                    this.selecteds = true;
                } else {
                    this.selecteds = null;
                }
            }, 100);
        },
        filtrar() {
            this.$vs.loading();
            this.selecteds = false;
            this.itensSelecionados = [];
            PedidoDB._getAll().then((result) => {
                ClienteDB.getClientesPedidos(result).then((pedidos) => {
                    if (this.selectedStatus.length > 0) {
                        this.pedidosFiltro = pedidos.filter((pedido) => {
                            return this.selectedStatus.filter((status) => status.id === pedido.status).length
                        }, []);
                    } else {
                        this.pedidosFiltro = pedidos;
                    }
                    setTimeout(() => {
                        this.$vs.loading.close();
                    }, 10);
                });
            });
        },
        listar() {
            return new Promise((resolve) => {
                StatusDB._getAll().then((optionsStatus) => {
                    this.optionsStatus = optionsStatus;
                    PedidoDB._getAll().then((result) => {
                        ClienteDB.getClientesPedidos(result).then((pedidos) => {
                            this.pedidos = pedidos;
                            this.pedidosFiltro = pedidos;
                            document.getElementById('loading-bg').style.display = 'none';
                            resolve();
                        });
                    });
                });
            });
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
        deletarMessage(pedido) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Deseja excluir os pedidos selecionados?',
                text: 'Os pedidos selecionados serão excluídos.',
                accept: this.deletar,
                acceptText: 'Excluir',
                cancelText: 'Cancelar',
                parameters: pedido
            });
        },
        deletar(pedido) {
            PedidoDB.deletar(pedido._id).then(() => {
                this.notification('Excluído!','Pedido excluído com sucesso!','primary')
                setTimeout(() => {
                    this.listar();
                }, 400);
            });
        },

        getIdsPedidosSelecioandos() {
            return this.itensSelecionados.map((item) => item.id);
        },
        replicarMessage() {
            Storage.validaCarrinho(this, () => {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: 'Deseja replicar os pedidos selecionados?',
                    text: 'Será criado um carrinho com os itens dos pedidos selecionados.',
                    accept: this.replicar,
                    acceptText: 'Replicar',
                    cancelText: 'Cancelar',
                });
            });
        },
        replicar() {
            this.$vs.loading();
            PedidoDB.replicar(this.getIdsPedidosSelecioandos()).then((alerta) => {
                this.notification('Sucesso!','Pedido replicado com sucesso!','success');
                const doneReplicar = () => this.$router.push({ name: 'carrinho' });
                setTimeout(() => {
                    if (alerta) this.$vs.dialog({title: 'Produtos não disponíveis para venda!', text:'Alguns itens não puderam ser adicionados ao Carrinho!', accept: doneReplicar, acceptText: 'Ok'});
                    else doneReplicar();
                    this.$vs.loading.close();
                }, 400);
            });
        },
        reabrirMessage() {
            Storage.validaCarrinho(this, () => {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: 'Deseja reabrir os pedidos selecionados?',
                    text: 'Será criado um carrinho com os itens dos pedidos selecionados e os pedidos serão excluídos.',
                    accept: this.reabrir,
                    acceptText: 'Reabrir',
                    cancelText: 'Cancelar',
                });
            });
        },
        reabrir() {
            this.$vs.loading();
            PedidoDB.reabrir(this.getIdsPedidosSelecioandos()).then((alerta) => {
                this.notification('Sucesso!','Pedido reaberto com sucesso!','success');
                const doneReabrir = () => this.$router.push({ name: 'carrinho' });
                setTimeout(() => {
                    if (alerta) this.$vs.dialog({title: 'Produtos não disponíveis para venda!', text:'Alguns itens não puderam ser adicionados ao Carrinho!', accept: doneReabrir, acceptText: 'Ok'});
                    else doneReabrir();
                    this.$vs.loading.close();
                }, 400);
            });
        }
    },
    beforeCreate() {
        
    },
    async created() {
        await this.listar();
        this.showScreen = true;
    },
    mounted() {
        
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    }
}

</script>