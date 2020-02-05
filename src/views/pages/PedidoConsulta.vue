<template>
    <div id="page-orders">
        <vs-table pagination max-items="10" search :data="pedidos">            
            <!-- <template slot="header">
                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editar(null)">Novo</vs-button>
            </template> -->
            <template slot="thead">
                <vs-th class="th-acoes">Ações</vs-th>
                <vs-th sort-key="cnpj" style="width: 25%">CNPJ</vs-th>
                <vs-th sort-key="nome">Nome</vs-th>
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
                    <vs-td :data="data[indextr]" v-if="data[indextr].cliente">
                        {{ data[indextr].cliente.cpfCnpj | cpfCnpj }}
                    </vs-td>
                    <vs-td :data="data[indextr]" v-if="data[indextr].cliente">
                        {{ data[indextr].cliente.nome | capitalize }}
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

// import _ from 'lodash';
import PedidoDB from '../../rapidsoft/db/pedidoDB';
import ErrorDB from '../../rapidsoft/db/errorDB';

export default {
    data() {
        return { 
            pedidos: [],
        }
    },
    methods: {
        getNameStatus(status) {
            if(status == 10) return "Digitação"
            if(status == 20) return "Enviar"            
            if(status == 50) return "Sincronizado"            
            return ""
        },
        getStatusColor(status) {
            if(status == 10) return "warning"
            if(status == 20) return "#24c1a0"
            if(status == 50) return "success"
            return "primary"
        },
        editar(pedido) {
            if (pedido) {
                this.$router.push({ name: 'pedidoEditar', params: {pedidoId: pedido.id} });
            } else {
                this.$router.push('/pedido/cadastro');
            }
        },
        listar() {
            return new Promise((resolve) => {
                document.getElementById('loading-bg').style.display = null;
                PedidoDB._getAll().then((result) => {
                    this.pedidos = result;
                    document.getElementById('loading-bg').style.display = 'none';
                    resolve();
                });
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
            })
        },
        deletar(pedido) {
            PedidoDB._deletar(pedido.id).then(() => {
                this.listar();
            });
        }
    },
    beforeCreate() {
        
    },
    async created() {
        await this.listar();
    },
    mounted() {
        
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    }
}

</script>