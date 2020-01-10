/*=========================================================================================
  File Name: errorDB.js
  Description: Classe de banco para erros do App
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';

class errorDB extends BasicDB {

    constructor() {
        super("erros", true);
    }

    listar() {
        return new Promise((resolve) => {
            this._localErroDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((error) => {
                    return _.clone(error.doc);
                }));
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

}
export default new errorDB();