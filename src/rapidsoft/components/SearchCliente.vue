<template>
    <b-modal 
        :id="id" 
        class="popup-cliente-search" 
        size="xl"
        scrollable  
        @show="zoomSearch"
        hide-footer>
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
                <v-select id="cidadesFiltro" name="cidade" v-model="cidadeSelecionada" :options="getCidadesSearch"/>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/3 w-full mb-2">
                <label for="cpfCnpj" class="vs-input--label">CPF/CNPJ</label>
                <div class="vs-con-input">
                    <the-mask id="cpfCnpj" v-model="cnpjCpfSearch" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                </div>
            </div>
            <div class="vx-col sm:w-2/3 w-full mb-2">
                <vs-input v-validate="'required'" label="Nome" v-model="nomeSearch" class="w-full" />
            </div>
        </div>
        <div>
        <vs-table ref="table" v-model="clienteSearch" @selected="selectSearchProduto(clienteSearch)" :data="listaPesquisa">
            <template slot="thead">
                <vs-th sort-key="referencia">Cpf/Cnpj</vs-th>
                <vs-th sort-key="nome">Nome</vs-th>
                <vs-th sort-key="nome">Endereço</vs-th>
                <vs-th sort-key="nome">Cidade</vs-th>
                <vs-th sort-key="nome">Estado</vs-th>
            </template>
            <template slot-scope="{data}">
                <tbody id="div-with-loading-search" class="vs-con-loading__container vs-con-loading-search">
                    <vs-tr :state="data[indextr].ativo === 0 ? 'danger':data[indextr].inadimplente !== 0 ? 'warning':null" :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].cpfCnpj">
                            <p class="product-name font-medium">{{ tr.cpfCnpj }}</p>
                        </vs-td>
                        <vs-td :data="data[indextr].nome">
                            <p class="product-name font-medium">{{ tr.nome }}</p>
                        </vs-td>
                        <vs-td :data="data[indextr].endereco">
                            <p class="product-name font-medium">{{ tr.endereco.endereco +', '+tr.endereco.numero+', '+tr.endereco.bairro }}</p>
                        </vs-td>
                        <vs-td :data="data[indextr].endereco">
                            <p class="product-name font-medium">{{ tr.endereco.cidade }}</p>
                        </vs-td>
                        <vs-td :data="data[indextr].endereco">
                            <p class="product-name font-medium">{{ tr.endereco.estado }}</p>
                        </vs-td>
                    </vs-tr>
                </tbody>
            </template>
        </vs-table>
        </div>
    </b-modal>
</template>    
<script>

import _ from 'lodash'
import vSelect from 'vue-select';
import ClienteDB from '../db/clienteDB'
import CidadeDB from '../db/cidadeDB'
import GrupoClienteDB from '../db/grupoClienteDB'
import Storage from '../utils/storage'

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
    }),
    watch: {
        estadoSelecionado(newValue, oldValue) {
            if (newValue !== null || oldValue !== null) {
                this.searchFindCliente();
                this.searchCidades();
            }
        },
        cidadeSelecionada(newValue, oldValue) {
            if (newValue !== null || oldValue !== null) {
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
            return _.sortedUniq(this.cidadesFiltro.map((cidade) => {
                return {value: cidade.idCidade, label: cidade.nome};
            }));
        }
    },
    methods: {
        zoomSearch() {
            this.cnpjCpfSearch = "";
            this.nomeSearch = "";
        },
        selectSearchProduto(cliente) {
            GrupoClienteDB.getById(cliente.grupoCliente).then((grupo) => {
                cliente.grupoCliente = grupo;
                Storage.setGrupoCarrinho(grupo);
                Storage.setClienteCarrinho(cliente);
                this.$bvModal.hide(this.id);
                this.$emit('search-selected', cliente);
            })
        },
        searchCidades() {
           CidadeDB.getCidadesFromEstado(this.estadoSelecionado.uf).then((cidades) => {
                this.cidadesFiltro = cidades;
            })
        },
        searchFindCliente() {
            if ((this.estadoSelecionado && this.cidadeSelecionada && this.cidadeSelecionada.value != null) || (this.cnpjCpfSearch && this.cnpjCpfSearch.length >= 3) || (this.nomeSearch && this.nomeSearch.length >= 3)) {
                this.$vs.loading({ container: '#div-with-loading-search', scale: 0.6 });
                const uf = this.estadoSelecionado.uf;
                const idCidade = this.cidadeSelecionada ? this.cidadeSelecionada.value : 0;
                const cnpjCpf = this.cnpjCpfSearch;
                const nome = this.nomeSearch;
                ClienteDB.getClientesSearch(uf, idCidade, cnpjCpf, nome).then((clientes) => {
                    this.listaPesquisa = clientes;
                    this.$vs.loading.close('#div-with-loading-search > .con-vs-loading');
                });
            } else {
                if (this.estadoSelecionado) {                    	
                    const uf = this.estadoSelecionado.uf;

                    ClienteDB.getClientesSearch(uf, 0, null, null).then((clientes) => {
                        this.listaPesquisa = clientes;
                        this.$vs.loading.close('#div-with-loading-search > .con-vs-loading');
                    });
                }else{
                    this.listaProdutosPesquisa = [];
                    this.$vs.loading.close('#div-with-loading-search > .con-vs-loading');
                }
            }
            
        },
        createEstadoSelect(estado) {
            return {value: estado.id, label: estado.nome, uf: estado.sigla};
        }
    
    },
    beforeCreate() {              
    },
    created() {
    },
    beforeMount() {
        CidadeDB.getEstados().then((estados) => {
            this.estadosFiltro = estados;
            this.estadoSelecionado = this.createEstadoSelect(_.find(estados, (estado) => { return estado.sigla === Storage.getUsuario().estado; }));
        })
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

.vs-table--content{
    max-height: 580px;
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
    
</style>