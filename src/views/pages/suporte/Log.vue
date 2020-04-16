<template>
    <div>
        <div class="mt-5">
            <div style="margin-bottom:15px;margin-top:15px;display:flex;justify-content:flex-end">
                <vs-button
                    color="primary"
                    icon-pack="feather"
                    icon="icon-archive"
                    class="mb-2 w-full"
                    @click="alertLimparLogs()"
                    >Limpar Logs</vs-button>
            </div>
            <vs-tabs alignment="fixed">
                <vs-tab label="Tela">
                    <div>
                        <vs-table :sst="true" pagination max-items="8" search :data="errosTela">
                            <template slot="thead">
                                <vs-th sort-key="messagem">Mensagem</vs-th>
                                <vs-th sort-key="_id">Data</vs-th>
                                <vs-th sort-key="_id">Hora</vs-th>
                                <vs-th sort-key="compnente">Componente</vs-th>
                                <vs-th width="40" sort-key="caminho">Caminho</vs-th>
                                <vs-th width="40" sort-key="erro">Erro</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].messagem">{{ data[indextr].messagem }}</vs-td>
                                <vs-td :data="data[indextr]._id">
                                    <span style="color:red;">{{ data[indextr]._id | formatDate }}</span>
                                </vs-td>
                                <vs-td :data="data[indextr]._id">
                                    <span style="color:red;">{{ data[indextr]._id | formatTime }}</span>
                                </vs-td>
                                <vs-td :data="data[indextr].compnente">{{ data[indextr].compnente }}</vs-td>
                                <vs-td :data="data[indextr].caminho">
                                    {{diminuirCaminho(data[indextr].caminho)}}
                                </vs-td>
                                <vs-td class="align-center" :data="data[indextr].caminho">
                                    <span
                                    style="display: block;width: 60px;overflow: hidden;text-overflow: ellipsis;"
                                    >{{ data[indextr].erro }}</span>
                                </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vs-tab>
                <vs-tab label="Sincronização">
                    <vs-table :sst="true" pagination max-items="8" search :data="errosSincronizacao">
                        <template slot="thead">
                            <vs-th sort-key="messagem">Mensagem</vs-th>
                            <vs-th sort-key="_id">Data</vs-th>
                            <vs-th sort-key="_id">Hora</vs-th>
                            <vs-th sort-key="compnente">Componente</vs-th>
                            <vs-th width="40" sort-key="caminho">Caminho</vs-th>
                            <vs-th width="40" sort-key="erro">Erro</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].messagem">{{ data[indextr].messagem }}</vs-td>
                            <vs-td :data="data[indextr]._id">
                                <span style="color:red;">{{ data[indextr]._id | formatDate }}</span>
                            </vs-td>
                            <vs-td :data="data[indextr]._id">
                                <span style="color:red;">{{ data[indextr]._id | formatTime }}</span>
                            </vs-td>
                            <vs-td :data="data[indextr].compnente">{{ data[indextr].compnente }}</vs-td>
                            <vs-td :data="data[indextr].caminho">
                                {{diminuirCaminho(data[indextr].caminho)}}
                            </vs-td>
                            <vs-td class="align-center" :data="data[indextr].caminho">
                                <span
                                style="display: block;width: 60px;overflow: hidden;text-overflow: ellipsis;"
                                >{{ data[indextr].erro }}</span>
                            </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab label="Banco de Dados">
                    <vs-table :sst="true" pagination max-items="8" search :data="errosDB">
                        <template slot="thead">
                            <vs-th sort-key="messagem">Mensagem</vs-th>
                            <vs-th sort-key="_id">Data</vs-th>
                            <vs-th sort-key="_id">Hora</vs-th>
                            <vs-th sort-key="compnente">Componente</vs-th>
                            <vs-th width="40" sort-key="caminho">Caminho</vs-th>
                            <vs-th width="40" sort-key="erro">Erro</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].messagem">{{ data[indextr].messagem }}</vs-td>
                            <vs-td :data="data[indextr]._id">
                                <span style="color:red;">{{ data[indextr]._id | formatDate }}</span>
                            </vs-td>
                            <vs-td :data="data[indextr]._id">
                                <span style="color:red;">{{ data[indextr]._id | formatTime }}</span>
                            </vs-td>
                            <vs-td :data="data[indextr].compnente">{{ data[indextr].compnente }}</vs-td>
                            <vs-td :data="data[indextr].caminho">
                                {{diminuirCaminho(data[indextr].caminho)}}
                            </vs-td>
                            <vs-td class="align-center" :data="data[indextr].caminho">
                                <span
                                style="display: block;width: 60px;overflow: hidden;text-overflow: ellipsis;"
                                >{{ data[indextr].erro }}</span>
                            </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab label="Carrinho">
                    <div style="margin-bottom:15px;margin-top:15px;">
                        <vs-button color="warning" icon-pack="feather" icon="icon-archive" class="mb-2 w-full" @click="alertLimparCarrinho()">Limpar Carrinho</vs-button>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
    </div>
