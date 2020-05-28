<template>
    <div id="page-customers">
        <div id="page-customers-list">
            <vs-table pagination max-items="10" search :data="clientes">            
                <template slot="header">
                    <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editar(null)">Novo</vs-button>
                    <h3 class="ml-3" >Clientes</h3>
                </template>
                <template slot="thead">
                    <vs-th class="th-acoes">Ações</vs-th>
                    <vs-th sort-key="cnpj" style="width: 25%">CNPJ</vs-th>
                    <vs-th sort-key="nome" style="width: 35%">Nome</vs-th>
                    <vs-th sort-key="cidade" style="width: 20%">Cidade</vs-th>
                    <vs-th sort-key="estado" style="width: 10%">UF</vs-th>
                </template> 
                <template slot-scope="{data}">
                    <vs-tr :state="data[indextr].ativo === 0 ? 'danger':data[indextr].inadimplente !== 0 ? 'warning':null" :key="indextr" v-for="(tr, indextr) in data">
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
                        <vs-td :data="data[indextr].cpfCnpj">
                            {{ data[indextr].cpfCnpj | cpfCnpj }}
                        </vs-td>
                        <vs-td :data="data[indextr].nome">
                            {{ data[indextr].nome | capitalize }}
                        </vs-td>
                        <vs-td :data="data[indextr].cidade">
                            {{ data[indextr].cidade | capitalize }}
                        </vs-td>
                        <vs-td :data="data[indextr].estado">
                            {{ data[indextr].estado }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>

    </div>
</template>

<script>

import clienteDB from '../../rapidsoft/db/clienteDB';
import ErrorDB from '../../rapidsoft/db/errorDB';
import PedidoDB from '../../rapidsoft/db/pedidoDB';
import OrcamentoDB from '../../rapidsoft/db/orcamentoDB';
import CarrinhoUtils from "../../rapidsoft/utils/carrinhoUtils";

export default {
    data() {
        return { 
            clientes: [],
            isIpad: true,
        }
    },
    methods: {
        editar(cliente) {
            let params = {};
            if (cliente) {
                params.clienteId = cliente.id;
            }
            this.$router.push({ name: 'clienteEditar', params: params });
        },
        listar() {
            return new Promise((resolve) => {
                clienteDB.listarConsulta().then((resposta) => {
                    this.clientes = this.lodash.orderBy(Object.assign(resposta), ['ativo', 'nome'], ['desc', 'asc']);
                    resolve();
                });
            });
        },
        deletarMessage(data) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Deseja excluir o cliente?',
                text: 'O cliente será excluído.',
                accept: this.deletar,
                acceptText: 'Excluir',
                cancelText: 'Cancelar',
                parameters: data
            })
        },
        erroDeletar(msgErro) {
            this.$vs.notify({
                title: 'Cliente não pode ser excluído!',
                text: `Para exlcuir você deve primeiro excluir ${msgErro} existente(s) para este cliente!`,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                position:'top-right'
            })
        },
        deletar(parameters) {
            CarrinhoUtils.getExisteClienteCarrinho(parameters.id).then((existeCarrinho) => {
                PedidoDB.getPedidoByCliente(parameters.id).then((existePedido) => {
                    OrcamentoDB.getExisteClienteOrcamento(parameters.id).then((existeOrcamento) => {
                        if (existePedido || existeCarrinho || existeOrcamento) {
                            let arrayErro = [];
                            if (existePedido) arrayErro = [...arrayErro, 'pedidos'];
                            if (existeOrcamento) arrayErro = [...arrayErro, 'orçamentos'];
                            if (existeCarrinho) arrayErro = [...arrayErro, 'carrinho'];
                            this.erroDeletar(arrayErro.toString());
                        } else {
                            clienteDB.deletar(parameters.id).then(() => {
                                this.listar();
                            });
                        }
                    });
                });
            });
        },
    },
    created() {
        
    },
    async mounted() {
        await this.listar();
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    },
    beforeCreate() {
        
    }
    
}

</script>