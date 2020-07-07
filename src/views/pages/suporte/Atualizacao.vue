<template>
  <div class="flex w-full vx-row no-gutter items-center justify-center" id="page-atualizacao">
    <div class="vx-col w-full md:w-1/2">
      <vx-card class="text-center cursor-pointer">
        <img
          :src="require(`@/assets/images/pages/graphic-6.png`)"
          alt="graphic"
          width="180"
          class="mx-auto mb-4"
        />
        <h4 class="mb-4">Dados da Aplicação</h4>
        <b-list-group>
          <b-list-group-item>Aplicação: {{usage}} MB - {{quota}}MB</b-list-group-item>
          <b-list-group-item>Sistema: {{sistemaOperacional}}</b-list-group-item>
          <b-list-group-item>Navegador: {{browserName}} v{{majorVersion}}</b-list-group-item>
          <b-list-group-item>Token: {{token}}</b-list-group-item>
          <b-list-group-item>Data Vencimento: {{dataVencimento}}</b-list-group-item>
          <b-list-group-item>
            <vs-button
              color="primary"
              class="vs-con-loading__container w-full"
              id="button-with-loading"
              v-on:click.stop="verificar()"
              type="relief"
              ref="loadableButton"
            >Verificar Atualização</vs-button>
          </b-list-group-item>
          <b-list-group-item v-if="visible">
            <vs-button
              color="primary"
              class="vs-con-loading__container w-full"
              id="button-with-loading"
              v-on:click.stop="atualizar()"
              type="relief"
              ref="loadableButton"
            >Atualizar</vs-button>
          </b-list-group-item>
        </b-list-group>
      </vx-card>
    </div>
  </div>
</template>

<script>
import ErrorDB from "../../../rapidsoft/db/errorDB";

export default {
    data() {
        return {
            backgroundLoading: "primary",
            colorLoading: "#fff",
            clientes: [],
            quota: 0,
            usage: 0,
            browserName: null,
            majorVersion: null,
            sistemaOperacional: null,
            visible: false,
            registration: null,
        };
    },
    computed: {
        isIOS() {
            return this.$store.state.isIOS;
        },
        token() {
            return JSON.parse(localStorage.getItem("token"));
        },
        dataVencimento() {
            let data = new Date(parseInt(localStorage.getItem("tokenExpiry")));
            let dia = data.getDate();
            let mes = data.getMonth() + 1;
            let ano = data.getFullYear();
            return (
                (dia <= 9 ? "0" + dia : dia) +
                "/" +
                (mes <= 9 ? "0" + mes : mes) +
                "/" +
                ano
            );
        }
    },
    methods: {
        onServiceWorkerUpdated(e) {
            this.registration = e.detail.registration;
            this.visible = true;
        },
        verificar() {
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            });
            setTimeout(() => {
                this.$vs.loading.close("#button-with-loading > .con-vs-loading");
            }, 3000);

            window.location.reload(true);
        },
        atualizar() {
            if (this.registration && this.registration.waiting) {
                // this event is being listened by src/service-worker.js
                this.registration.waiting.postMessage('skipWaiting');
                window.location.reload();
            } else {
                console.warn("No service worker waiting to be activated");
                this.visible = false;
            }
        },
        getNavegador() {
            const nAgt = navigator.userAgent;
            let fullVersion = "" + parseFloat(navigator.appVersion);
            let nameOffset, verOffset, ix;

            if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                this.browserName = "Chrome";
                fullVersion = nAgt.substring(verOffset + 7);
            } else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
                this.browserName = "Safari";
                fullVersion = nAgt.substring(verOffset + 7);
                if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
            } else if (
                (nameOffset = nAgt.lastIndexOf(" ") + 1) <
                (verOffset = nAgt.lastIndexOf("/"))
            ) {
                this.browserName = nAgt.substring(nameOffset, verOffset);
                fullVersion = nAgt.substring(verOffset + 1);
                if (this.browserName.toLowerCase() == this.browserName.toUpperCase()) {
                this.browserName = navigator.appName;
                }
            }
            // trim the fullVersion string at semicolon/space if present
            if ((ix = fullVersion.indexOf(";")) != -1)
                fullVersion = fullVersion.substring(0, ix);
            if ((ix = fullVersion.indexOf(" ")) != -1)
                fullVersion = fullVersion.substring(0, ix);

            this.majorVersion = this.lodash.round(parseFloat(fullVersion), 1);
            if (isNaN(this.majorVersion)) {
                fullVersion = "" + parseFloat(navigator.appVersion);
                this.majorVersion = parseInt(navigator.appVersion, 10);
            }
        },
        getSistema() {
            if (navigator.userAgent.indexOf("Windows") != -1) {
                if (navigator.userAgent.indexOf("NT 10.0") != -1)
                this.sistemaOperacional = "Windows 10";
                else if (navigator.userAgent.indexOf("NT 6.2") != -1)
                this.sistemaOperacional = "Windows 8";
                else if (navigator.userAgent.indexOf("NT 6.1") != -1)
                this.sistemaOperacional = "Windows 7";
                else this.sistemaOperacional = "Windows Old Version";
            } else if (
                navigator.userAgent.indexOf("iPhone") != -1 ||
                navigator.userAgent.indexOf("iPad") != -1
            ) {
                if (navigator.userAgent.indexOf("OS 12_4") != -1)
                this.sistemaOperacional = "IOS 12.4";
                else if (navigator.userAgent.indexOf("OS 12_3") != -1)
                this.sistemaOperacional = "IOS 12.3";
                else if (navigator.userAgent.indexOf("OS 12") != -1)
                this.sistemaOperacional = "IOS 12";
                else this.sistemaOperacional = "IOS";
            } else if (navigator.userAgent.indexOf("Mac") != -1)
                this.sistemaOperacional = "Mac";
            else if (navigator.userAgent.indexOf("X11") != -1)
                this.sistemaOperacional = "UNIX";
            else if (navigator.userAgent.indexOf("Linux") != -1)
                this.sistemaOperacional = "Linux";
            else this.sistemaOperacional = "Não Identificado";
        },
    },
    created() {
        this.getNavegador();
        this.getSistema();
        // this event is being triggered by src/registerServiceWorker.js
        window.addEventListener('onServiceWorkerUpdated', this.onServiceWorkerUpdated);
        // DEBUG HELPER: uncomment this in case you need to see the dialog without doing the whole service worker flow.
    },
    destroyed() {
        window.removeEventListener('onServiceWorkerUpdated', this.onServiceWorkerUpdated);
    },
    mounted() {
        if ("storage" in navigator && "estimate" in navigator.storage) {
            navigator.storage.estimate().then(({ usage, quota }) => {
                this.usage = this.lodash.round(this.lodash.divide(this.lodash.divide(usage, 1024), 1024), 1);
                this.quota = this.lodash.round(this.lodash.divide(this.lodash.divide(quota, 1024), 1024));
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
            window.alert("Seu navegador não suporta uma versão estável do IndexedDB. Alguns recursos não estarão disponíveis.");
        }
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({ err, vm, info });
        return true;
    }
};
</script>

