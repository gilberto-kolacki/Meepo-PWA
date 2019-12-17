/*=========================================================================================
  File Name: grupoClienteDB.js
  Description: Classe de banco de Grupo de clientes
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import BasicDB from './basicDB'
import ErrorDB from './errorDB'
import _ from 'lodash';

class grupoClienteDB extends BasicDB {

    constructor() {
        super("grupo_cliente");
    }

    salvarSinc(gruposCliente) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(gruposCliente.length > 0) {
                    const done = _.after(gruposCliente.length, () => resolve());
                    gruposCliente.forEach(grupo => {
                        grupo._id = _.toString(grupo.id);
                        this._localDB.put(grupo).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    getGrupoPadrao() {
        return new Promise((resolve) => {
            this._getAll().then((grupos) => {
                const grupo = grupos.filter((grupo) => grupo.padrao)[0];
                resolve(grupo)
            }).catch((err) => {
                ErrorDB.criarLogDB({url:'db/grupoClienteDB',method:'getGrupoPadrao',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

    getById(idGrupoCliente) {
        return new Promise((resolve) => {
            this._getById(idGrupoCliente).then((grupo) => {
                if (grupo.existe) {
                    resolve(grupo.result);
                } else {
                    ErrorDB.criarLogDB({url:'db/grupoClienteDB',method:'getById',message: 'Grupo de cliente não encontrado: '+idGrupoCliente ,error:'Failed Request'});
                    this.getGrupoPadrao().then((grupoPadrao) => {
                        resolve(grupoPadrao);
                    });
                }
            });
        });
    }

}

export default new grupoClienteDB();