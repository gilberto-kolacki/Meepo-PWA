/*=========================================================================================
  File Name: linhaDB.js
  Description: Classe de banco de linhas
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import BasicDB from './basicDB';

class linhaDB extends BasicDB {

    constructor() {
        super("linha");
        this._createIndex('id');
    }

    salvarSinc(linhas) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(linhas.length > 0) {
                    const done = After(linhas.length, () => resolve());
                    linhas.forEach(linha => {
                        this._salvar(linha).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    getArrayAgrupadoresLinhas(linhas) {
        return new Promise((resolve) => {
            if(linhas.length > 0) {
                const done = After(linhas.length, () => resolve(linhas));
                linhas.forEach(linha => {
                    this._getById(linha.id).then((cat) => {
                        if (cat.existe) linha.nome = cat.value.nome;
                        else linha.nome = `'${linha.id}' NÂO CADASTRADA`;
                        done();
                    });
                });
            } else {
                resolve();
            }
        });
    }

}

export default new linhaDB();