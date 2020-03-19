<template>
    <div id="page-orders" v-if="this.showScreen">
        <vs-table pagination max-items="10" search :data="pedidos">            
            <!-- <template slot="header">
                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editar(null)">Novo</vs-button>
            </template> -->
            <template slot="thead">
                <vs-th class="th-acoes">Ações</vs-th>
                <vs-th sort-key="cnpj" style="width: 30%">CNPJ</vs-th>
                <vs-th sort-key="nome">Nome</vs-th>
                <vs-th sort-key="dataEmbarque" style="width: 15%">Embarque</vs-th>
                <vs-th sort-key="status" style="width: 20%" >Status</vs-th>
            </template> 
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
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
                    <vs-td :data="data[indextr]" v-if="data[indextr].status">
                        <vs-chip :color="getStatusColor(data[indextr].status)" class="product-order-status">{{ getNameStatus(data[indextr].status) }}</vs-chip>
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
            if(status == 20) return "Enviar";      
            if(status == 50) return "Sincronizado"; 
            if(status == 99) return "Cancelado";
            else return "Digitação";
        },
        getStatusColor(status) {
            if(status == 20) return "#24c1a0";
            if(status == 50) return "success";
            if(status == 99) return "danger";
            else return "warning";
        },
        editar(pedido) {
            this.$router.push({ name: 'pedidoEditar', params: {pedidoId: pedido.id} });
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