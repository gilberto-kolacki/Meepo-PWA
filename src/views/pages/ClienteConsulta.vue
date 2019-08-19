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
                    <vs-th sort-key="contato">Cidade</vs-th>
                    <vs-th sort-key="telefone">UF</vs-th>
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
                                <div class="p-1" v-if="data[indextr].ativo">
                                    <vs-button type="filled" size="small" icon-pack="feather" color="success" icon="icon-unlock" @click="inativar(data[indextr])"/>
                                </div>
                                <div class="p-1" v-else>
                                    <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-lock" @click="ativar(data[indextr])"/>
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
    loading: true,
    data() {
        return { 
            clientes: [],
            isIpad: true,
        }
    },
    methods: {
        editar(cliente) {
            console.log(cliente);
            this.$router.push({ name: 'clienteEditar', params: {clienteId: cliente._id } });

        },
    },
    created() {
        if(navigator.platform === "iPad") {
            this.isIpad= true;
        } else {
            this.isIpad= false;
        }

        clienteDB.listar().then(resposta => {
            this.clientes = _.clone(resposta);
            console.log(this.clientes);
            
		})
    },
    mounted() {
        
        
    },
    beforeCreate() {
        
    }
    
}

</script>