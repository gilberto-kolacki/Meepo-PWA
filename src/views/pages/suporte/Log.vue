<template>
  <vs-table stripe :data="errors">

    <template slot="thead">
      <vs-th>Caminho</vs-th>
      <vs-th>Componente</vs-th>
      <vs-th>Erro</vs-th>
      <vs-th>Mensagem</vs-th>
    </template>

    <template slot-scope="{data}">
      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
        <vs-td :data="data[indextr].caminho">
          {{ data[indextr].caminho }}
        </vs-td>
        <vs-td :data="data[indextr].compnente">
          {{ data[indextr].compnente }}
        </vs-td>
        <vs-td :data="data[indextr].erro">
          {{ data[indextr].erro }}
        </vs-td>
        <vs-td :data="data[indextr].messagem">
          {{ data[indextr].messagem }}
        </vs-td>
      </vs-tr>
    </template>

  </vs-table>
</template>

<script>

import _ from 'lodash';
import sizeOf from 'object-sizeof'
import ClienteDB from '../../../rapidsoft/db/clienteDB'
import errorDB from '../../../rapidsoft/db/errorDB'
import ProdutoDB from '../../../rapidsoft/db/produtoDB'
import ImagemDB from '../../../rapidsoft/db/imagemDB'

export default {
    data() {
        return { 
            backgroundLoading:'primary',
            colorLoading:'#fff',
            errors: [],
            quota: 0,
            usage:0,
            browserName: null,
            majorVersion: null,
            sistemaOperacional: null,
            armazenamentoIndexedDB: null,

        }
    },
    computed: {
        isIOS() {
            return this.$store.state.isIOS;
        },
        token() {
            return JSON.parse(localStorage.getItem("token"));
        },
    },
    methods: {
        getNavegador() {
            const nAgt = navigator.userAgent;
            let fullVersion  = ''+parseFloat(navigator.appVersion); 
            let nameOffset,verOffset,ix;

            if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
                this.browserName = "Chrome";
                fullVersion = nAgt.substring(verOffset+7);
            }
            else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
                this.browserName = "Safari";
                fullVersion = nAgt.substring(verOffset+7);
                if ((verOffset=nAgt.indexOf("Version"))!=-1) fullVersion = nAgt.substring(verOffset+8);
            }
            else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/'))) {
                this.browserName = nAgt.substring(nameOffset,verOffset);
                fullVersion = nAgt.substring(verOffset+1);
                if (this.browserName.toLowerCase()==this.browserName.toUpperCase()) {
                    this.browserName = navigator.appName;
                }
            }
            // trim the fullVersion string at semicolon/space if present
            if ((ix=fullVersion.indexOf(";"))!=-1) fullVersion=fullVersion.substring(0,ix);
            if ((ix=fullVersion.indexOf(" "))!=-1) fullVersion=fullVersion.substring(0,ix);

            this.majorVersion = _.round(parseFloat(fullVersion), 1);
            if (isNaN(this.majorVersion)) {
                fullVersion  = ''+parseFloat(navigator.appVersion); 
                this.majorVersion = parseInt(navigator.appVersion,10);
            }
        },
        getSistema() {
            if (navigator.userAgent.indexOf("Windows")!= -1) {
                if (navigator.userAgent.indexOf("NT 10.0")!= -1) this.sistemaOperacional="Windows 10";
                else if (navigator.userAgent.indexOf("NT 6.2") != -1) this.sistemaOperacional="Windows 8";
                else if (navigator.userAgent.indexOf("NT 6.1") != -1) this.sistemaOperacional="Windows 7";
                else this.sistemaOperacional="Windows Old Version";
                
            } else if(navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("iPad") != -1) {
                if(navigator.userAgent.indexOf("OS 12_4") != -1) this.sistemaOperacional="IOS 12.4";
                else if(navigator.userAgent.indexOf("OS 12_3") != -1) this.sistemaOperacional="IOS 12.3";
                else if(navigator.userAgent.indexOf("OS 12") != -1) this.sistemaOperacional="IOS 12";
                else this.sistemaOperacional="IOS";
            } 
            else if (navigator.userAgent.indexOf("Mac") != -1) this.sistemaOperacional="Mac";
            else if (navigator.userAgent.indexOf("X11") != -1) this.sistemaOperacional="UNIX";
            else if (navigator.userAgent.indexOf("Linux") != -1) this.sistemaOperacional="Linux";
            else this.sistemaOperacional="Não Identificado";
        },
    },
    created() {
        this.getNavegador();
        this.getSistema();
        
        errorDB.listar().then(errorReturn => {
			let errorsLocal = _.clone(errorReturn);

			errorsLocal.forEach(error => {
                this.errors.push(_.clone(error));
            });
            console.log(this.errors);
            
		})
    },
    mounted() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(({usage, quota}) => {
                this.usage = _.round(_.divide(_.divide(usage, 1024), 1024), 1);
                this.quota = _.round(_.divide(_.divide(quota, 1024), 1024));
            }).catch(error => {
                console.error('Loading storage estimate failed:');
                console.log(error.stack);
            });
        } else {
            console.error('navigator.storage.estimate API unavailable.');
        }
    },
    beforeCreate() {
        if (!window.indexedDB) {
            window.alert("Seu navegador não suporta uma versão estável do IndexedDB. Alguns recursos não estarão disponíveis.");
        }
    },
    beforeMount() {
    }
}

</script>