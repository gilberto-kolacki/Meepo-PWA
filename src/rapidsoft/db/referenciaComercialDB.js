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

    salvarSinc(referenciasComerciais) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(referenciasComerciais.length > 0) {
                    const done = _.after(referenciasComerciais.length, () => resolve());
                    referenciasComerciais.forEach(refComer => {
                        this._salvar(refComer).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }
    getAll() {
        return new Promise((resolve) => {
            this._getAll().then((referenciasComerciais) => {
                resolve(referenciasComerciais);
            });
        });
    }
    

}
export default new refComercialDB();