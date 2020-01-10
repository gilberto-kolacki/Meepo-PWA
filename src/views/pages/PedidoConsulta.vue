<template>
    <div id="page-orders">
        <vs-table pagination max-items="10" search :data="pedidos" v-if="this.pedidos.length > 0">            
            <!-- <template slot="header">
                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editar(null)">Novo</vs-button>
            </template> -->
            <template slot="thead">
                <vs-th sort-key="cnpj">CNPJ</vs-th>
                <vs-th sort-key="nome">Nome</vs-th>
                <vs-th sort-key="nome">Status</vs-th>
                <vs-th sort-key="cidade">Cidade</vs-th>
                <vs-th sort-key="estado">UF</vs-th>
                <vs-th>Ações</vs-th>
            </template> 
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr]" v-if="data[indextr].cliente">
                        {{ data[indextr].cliente.cpfCnpj }}
                    </vs-td>
                    <vs-td :data="data[indextr]" v-if="data[indextr].cliente">
                        {{ data[indextr].cliente.nome }}
                    </vs-td>
                    <vs-td :data="data[indextr]" v-if="data[indextr].cliente">
                        <vs-chip :color="getStatusColor(30)" class="product-order-status">{{ getNameStatus(30) }}</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr]" v-if="data[indextr].cliente">
                        {{ data[indextr].cliente.endereco.cidade }}
                    </vs-td>
                    <vs-td :data="data[indextr]" v-if="data[indextr].cliente">
                        {{ data[indextr].cliente.endereco.estado }}
                    </vs-td>
                    <vs-td v-if="data[indextr].cliente">
                        <div class="flex">
                            <div class="p-1">
                                <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editar(data[indextr])" />
                            </div>
                            <div class="p-1">
                                <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarMessage(data[indextr])"/>
                            </div>
                        </div>
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
// import _ from 'lodash';

export default {
    data() {
        return { 
            pedidos: [],
        }
    },
    methods: {
        getNameStatus(status) {
            if(status == 10) return "Digitação"
            if(status == 20) return "Sincronização"
            if(status == 30) return "Orçamento"
            return ""
        },
        getStatusColor(status) {
            if(status == 10) return "warning"
            if(status == 20) return "success"
            if(status == 30) return "danger"
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
                text:'Você esta prestes a excluir um cliente. Deseja continuar?',
                accept:this.deletar,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
                parameters: pedido
            })
        },
        deletar(pedido) {
            console.log("Pedido = = = : ", pedido.id);
            
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
        ErrorDB.criarLog({err, vm, info});
        return true;
    }
}

</script>