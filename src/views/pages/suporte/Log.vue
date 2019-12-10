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
                    <span style="color:red;">{{ getDateFromStringDate(data[indextr]._id) }}</span>
                  </vs-td>
                  <vs-td :data="data[indextr]._id">
                    <span style="color:red;">{{ getHourError(data[indextr]._id) }}</span>
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
          <div>
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
                    <span style="color:red;">{{ getDateFromStringDate(data[indextr]._id) }}</span>
                  </vs-td>
                  <vs-td :data="data[indextr]._id">
                    <span style="color:red;">{{ getHourError(data[indextr]._id) }}</span>
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
      </vs-tabs>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import ClienteDB from "../../../rapidsoft/db/clienteDB";
import ErrorDB from "../../../rapidsoft/db/errorDB";
import ProdutoDB from "../../../rapidsoft/db/produtoDB";

export default {
  data() {
    return {
      colorLoading: "primary",
      backgroundLoading: "primary",
      errosTela: [],
      errosSincronizacao: [],
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
      console.log(caminho);
      const removeHttp = caminho.substring(caminho.indexOf("http://") + 7);
      const caminhoErro = removeHttp.substring(removeHttp.indexOf("/"));
      return caminhoErro;
    },
    listarErros() {
      ErrorDB.listar().then(errorReturn => {
        let errorsLocal = _.clone(errorReturn);
        errorsLocal.forEach(error => {
          if (error.type === "tela") {
            this.errosTela.push(_.clone(error));
          } else if (error.type === "sincronizacao") {
            this.errosSincronizacao.push(_.clone(error));
          }
        });
      });
    },
    getDateFromStringDate(inputFormat) {
      function pad(valueDate) {
        return valueDate < 10 ? "0" + valueDate : valueDate;
      }
      var date = new Date(parseInt(inputFormat));
      return [
        pad(date.getDate()),
        pad(date.getMonth() + 1),
        date.getFullYear()
      ].join("/");
    },
    getHourError(inputFormat) {
      function pad(valueDate) {
        return valueDate < 10 ? "0" + valueDate : valueDate;
      }
      var date = new Date(parseInt(inputFormat));
      return [
        pad(date.getUTCHours() - 3),
        pad(date.getUTCMinutes()),
        pad(date.getUTCSeconds())
      ].join(":");
    },
    openLoading() {
      this.$vs.loading({ color: this.colorLoading });
      setTimeout(() => {
        this.$vs.loading.close();
      }, 2000);
    },
    deletarLogs() {
      ErrorDB.limparBase();
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
    }
  },
  created() {
    this.listarErros();
  },
  mounted() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage
        .estimate()
        .then(({ usage, quota }) => {
          this.usage = _.round(_.divide(_.divide(usage, 1024), 1024), 1);
          this.quota = _.round(_.divide(_.divide(quota, 1024), 1024));
        })
        .catch(error => {
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