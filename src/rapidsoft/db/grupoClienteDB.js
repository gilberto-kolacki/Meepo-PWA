/*=========================================================================================
  File Name: grupoClienteDB.js
  Description: Classe de banco de Grupo de clientes
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("grupo_cliente").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class grupoClienteDB {

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    salvarSinc(gruposCliente) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(gruposCliente.length > 0) {
                    const done = _.after(gruposCliente.length, () => resolve());
                    gruposCliente.forEach(grupo => {
                        grupo._id = _.toString(grupo.id);
                        localDB.put(grupo).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    getAll() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((grupo) => {
                    if (grupo.doc['nome']) {
                        delete grupo.doc['_rev'];
                        return _.clone(grupo.doc);
                    }
                }))
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    getGrupoPadrao() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
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
            localDB.get(_.toString(idGrupoCliente)).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                resolve(null);
            });
        });
    }

}

export default new grupoClienteDB();