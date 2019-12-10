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
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                const grupo = _.find(resultDocs.rows, (grupo) => { return grupo.doc.padrao; });
                delete grupo.doc['_rev'];
                resolve(grupo.doc)
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    getById(idGrupoCliente) {
        return new Promise((resolve) => {
            this._localDB.get(_.toString(idGrupoCliente)).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                resolve(null);
            });
        });
    }

}

export default new grupoClienteDB();