<template>
    <div class="parentx">
        <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" icon="icon-play" @click="gerarPedidos()">Finalizar</vs-button>
        <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" @click="voltarCarrinho()" icon="icon-arrow-down">Carrinho</vs-button>

        <div class="mt-5">
            <vs-tabs alignment="fixed">
                <vs-tab label="Capa" icon-pack="feather" icon="icon-file-text">
                    <div class="my-6" v-if="this.pedidoCapa">
                        <div class="vx-row">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="2" vs-sm="3" vs-xs="12" >
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                    <label for="" class="vs-input--label">CPF/CNPJ</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required|min:14'" id="cpfCnpj" disabled name="cpfCnpj" v-model="pedidoCapa.cliente.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                    </div>
                                </div>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="8" vs-sm="9" vs-xs="12">
                                <vs-input v-validate="'required'" label="Nome" id="nome" name="nome" disabled v-model="pedidoCapa.cliente.nome" class="w-full input-line-group-rapid" />
                                <vs-button
                                    color="primary"
                                    type="filled"
                                    icon-pack="feather"
                                    class="w-full btn-line-group-rapid"
                                    icon="icon-search"
                                    @click.stop="abrirPesquisaCliente()"
                                ></vs-button>
                            </vs-col>
                        </div>
                        <div class="vx-row">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                                <vs-input label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="pedidoCapa.cliente.emailNfe" class="w-full" type="email" />
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="12">
                                <vs-input label="Grupo Cliente" id="grupoCliente" name="grupoCliente" v-model="pedidoCapa.cliente.grupoCliente.nome" disabled class="w-full" type="text" />
                            </vs-col>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col w-full">
                                <label for="estadosFiltro" class="vs-input--label">Endereçco de entrega</label>
                                <v-select id="endEntrega" required=true name="endEntrega" :clearable=false v-model="pedidoCapa.endEntrega" :options="getEnderecosEntrega" :dir="$vs.rtl ? 'rtl' : 'ltr'"/> 
                            </div>
                        </div>
                        <div class="vx-row">
                        </div>
                    </div>

                </vs-tab>
                <vs-tab label="Pedidos" icon-pack="feather" icon="icon-box">
                    <div class="demo-alignment">
                        <div class="dropdown-button-container">
                            <vs-dropdown>
                                <vs-button class="btn-drop" type="filled" icon="expand_more">Ações</vs-button>
                                <vs-dropdown-menu>
                                    <vs-dropdown-item>
                                        <span class="flex items-center">
                                            <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                                            <!-- <span @click="deleteItemsChart">Deletar</span> -->
                                        </span>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </div>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
        <search-cliente @search-selected="selectSearchCliente" :id="idPopUpSearch"></search-cliente>
    </div>
</template>
<script>
// import _ from "lodash";
import ErrorDB from "../db/errorDB";
// import Storage from "../utils/storage";
import PedidoUtils from "../utils/pedidoUtils";
import SearchCliente  from './SearchCliente'
// import ProdutoDB from "../../rapidsoft/db/produtoDB";
// import UtilMask from '../../rapidsoft/utils/utilMask'
// import ProdutoUtils from '../../rapidsoft/utils/produtoUtils'
// import EmbarqueDB from "../../rapidsoft/db/embarqueDB";
import vSelect from 'vue-select';

export default {
    name: 'carrinho-pedido',
    props: {
        segmento: {
            type: Object,
            required: false,
        },
    },
	data: () => ({
        clientePedido: null,
        pedidoCapa: null,
        idPopUpSearch: 'popup-cliente-search',
    }),
    watch: {
        
    },
	components: {
        SearchCliente,
        'v-select': vSelect,
	},
	computed: {
        getEnderecosEntrega() {
            return [];
        }
         
	},
    methods: {
		gerarPedidos() {

        },
        voltarCarrinho() {
            this.$emit('voltar-carrinho');
        },
        abrirPesquisaCliente() {
			this.$bvModal.show(this.idPopUpSearch);
        },
        selectSearchCliente(cliente) {
            this.clientePedido = cliente;
            
		}
	},
	beforeCreate() {		
	},
	created() {
        
	},
    mounted() {
        PedidoUtils.newPedido().then((pedido) => {
            this.pedidoCapa = pedido;
        });
    },
	errorCaptured(err, vm, info) {
        ErrorDB.criarLog({ err, vm, info });
        return true;
    }

};
</script>

<style lang="scss">

.carrinho-item {
    padding:10px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2); 
    margin-top:10px;
}

.input-line-group-rapid {
    input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
}

.btn-line-group-rapid {
    margin-top: 26px;
    height: 43px !important;
    width: 15% !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

</style>