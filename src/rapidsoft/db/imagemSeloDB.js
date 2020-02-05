/*=========================================================================================
  File Name: imagemDB.js
  Description: Classe de banco responsavel pelas imagens dos selos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'
class nameSeloDB extends BasicDB {

    constructor() {
        super("selo");
    }

    salvarSelos(selos) {
        return new Promise((resolve) => {
            if (_.isArray(selos) && selos.length > 0) {
                const done = _.after(selos.length, () => resolve(selos.length));
                selos.forEach(imagem => {
                    this._salvar(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0);
            }
        })
    }

}

export default new nameSeloDB();