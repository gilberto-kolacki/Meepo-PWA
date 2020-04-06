/*=========================================================================================
  File Name: prontaEntregaDB.js
  Description: Classe de banco de Produtos pronta entrega
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import BasicDB from './basicDB';

class prontaEntregaDB extends BasicDB {

    constructor() {
        super("pronta_entrega");
    }

    salvarSinc(prontasEntregas) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(prontasEntregas.length > 0) {
                    const done = After(prontasEntregas.length, () => resolve());
                    prontasEntregas.forEach(prontaEntrega => {
                        this._salvar(prontaEntrega).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

}

export default new prontaEntregaDB();