<template>
    <div id="page-customers">
        <div id="page-customers-list">
            <vs-table pagination max-items="10" search :data="clientes">            
                <template slot="header">
                    <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editar(null)">Nova</vs-button>
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
                        <vs-td :data="data[indextr].cpfCnpj">
                            {{ data[indextr].cpfCnpj }}
                        </vs-td>
                        <vs-td :data="data[indextr].nome">
                            {{ data[indextr].nome }}
                        </vs-td>
                        <vs-td :data="data[indextr].endereco.cidade">
                            {{ data[indextr].endereco.cidade }}
                        </vs-td>
                        <vs-td :data="data[indextr].endereco.estado">
                            {{ data[indextr].endereco.estado }}
                        </vs-td>
                        <vs-td>
                            <div class="flex">
                                <div class="p-1">
                                    <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editar(data[indextr])" />
                                </div>
                                <div class="p-1">
                                    <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletar(data[indextr])"/>
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>

    </div>
</template>

<script>

import _ from 'lodash';
import clienteDB from '../../rapidsoft/db/clienteDB';

export default {
    data() {
        return { 
            clientes: [],
            isIpad: true,
        }
    },
    methods: {
        editar(cliente) {
            if (cliente) {
                this.$router.push({ name: 'clienteEditar', params: {clienteId: cliente._id } });
            } else {
                this.$router.push('/cliente/cadastro');
            }
        },
        listar() {
            clienteDB.listar().then((resposta) => {
                this.clientes = _.clone(resposta);
            })
        },
        deletar(cliente) {
            clienteDB.deletar(cliente).then(() => {
                this.listar();
            });
        }
    },
    created() {
        if(navigator.platform === "iPad") {
            this.isIpad= true;
        } else {
            this.isIpad= false;
        }

        
    },
    mounted() {
        this.listar();
    },
    beforeCreate() {
        
    }
    
}

</script>