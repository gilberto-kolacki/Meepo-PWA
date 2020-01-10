/*=========================================================================================
  File Name: errorDB.js
  Description: Classe de banco para erros do App
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import BasicDB from './basicDB';

class errorDB extends BasicDB {

    constructor() {
        super("erros", true);
    }

    listar() {
        return new Promise((resolve) => {
            this._localErroDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((error) => error.doc ));
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    _sincNuvem() {
        return new Promise((resolve) => {
            this._localErroDB.replicate.to(this._remoteErroDB).then((result) => {
                if (result.ok) {
                    this._localErroDB.replicate.from(this._remoteErroDB).then((result) => {
                        if (result.ok) {
                            resolve();
                        } else {
                            this._sincNuvem().then(() => {
                                resolve();
                            });
                        }
                    });
                } else {
                    this._sincNuvem().then(() => {
                        resolve();
                    });
                }
            });
        });
    }

}
export default new errorDB();