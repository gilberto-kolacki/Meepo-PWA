/*=========================================================================================
  File Name: periodoDB.js
  Description: Classe de banco de Periodos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

class periodoDB extends BasicDB {

    constructor() {
        super("periodo");
    }

    limparBase() {
        return this._limparBase(new periodoDB())
    }

    salvarSinc(periodos) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(periodos.length > 0) {
                    const done = _.after(periodos.length, () => resolve());
                    periodos.forEach(periodo => {
                        periodo._id = _.toString(periodo.id);
                        this._localDB.put(periodo).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

}

export default new periodoDB();