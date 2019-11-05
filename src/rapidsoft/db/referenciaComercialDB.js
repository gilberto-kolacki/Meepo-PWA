/*=========================================================================================
  File Name: refComercialDB.js
  Description: Classe de banco de Referencias comerciais do cliente
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import _ from 'lodash';
import BasicDB from './basicDB'

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("ref_comer").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class refComercialDB {

    salvarSinc(referenciasComerciais) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(referenciasComerciais.length > 0) {
                    const done = _.after(referenciasComerciais.length, () => resolve());
                    referenciasComerciais.forEach(refComer => {
                        refComer._id = _.toString(refComer.id);
                        localDB.put(refComer).then(() => done()).catch(() => done());
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
                resolve(resultDocs.rows.map((refComer) => {
                    delete refComer.doc['_rev'];
                    return _.clone(refComer.doc);
                }))
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    

}
export default new refComercialDB();