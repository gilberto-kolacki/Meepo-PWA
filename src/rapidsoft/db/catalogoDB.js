/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco de Segmentos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import _ from 'lodash';
import BasicDB from './basicDB'

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("catalogo").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class catalogoDB {

    salvarSinc(catalogos) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(catalogos.length > 0) {
                    const done = _.after(catalogos.length, () => resolve());
                    catalogos.forEach(catalogo => {
                        console.log(catalogo)
                        catalogo._id = _.toString(catalogo.id);
                        localDB.put(catalogo).then(() => done()).catch(() => done());
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
                resolve(resultDocs.rows.map((catalogo) => {
                    delete catalogo.doc['_rev'];
                    return _.clone(catalogo.doc);
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
export default new catalogoDB();