</template>

<script>
import CarrinhoDB from "../../../rapidsoft/db/carrinhoDB";
import ErrorDB from "../../../rapidsoft/db/errorDB";

export default {
  data() {
    return {
        colorLoading: "primary",
        backgroundLoading: "primary",
        errosTela: [],
        errosSincronizacao: [],
        errosDB: [],
        quota: 0,
        usage: 0,
        browserName: null,
        majorVersion: null,
        sistemaOperacional: null,
        armazenamentoIndexedDB: null
    };
  },
  computed: {
    isIOS() {
      return this.$store.state.isIOS;
    },
    token() {
      return JSON.parse(localStorage.getItem("token"));
    }
  },
  methods: {
    diminuirCaminho(caminho){
      const removeHttp = caminho.substring(caminho.indexOf("http://") + 7);
      const caminhoErro = removeHttp.substring(removeHttp.indexOf("/"));
      return caminhoErro;
    },
    listarErros() {
        ErrorDB.listar().then(errorReturn => {
            let errorsLocal = this.lodash.clone(errorReturn);
            errorsLocal.forEach(error => {
                if (error.type === "tela") {
                    this.errosTela.push(this.lodash.clone(error));
                } else if (error.type === "sincronizacao") {
                    this.errosSincronizacao.push(this.lodash.clone(error));
                } else if (error.type === "DB") {
                    this.errosDB.push(this.lodash.clone(error));
                }
            });
        });
    },
    openLoading() {
        this.$vs.loading({ color: this.colorLoading });
        setTimeout(() => {
            this.$vs.loading.close();
        }, 2000);
    },
    deletarLogs() {
      ErrorDB._limparBase();
      this.listarErros();
    },
    alertLimparLogs() {
        this.$vs.dialog({
            type: "confirm",
            color: "warning",
            title: `Atenção`,
            text: "Deseja remover os logs de sistema ?",
            acceptText: "Sim",
            cancelText: "Não",
            accept: this.deletarLogs
        });
    },
    deletarCarrinho() {
        this.$vs.loading({ color: this.colorLoading });
        CarrinhoDB.deleteCarrinho().then(() => {
            setTimeout(() => {
                    this.$vs.notify({
                    title: 'Removido',
                    text: 'Carrinho removido com successo!',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                this.$vs.loading.close();
            }, 2000);
        });
    },
    alertLimparCarrinho() {
        this.$vs.dialog({
            type: "confirm",
            color: "warning",
            title: `Atenção`,
            text: "Deseja realmente apagar seu carrinho ?",
            acceptText: "Sim",
            cancelText: "Não",
            accept: this.alertComfimLimparCarrinho
        });
    },
    alertComfimLimparCarrinho() {
        this.$vs.dialog({
            type: "confirm",
            color: "danger",
            title: `Atenção`,
            text: "Tem realmente certeza que deseja apagar seu carrinho ?",
            acceptText: "Sim, Tenho certeza!",
            cancelText: "Não, espera, calma aê!",
            accept: this.deletarCarrinho
        });
    }
  },
  created() {
    this.listarErros();
  },
  mounted() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
        navigator.storage.estimate().then(({ usage, quota }) => {
            this.usage = this.lodash.round(this.lodash.divide(this.lodash.divide(usage, 1024), 1024), 1);
            this.quota = this.lodash.round(this.lodash.divide(this.lodash.divide(quota, 1024), 1024));
        }).catch(error => {
            console.error("Loading storage estimate failed:");
            console.log(error.stack);
        });
    } else {
        console.error("navigator.storage.estimate API unavailable.");
    }
  },
  beforeCreate() {
    if (!window.indexedDB) {
      window.alert(
        "Seu navegador não suporta uma versão estável do IndexedDB. Alguns recursos não estarão disponíveis."
      );
    }
  },
  beforeMount() {}
};
</script>