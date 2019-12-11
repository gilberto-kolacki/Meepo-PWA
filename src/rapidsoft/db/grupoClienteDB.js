/*=========================================================================================
  File Name: grupoClienteDB.js
  Description: Classe de banco de Grupo de clientes
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import BasicDB from './basicDB'
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
            })
        });
    }

    getGrupoPadrao() {
        return new Promise((resolve) => {
            this._getAll().then((grupos) => {
                const grupo = _.find(grupos, (grupo) => { return grupo.padrao; });
                resolve(grupo)
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    getById(idGrupoCliente) {
        return new Promise((resolve) => {
            this._getById(idGrupoCliente).then((grupo) => {
                resolve(grupo.result);
            });
        });
    }

}

export default new grupoClienteDB();