<template>
    <div id="page-customers">
        <div id="page-customers-list">
            <vs-table pagination max-items="10" search :data="clientes">            
                <template slot="header">
                    <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editar(null)">Novo</vs-button>
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

export default {
    data() {
        return { 
            clientes: [],
            isIpad: true,
        }
    },
    methods: {
        editar(cliente) {
            console.log(cliente);
            if (cliente) {
                this.$router.push({ name: 'clienteEditar', params: {clienteId: cliente._id } });
            } else {
                this.$router.push('/cliente/cadastro');
            }
        },
        listar() {
            clienteDB.listarConsulta().then((resposta) => {
                this.clientes = Object.assign(resposta);
            })
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
        deletar: function(parameters) {
            clienteDB.deletar(parameters).then(() => {
                this.listar();
            });
        },
    },
    created() {
        if(navigator.platform === "iPad") {
            this.isIpad = true;
        } else {
            this.isIpad = false;
        }
        
    },
    mounted() {
        this.listar();
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    },
    beforeCreate() {
        
    }
    
}

</script>