<template>    
    <div class="page-orcamento-consulta">
        <div id="page-orcamento-consulta-lista" v-if="showScreen">
            <vs-table pagination max-items="10" search :data="orcamentos">            
                <template slot="header">
                    <h3>Orçamentos</h3>
                </template>
                <template slot="thead">
                    <vs-th class="th-acoes">Ações</vs-th>
                    <vs-th sort-key="numero" style="width: 10%">Nr.</vs-th>
                    <vs-th sort-key="nome" style="width: 30%">Cliente</vs-th>
                    <vs-th sort-key="grupoCliente.nome" style="width: 20%">Grupo</vs-th>
                    <vs-th sort-key="itens.length" style="width: 10%">Itens</vs-th>
                    <vs-th sort-key="valorTotal" style="width: 20%">Valor</vs-th>
                </template> 
                <template slot-scope="{data}">
                    <vs-tr v-for="(tr, indextr) in data" :key="indextr">
                        <vs-td>
                            <div class="flex">
                                <div class="p-1">
                                    <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editar(data[indextr])" />
                                </div>
                                <div class="p-1">
                                    <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarMessage(data[indextr])"/>
                                </div>
                            </div>
                        </vs-td>
                        <vs-td :data="data[indextr].id">
                            {{ data[indextr].id }}
                        </vs-td>
                        <vs-td :data="data[indextr].cliente.nome">
                            {{ data[indextr].cliente.nome }}
                        </vs-td>
                        <vs-td :data="data[indextr].cliente.grupoCliente.nome">
                            {{ data[indextr].grupoCliente.nome }}
                        </vs-td>
                        <vs-td :data="data[indextr].quantidade" style="text-align:right">
                            {{ data[indextr].quantidade }}
                        </vs-td>
                        <vs-td :data="data[indextr].totalLiquido" style="text-align:right">
                            {{ data[indextr].totalLiquido | moneyy(data[indextr].grupoCliente) }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>

    </div>
</template>
<script>

import ErrorDB from '../../rapidsoft/db/errorDB';
import OrcamentoDB from '../../rapidsoft/db/orcamentoDB';

export default {
    data() {
        return { 
            showScreen: false,
            orcamentos: [],
        }
    },
    methods: {
        editar(orcamento) {
            this.$router.push({ name: 'orcamentoVisualizar', params: { orcamentoId: orcamento.id } });
        },
        listar() {
            OrcamentoDB._getAll().then((orcamentos) => {
                this.orcamentos = Object.assign(orcamentos);
                this.showScreen = true;
            });
        },
        deletarMessage(data) {
            this.$vs.dialog({
                type:'confirm',
                color:'danger',
                title:'Deseja excluir?',
                text:'Você esta prestes a excluir este Orçamento. Deseja continuar?',
                accept:this.deletar,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
                parameters: data
            })
        },
        deletar(orcamento) {
            OrcamentoDB.deletar(orcamento).then(() => {
                this.listar();
            });
        },
    
    },
    created() {
        
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

<style lang="stylus">

.th-acoes {
    width: 10%;
}

</style>