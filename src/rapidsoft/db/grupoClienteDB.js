/*=========================================================================================
  File Name: grupoClienteDB.js
  Description: Classe de banco de Grupo de clientes
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after'; 
import BasicDB from './basicDB';

class grupoClienteDB extends BasicDB {

    constructor() {
        super("grupo_cliente");
        this.grupo_chave = "grupo_padrao";
        this._createIndex('padrao');
    }

    salvarSinc(gruposCliente) {
        return new Promise((resolve, reject) => {
            this._limparBase().then(() => {
                if(gruposCliente.length > 0) {
                    const done = After(gruposCliente.length, () => resolve());
                    gruposCliente.forEach((grupo) => {
                        grupo.porcentagem = Number(grupo.porcentagem);
                        if (grupo.padrao) {
                            localStorage.setItem("grupo_padrao", JSON.stringify(grupo));
                        }
                        this._salvar(grupo).then(() => {
                            done();
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    findById(idGrupo) {
        return new Promise((resolve) => {
            this._getById(idGrupo).then((result) => {
                resolve(result.value);
            });
        });
    }

    setGrupoPadrao(grupoCliente) {
        localStorage.setItem(this.grupo_chave, JSON.stringify(grupoCliente));
    }

    getGrupoPadrao() {
        return JSON.parse(localStorage.getItem(this.grupo_chave));
    }

    getById(idGrupoCliente) {
        return new Promise((resolve) => {
            this._getById(idGrupoCliente).then((grupo) => {
                if (grupo.existe) {
                    resolve(grupo.value);
                } else {
                    this._criarLogDB({url:'db/grupoClienteDB',method:'getById',message: 'Grupo de cliente não encontrado: '+idGrupoCliente ,error:'Failed Request'});
                    resolve(this.getGrupoPadrao());
                }
            });
        });
    }

}

export default new grupoClienteDB();