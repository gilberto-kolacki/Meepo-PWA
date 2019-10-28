/*=========================================================================================
  File Name: prontaEntregaDB.js
  Description: Classe de banco de Produtos pronta entrega
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("pronta_entrega").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class prontaEntregaDB {

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    salvarSinc(prontasEntregas) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(prontasEntregas.length > 0) {
                    const done = _.after(prontasEntregas.length, () => resolve());
                    prontasEntregas.forEach(prontaEntrega => {
                        prontaEntrega._id = _.toString(prontaEntrega.id);
                        localDB.put(prontaEntrega).then(() => done()).catch(() => done());
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
                resolve(resultDocs.rows.map((prontaEntrega) => {
                    if (prontaEntrega.doc['nome']) {
                        delete prontaEntrega.doc['_rev'];
                        return _.clone(prontaEntrega.doc);
                    }
                }))
            }).catch((err) => {
                resolve(err);
            });
        });
    }

}

export default new prontaEntregaDB();