/*=========================================================================================
  File Name: formaPagtoDB.js
  Description: Classe de banco de categorias
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class formaPagtoDB extends BasicDB {

    constructor() {
        super("forma_pagto");
    }

    limparBase() {
        return this._limparBase(new formaPagtoDB())
    }

    salvarSinc(formasPagto) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(formasPagto.length > 0) {
                    const done = _.after(formasPagto.length, () => resolve());
                    formasPagto.forEach(formPagto => {
                        formPagto._id = _.toString(formPagto.id);
                        this._localDB.put(formPagto).then(() => done()).catch(() => done());
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
                resolve(resultDocs.rows.map((grupo) => {
                    if (grupo.doc['id']) {
                        delete grupo.doc['_rev'];
                        return _.clone(grupo.doc);
                    }
                }))
            }).catch((err) => {
                resolve(err);
            });
        });
    }

}

export default new formaPagtoDB();