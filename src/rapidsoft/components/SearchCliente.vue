<template>
    <b-modal 
        :id="id" 
        class="popup-cliente-search"          
        @show="zoomSearch"
        hide-footer>
        <!-- size="xl" -->
        <template v-slot:modal-header="{ close }">
            <header class="vs-popup--header">
                <div class="vs-popup--title">
                    <h3>Pesquisa de Clientes</h3>
                </div>
                <i class="vs-icon notranslate icon-scale vs-popup--close vs-popup--close--icon material-icons null" style="background: rgb(255, 255, 255);" @click.stop="close()">close</i>
            </header>
        </template>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full">
                <label for="estadosFiltro" class="vs-input--label">Estado</label>
                <v-select id="estadosFiltro" required=true name="estado" :clearable=false v-model="estadoSelecionado" :options="getEstadosSearch" :dir="$vs.rtl ? 'rtl' : 'ltr'"/>                
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <label for="cidadesFiltro" class="vs-input--label">Cidade</label>
                <v-select id="cidadesFiltro" name="cidade" v-model="cidadeSelecionada" :clearable=true :options="getCidadesSearch"/>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/3 w-full mb-2">
                <label for="cnpjCpfSearch" class="vs-input--label">CPF/CNPJ</label>
                <div class="vs-con-input">
                    <the-mask id="cnpjCpfSearch" name="cnpjCpfSearch" v-model="cnpjCpfSearch" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                </div>
            </div>
            <div class="vx-col sm:w-2/3 w-full mb-2">
                <vs-input v-validate="'required'" name="nomeSearch" label="Nome" v-model="nomeSearch" class="w-full" />
            </div>
        </div>
        <vs-table ref="table" v-model="clienteSearch" @selected="selectSearch(clienteSearch)" :data="listaPesquisa">
            <template slot="thead">
                <vs-th sort-key="cpfCnpj" style="width: 25%">CPF/CNPJ</vs-th>
                <vs-th sort-key="nome" style="width: 35%">Nome</vs-th>
                <vs-th sort-key="cidade" style="width: 20%">Cidade</vs-th>
                <vs-th sort-key="estado" style="width: 10%">UF</vs-th>
            </template>
            <template slot-scope="{data}">
                <tbody id="div-with-loading-search" class="vs-con-loading__container vs-con-loading-search">
                    <vs-tr :state="data[indextr].ativo === 0 ? 'dark' : (data[indextr].inadimplente !== 0) ? 'warning' : null" :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].cpfCnpj">
                            {{ tr.cpfCnpj | cpfCnpj }}
                        </vs-td>
                        <vs-td :data="data[indextr].nome">
                            {{ tr.nome | capitalize }}
                        </vs-td>
                        <vs-td :data="data[indextr].cidade">
                            {{ tr.cidade | capitalize }}
                        </vs-td>
                        <vs-td :data="data[indextr].estado">
                            {{ tr.estado }}
                        </vs-td>
                    </vs-tr>
                </tbody>
            </template>
        </vs-table>
    </b-modal>
</template>    
<script>

import vSelect from 'vue-select';
import ClienteDB from '../db/clienteDB';
import CidadeDB from '../db/cidadeDB';
import GrupoClienteDB from '../db/grupoClienteDB';
import CarrinhoDB from '../db/carrinhoDB';
import Storage from '../utils/storage';

