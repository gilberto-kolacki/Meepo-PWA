/*=========================================================================================
  File Name: imagemFotoDB.js
  Description: Classe de banco responsavel pelas Fotos dos produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class imagemFotoDB extends BasicDB {

    constructor() {
        super("foto");
    }   

    salvarFotos(fotos) {
        return new Promise((resolve) => {
            if (_.isArray(fotos) && fotos.length > 0) {
                const done = _.after(fotos.length, () => resolve(fotos.length));
                fotos.forEach(imagem => {
                    this._salvar(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0)
            }
        })
    }

}

export default new imagemFotoDB();