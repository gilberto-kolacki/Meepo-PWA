<template>
    <div id="page-orders">
        <vs-table pagination max-items="10" search :data="pedidos" v-if="this.pedidos.length > 0">            
            <template slot="header">
                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editar(null)">Novo</vs-button>
            </template>
            <template slot="thead">
                <vs-th sort-key="cnpj">CNPJ</vs-th>
                <vs-th sort-key="nome">Nome</vs-th>
                <vs-th sort-key="cidade">Cidade</vs-th>
                <vs-th sort-key="estado">UF</vs-th>
                <vs-th>Ações</vs-th>
            </template> 
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].cliente.cpfCnpj">
                        {{ data[indextr].cliente.cpfCnpj }}
                    </vs-td>
                    <vs-td :data="data[indextr].cliente">
                        {{ data[indextr].cliente }}
                    </vs-td>
                    <vs-td :data="data[indextr].cidade">
                        {{ data[indextr].cidade }}
                    </vs-td>
                    <vs-td :data="data[indextr].estado">
                        {{ data[indextr].estado }}
                    </vs-td>
                    <vs-td>
                        <div class="flex">
                            <div class="p-1">
                                <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editar(data[indextr])" />
                            </div>
                            <div v-if="!data[indextr].clienteErp" class="p-1">
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

export default {
    data() {
        return { 
            pedidos: [],
        }
    },
    methods: {
        editar(pedido) {
            console.log(pedido);
            if (pedido) {
                this.$router.push({ name: 'clienteEditar', params: {clienteId: pedido._id } });
            } else {
                this.$router.push('/cliente/cadastro');
            }
        },
        listar() {
            return new Promise((resolve) => {
                PedidoDB._getAll().then((result) => {
                    this.pedidos = result;

                    console.log(this.pedidos);
                    resolve();
                });
            });
        },
        deletarMessage(data) {
            this.$vs.dialog({
                type:'confirm',
                color:'danger',
                title:'Deseja excluir?',
                text:'Você esta prestes a excluir um cliente. Deseja continuar?',
                accept:this.deletar,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
                parameters: data
            })
        },
        deletar(parameters) {
            PedidoDB.deletar(parameters).then(() => {
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