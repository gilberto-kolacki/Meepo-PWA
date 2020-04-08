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
        this._createIndex('padrao');
    }

    salvarSinc(gruposCliente) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(gruposCliente.length > 0) {
                    const done = After(gruposCliente.length, () => resolve());
                    gruposCliente.forEach(grupo => {
                        grupo.porcentagem = Number(grupo.porcentagem);
                        this._salvar(grupo).then(() => done()).catch(() => done());
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

    getGrupoPadrao() {
        return new Promise((resolve) => {
            this._getFindCondition({padrao: {$eq: true}}).then((result) => {
                if (result.length >= 1) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    getById(idGrupoCliente) {
        return new Promise((resolve) => {
            this._getById(idGrupoCliente).then((grupo) => {
                if (grupo.existe) {
                    resolve(grupo.value);
                } else {
                    this._criarLogDB({url:'db/grupoClienteDB',method:'getById',message: 'Grupo de cliente não encontrado: '+idGrupoCliente ,error:'Failed Request'});
                    this.getGrupoPadrao().then((grupoPadrao) => {
                        resolve(grupoPadrao);
                    });
                }
            });
        });
    }

}

export default new grupoClienteDB();