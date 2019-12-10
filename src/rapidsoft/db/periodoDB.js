/*=========================================================================================
  File Name: periodoDB.js
  Description: Classe de banco de Periodos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import BasicDB from './basicDB'
import _ from 'lodash';

class periodoDB extends BasicDB {

    constructor() {
        super("periodo");
    }

    salvarSinc(periodos) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
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