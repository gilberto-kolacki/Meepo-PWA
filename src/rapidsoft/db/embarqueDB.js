/*=========================================================================================
  File Name: embarqueDB.js
  Description: Classe de banco de embarques
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class embarqueDB extends BasicDB {

    constructor() {
        super("embarque");
    }

    limparBase() {
        return new Promise((resolve) => {
            this._localDB.destroy().then(() => {
                resolve(new embarqueDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    salvarSinc(embarques) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(embarques.length > 0) {
                    const done = _.after(embarques.length, () => resolve());
                    embarques.forEach(embarque => {
                        embarque._id = _.toString(embarque.id);
                        this._localDB.put(embarque).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    getAll() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((embarque) => {
                    if (embarque.doc['nome']) {
                        delete embarque.doc['_rev'];
                        return _.clone(embarque.doc);
                    }
                }))
            }).catch((err) => {
                resolve(err);
            });
        });
    }

}

export default new embarqueDB();