export default {
    name: 'search-cliente',
    props: {
        id: {
            type: String,
            required: true,            
        }
    },
    data: () => ({
        cidadesFiltro: [],
        estadosFiltro: [],
        estadoSelecionado: null,
        cidadeSelecionada: null,
        listaPesquisa: [],
        cnpjCpfSearch: "",
        nomeSearch: "",
        clienteSearch: null,
        estadosComCliente: [],
    }),
    watch: {
        estadoSelecionado(newValue, oldValue) {
            if ((newValue && newValue != null && newValue != oldValue)) {
                this.searchCidades(() => this.searchFindCliente());
            }
        },
        cidadeSelecionada(newValue, oldValue) {
            if ((newValue != null && oldValue == null) || (newValue != oldValue)) {
                this.searchFindCliente();
            }
        },
        cnpjCpfSearch(newValue, oldValue) {
            if ((newValue === "" && oldValue.length > 0) || newValue.length >= 3) {
                this.searchFindCliente();
            }
        },
        nomeSearch(newValue, oldValue) {
            if ((newValue === "" && oldValue.length > 0) || newValue.length >= 3) {
                this.searchFindCliente();
            }
        }
    },
    components: {
        'v-select': vSelect,
    },
    computed: {
        getEstadosSearch() {
            return this.estadosFiltro.map((estado) => {
                return this.createEstadoSelect(estado);
            });
        },
        getCidadesSearch() {
            return this.cidadesFiltro.map((cidade) => {
                return {value: cidade.idCidade, label: cidade.nome};
            });
        }
    },
    methods: {
        zoomSearch() {
            this.cnpjCpfSearch = "";
            this.nomeSearch = "";
            if (this.estadoSelecionado && this.cidadesFiltro.length == 0) {
                this.searchCidades(() => this.searchFindCliente());
            }
        },
        selectSearch(cliente) {
            ClienteDB._getById(cliente.id).then((result) => {
                cliente = result.value;
                GrupoClienteDB.getById(cliente.grupoCliente).then((grupo) => {
                    cliente.grupoCliente = grupo;
                    CarrinhoDB.getCarrinho().then((carrinho) => {
                        carrinho.cliente = cliente;
                        CarrinhoDB.setCarrinho(carrinho).then(() => {
                            this.$bvModal.hide(this.id);
                            this.$emit('search-selected', cliente);
                        });
                    });
                });
            });
        },
        searchCidades(callback) {
            this.cidadeSelecionada = null;
            ClienteDB.getCidadesComClientes(this.estadoSelecionado.uf).then((cidades) => {
                this.cidadesFiltro = cidades;
                callback();
            });
        },
        searchFindCliente() {
            if ((this.estadoSelecionado && this.cidadeSelecionada && this.cidadeSelecionada.value != null) || (this.cnpjCpfSearch && this.cnpjCpfSearch.length >= 3) || (this.nomeSearch && this.nomeSearch.length >= 3)) {
                this.$vs.loading({ container: '#div-with-loading-search', scale: 0.6 });
                this.executaPesquisa();
            } else {
                if (this.estadoSelecionado) {
                    // TODO (Luiz): Removido pois estava criando o loading mesmo sem abrir o SearchCliente
                    //this.$vs.loading({ container: '#div-with-loading-search', scale: 0.6 });
                    this.executaPesquisa();
                } else {
                    this.listaProdutosPesquisa = [];
                    this.$vs.loading.close('#div-with-loading-search > .con-vs-loading');
                }
            }
        },
        executaPesquisa() {
            return new Promise((resolve) => {
                const uf = this.estadoSelecionado.uf;
                const idCidade = this.cidadeSelecionada ? this.cidadeSelecionada.value : 0;
                const cnpjCpf = this.cnpjCpfSearch ? this.cnpjCpfSearch : null;
                const nome = this.nomeSearch ? this.nomeSearch : null;
                ClienteDB.getClientesSearch(uf, idCidade, cnpjCpf, nome).then((clientes) => {
                    this.listaPesquisa = clientes;
                    this.$vs.loading.close('#div-with-loading-search > .con-vs-loading');
                    resolve();
                });
            });
        },
        createEstadoSelect(estado) {
            return {value: estado.id, label: estado.nome, uf: estado.sigla};
        },
        buscaEstados() {
            return new Promise((resolve) => {
                this.estadosComCliente = [];
                CidadeDB.getEstados().then((estadosAll) => {
                    ClienteDB.getEstadosComClientes().then((result) => {
                        estadosAll.map((estado) => {
                            const possuiCliente = result.find((estadoComCliente) => estadoComCliente.endereco.estado === estado.sigla);
                            
                            if (possuiCliente) {
                                this.estadosComCliente.push(this.lodash.clone(estado));
                            }
                        });
                        this.estadosFiltro = this.estadosComCliente;
                        this.estadoSelecionado = this.createEstadoSelect(this.estadosComCliente.find((estado) => estado.sigla === Storage.getUsuario().estado));
                        resolve();
                    });
                });
            });
        },
    
    },
    beforeCreate() {              
    },
    async created() {
        await this.buscaEstados();
    },
    beforeMount() {
    },
    mounted() {
    },
}
</script>    

<style lang="scss" scoped>

.vx-navbar-wrapper {
    z-index: 1000;
}

</style>
<style lang="scss">

.v-select .clear { visibility: hidden; }

.modal {    
    position: fixed;
    z-index: 42000;
}

.modal-dialog {
    max-width: 1024px;
    width: 97% !important;
    margin: 0.2rem 40.0rem;
}

.modal-content {
    height: 98.5vh !important;
    width: 70rem !important;
}

.vs-table--content{
    max-height: 75vh;
}


.img-popup {
    max-height: 7rem;
    max-width: 4rem;
}

.popup-produto-search .vs-popup {
    // right: 0;
    height: 100%;
    // width: 60%;        
}

.popup-produto-search .vs-table--search  {
    justify-content: center;
    max-width: 100%;
    position: relative;
    margin-left: auto;

    .input-search {
        width: 100vw;
    }
}

.vs-con-loading-search .vs-loading {
    position: fixed;
    width: 55px;
    height: 55px;
    display: block;
    border-radius: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 3px solid transparent;
    top: 5% !important;
}

@media only screen and (max-width: 1370px) {

    .modal-dialog {
        margin: 0.2rem auto;
    }

    .modal-content {
        height: 98.5vh !important;
        width: 54rem !important;
    }

    .vs-table--content{
        max-height: 66vh;
    }
}

@media only screen and (max-width: 1200px) {

    .modal-dialog {
        margin: 0.2rem auto;
    }

    .modal-content {
        height: 98.5vh !important;
        width: 54rem !important;
    }

    .vs-table--content{
        max-height: 69vh;
    }
}

@media only screen and (max-width: 768px) {

    .modal-dialog {
        margin: 0.2rem auto;
    }

    .modal-content {
        height: 98.5vh !important;
        width: 54rem !important;
    }

    .vs-table--content{
        max-height: 75vh;
    }
}

@media only screen and (max-width: 575px) {

    .modal-dialog {
        margin: 0.2rem auto;
    }

    .modal-content {
        height: 98.5vh !important;
        width: 54rem !important;
    }

    .vs-table--content{
        max-height: 75vh;
    }
}
    
</style>