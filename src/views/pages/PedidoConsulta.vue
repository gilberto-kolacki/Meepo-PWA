<template>
    <div id="page-orders" v-if="this.showScreen">
        <div class="vx-row">
            <vs-col vs-type="flex">
                <vs-chip class="product-order-status">
                    <vs-avatar @click="filtrar()" icon="done_outline" />
                    Todos
                </vs-chip>
                <vs-chip class="product-order-status" color="dark">
                    <vs-avatar @click="filtrar(10)" icon="done_outline" />
                    Digitação
                </vs-chip>
                <vs-chip class="product-order-status" color="warning">
                    <vs-avatar @click="filtrar(20)" icon="done_outline" />
                    Aguardando Sinc...
                </vs-chip>
                <vs-chip class="product-order-status" color="success">
                    <vs-avatar @click="filtrar(50)" icon="done_outline" />
                    Sincronizado
                </vs-chip>
                <vs-chip class="product-order-status" color="danger">
                    <vs-avatar @click="filtrar(99)" icon="done_outline" />
                    Cancelado
                </vs-chip>
            </vs-col>
        </div>
        <vs-table pagination max-items="10" search :data="pedidos">           
            <template slot="header">
                <h3>Pedidos</h3>
            </template>
            <template slot="thead">
                <vs-th class="th-acoes">Ações</vs-th>
                <vs-th sort-key="cnpj" style="width: 30%">CNPJ</vs-th>
                <vs-th sort-key="nome">Nome</vs-th>
                <vs-th sort-key="dataEmbarque" style="width: 15%">Embarque</vs-th>
                <vs-th sort-key="status" style="width: 20%" >Status</vs-th>
            </template> 
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :state="getStatusColor(data[indextr].status)">
                    <vs-td v-if="data[indextr].cliente">
                        <div class="flex">
                            <div class="p-1">
                                <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editar(data[indextr])" />
                            </div>
                            <div class="p-1">
                                <vs-button type="filled" v-if="data[indextr].status == 10" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarMessage(data[indextr])"/>
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
import ErrorDB from '../../rapidsoft/db/errorDB';

export default {
    data() {
        return { 
            pedidos: [],
            showScreen: false,
        }
    },
    methods: {
        getNameStatus(status) {
            if(status == 20) return "Aguardando Sincronização";      
            if(status == 50) return "Sincronizado"; 
            if(status == 99) return "Cancelado";
            else return "Digitação";
        },
        getStatusColor(status) {
            if(status == 20) return "warning";
            if(status == 50) return "success";
            if(status == 99) return "danger";
            else return null;
        },
        editar(pedido) {
            this.$router.push({ name: 'pedidoEditar', params: {pedidoId: pedido.id} });
        },
        filtrar(status = null) {
            this.$vs.loading();
            PedidoDB._getAll().then((result) => {
                ClienteDB.getClientesPedidos(result).then((pedidos) => {
                    if (status) {
                        this.pedidos = pedidos.reduce((pedidos, pedido) => {
                            if (pedido.status == status) pedidos.push(pedido);
                            return pedidos;
                        }, []);
                    } else {
                        this.pedidos = pedidos;
                    }
                    setTimeout(() => {
                        this.$vs.loading.close();
                    }, 300);
                });
            });
        },
        listar() {
            return new Promise((resolve) => {
                PedidoDB._getAll().then((result) => {
                    ClienteDB.getClientesPedidos(result).then((pedidos) => {
                        this.pedidos = pedidos;
                        document.getElementById('loading-bg').style.display = 'none';
                        resolve();
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
                type:'confirm',
                color:'danger',
                title:'Deseja excluir?',
                text:'Você esta prestes a excluir um pedido. Deseja continuar?',
                accept:this.deletar,
                acceptText: 'Continuar',
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