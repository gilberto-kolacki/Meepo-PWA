/*=========================================================================================
  File Name: errorDB.js
  Description: Classe de banco para erros do App
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import basicRemoteDB from './basicRemoteDB';

class errorDB extends basicRemoteDB {

    constructor() {
        super("error");
    }

    listar() {
        return new Promise((resolve, reject) => {
            if (this._localErroDB) {
                this._localErroDB.allDocs({include_docs: true}).then((resultDocs) => {
                    resolve(resultDocs.rows.map((error) => error.doc ));
                }).catch((err) => {
                    console.log(err);
                    resolve(err);
                });
            } else {
                reject();
            }
        });
    }

}
export default new errorDB();