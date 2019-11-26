/*=========================================================================================
  File Name: refComercialDB.js
  Description: Classe de banco de Referencias comerciais do cliente
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class refComercialDB extends BasicDB {

    constructor() {
        super("ref_comer");
    }

    limparBase() {
        return this._limparBase();
    }

    salvarSinc(referenciasComerciais) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(referenciasComerciais.length > 0) {
                    const done = _.after(referenciasComerciais.length, () => resolve());
                    referenciasComerciais.forEach(refComer => {
                        refComer._id = _.toString(refComer.id);
                        this._localDB.put(refComer).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }
    

}
export default new refComercialDB();