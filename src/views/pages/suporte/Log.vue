<template>
  <div>
      <!-- *** -->
       
      <!-- *** -->
    <div class="mt-5">
      <vs-tabs alignment="fixed">
        <vs-tab label="Tela">
          <div>
            <div style="margin-bottom:15px;margin-top:15px;display:flex;justify-content:flex-end">
              <vs-button
                color="primary"
                icon-pack="feather"
                icon="icon-archive"
                class="mb-2 w-full"
                @click="deletarLogs()"
              >Limpar Logs</vs-button>
            </div>
            <vs-table stripe :data="errors">
              <template slot="thead">
                <vs-th>Caminho</vs-th>
                <vs-th>Data</vs-th>
                <vs-th>Componente</vs-th>
                <vs-th>Erro</vs-th>
                <vs-th>Mensagem</vs-th>
              </template>

              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].caminho">{{ data[indextr].caminho }}</vs-td>
                  <vs-td :data="data[indextr]._id">{{ getDateFromStringDate(data[indextr]._id) }}</vs-td>
                  <vs-td :data="data[indextr].compnente">{{ data[indextr].compnente }}</vs-td>
                  <vs-td :data="data[indextr].erro" style="width:20px">{{ data[indextr].erro }}</vs-td>
                  <vs-td :data="data[indextr].messagem">{{ data[indextr].messagem }}</vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
        </vs-tab>
        <vs-tab label="Sincronização">
          <div>
            <div style="margin-bottom:15px;margin-top:15px;display:flex;justify-content:flex-end">
              <vs-button
                color="primary"
                icon-pack="feather"
                icon="icon-archive"
                class="mb-2 w-full"
                @click="deletarLogs()"
              >Limpar Logs</vs-button>
            </div>
            <vs-table stripe :data="errors">
              <template slot="thead">
                <vs-th>Caminho</vs-th>
                <vs-th>Data</vs-th>
                <vs-th>Componente</vs-th>
                <vs-th>Erro</vs-th>
                <vs-th>Mensagem</vs-th>
              </template>

              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].caminho">{{ data[indextr].caminho }}</vs-td>
                  <vs-td :data="data[indextr]._id">{{ getDateFromStringDate(data[indextr]._id) }}</vs-td>
                  <vs-td :data="data[indextr].compnente">{{ data[indextr].compnente }}</vs-td>
                  <vs-td :data="data[indextr].erro">{{ data[indextr].erro }}</vs-td>
                  <vs-td :data="data[indextr].messagem">{{ data[indextr].messagem }}</vs-td>
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
import sizeOf from "object-sizeof";
import ClienteDB from "../../../rapidsoft/db/clienteDB";
import errorDB from "../../../rapidsoft/db/errorDB";
import ProdutoDB from "../../../rapidsoft/db/produtoDB";
import ImagemDB from "../../../rapidsoft/db/imagemDB";

export default {
  data() {
    return {
        colorLoading: 'primary',
        backgroundLoading: "primary",
        colorLoading: "#fff",
        errors: [],
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
    getDateFromStringDate(inputFormat) {
      function pad(valueDate) {
        return valueDate < 10 ? "0" + valueDate : valueDate;
      }
      var date = new Date(parseInt(inputFormat));
      return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join(
        "/"
      );
    },
    openLoading() {
      this.$vs.loading({ color: this.colorLoading })
      setTimeout(() => {
        this.$vs.loading.close()
      }, 2000);
    },
    deletarLogs() {
      errorDB.limparBase();
      errorDB.listar().then(errorReturn => {
        this.openLoading();
        let errorsLocal = _.clone(errorReturn);
        errorsLocal.forEach(error => {
          var data = new Date(parseInt(error._id));
          this.errors.push(_.clone(error));
        });
      });
    },
    // filtrarListaErrosTela(listaErros){
    //     console.log('Lista Erros: ', listaErros);
    // },
    // filtrarListaErrosSincronizacao(listaErros){
    //     console.log('Lista Erros: ', listaErros);
    // }
  },
  created() {
    errorDB.listar().then(errorReturn => {
      let errorsLocal = _.clone(errorReturn);
      errorsLocal.forEach(error => {
        var data = new Date(parseInt(error._id));
        this.errors.push(_.clone(error));
      });
    });
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