/*=========================================================================================
  File Name: imagemFotoDB.js
  Description: Classe de banco responsavel pelas Fotos dos produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import IsArray from 'lodash/isArray';
import BasicDB from './basicDB';

class imagemFotoDB extends BasicDB {

    constructor() {
        super("foto");
    }   

    salvarFotos(fotos) {
        return new Promise((resolve) => {
            if (IsArray(fotos) && fotos.length > 0) {
                const done = After(fotos.length, () => resolve(fotos.length));
                fotos.forEach(imagem => {
                    this._salvar(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0);
            }
        });
    }

}

export default new imagemFotoDB();