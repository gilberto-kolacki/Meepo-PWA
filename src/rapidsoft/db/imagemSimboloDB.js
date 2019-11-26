/*=========================================================================================
  File Name: imagemDB.js
  Description: Classe de banco responsavel pelas imagens dos Simbolos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class imagemSimboloDB extends BasicDB {

    constructor() {
        super("simbolo");
    }

    salvarSimbolos(simbolos) {
        return new Promise((resolve) => {
            if (_.isArray(simbolos) && simbolos.length > 0) {
                const done = _.after(simbolos.length, () => resolve(simbolos.length));
                simbolos.forEach(imagem => {
                    this.salvar(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0)
            }
        })
    }       

}

export default new imagemSimboloDB();