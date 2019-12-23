/*=========================================================================================
  File Name: formaPagtoDB.js
  Description: Classe de banco de categorias
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';

class formaPagtoDB extends BasicDB {

    constructor() {
        super("forma_pagto");
    }

    salvarSinc(formasPagto) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(formasPagto.length > 0) {
                    const done = _.after(formasPagto.length, () => resolve());
                    formasPagto.forEach(formPagto => {
                        this._salvar(formPagto).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

}

export default new formaPagtoDB();