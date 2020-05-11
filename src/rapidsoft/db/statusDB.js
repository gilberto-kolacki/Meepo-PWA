/*=========================================================================================
  File Name: statusDB.js
  Description: Classe de banco de status
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import BasicDB from './basicDB';

class statusDB extends BasicDB {

    constructor() {
        super("status");
        this._createIndex('id');
    }

    salvarSinc(listStatus) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(listStatus.length > 0) {
                    const done = After(listStatus.length, () => resolve());
                    listStatus.forEach(status => {
                        this._salvar(status).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

}

export default new statusDB();