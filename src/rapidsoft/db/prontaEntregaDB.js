/*=========================================================================================
  File Name: prontaEntregaDB.js
  Description: Classe de banco de Produtos pronta entrega
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class prontaEntregaDB extends BasicDB {

    constructor() {
        super("pronta_entrega");
    }

    salvarSinc(prontasEntregas) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(prontasEntregas.length > 0) {
                    const done = _.after(prontasEntregas.length, () => resolve());
                    prontasEntregas.forEach(prontaEntrega => {
                        prontaEntrega._id = _.toString(prontaEntrega.id);
                        this._localDB.put(prontaEntrega).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

}

export default new prontaEntregaDB();