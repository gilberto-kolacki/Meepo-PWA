/*=========================================================================================
  File Name: imagemDB.js
  Description: Classe de banco responsavel pelas imagens dos Simbolos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import IsArray from 'lodash/isArray';
import BasicDB from './basicDB';

class imagemSimboloDB extends BasicDB {

    constructor() {
        super("simbolo");
    }

    salvarSimbolos(simbolos) {
        return new Promise((resolve) => {
            if (IsArray(simbolos) && simbolos.length > 0) {
                const done = After(simbolos.length, () => resolve(simbolos.length));
                simbolos.forEach(imagem => {
                    this._salvar(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0);
            }
        });
    }       

}

export default new imagemSimboloDB();