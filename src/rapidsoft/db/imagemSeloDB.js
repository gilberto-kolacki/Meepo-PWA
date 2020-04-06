/*=========================================================================================
  File Name: imagemDB.js
  Description: Classe de banco responsavel pelas imagens dos selos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import IsArray from 'lodash/isArray';
import BasicDB from './basicDB';
class nameSeloDB extends BasicDB {

    constructor() {
        super("selo");
    }

    salvarSelos(selos) {
        return new Promise((resolve) => {
            if (IsArray(selos) && selos.length > 0) {
                const done = After(selos.length, () => resolve(selos.length));
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