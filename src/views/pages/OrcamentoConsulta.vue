<template>    
    <div class="page-orcamento-consulta">
        <div id="page-orcamento-consulta-lista">
            <vs-table pagination max-items="10" search :data="orcamentos">            
                <template slot="header">
                </template>
                <template slot="thead">
                    <vs-th class="th-acoes">Ações</vs-th>
                    <vs-th sort-key="cnpj">CNPJ</vs-th>
                    <vs-th sort-key="nome">Nome</vs-th>
                    <vs-th sort-key="cidade">Cidade</vs-th>
                    <vs-th sort-key="estado">UF</vs-th>
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
                            {{ data[indextr].nome }}
                        </vs-td>
                        <vs-td :data="data[indextr].cidade">
                            {{ data[indextr].cidade }}
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

export default {
    data() {
        return { 
            orcamentos: [],
        }
    },
    methods: {
    
    }
    
}
</script>

<style lang="stylus">

.th-acoes {
    width: 10%;
}

</style>