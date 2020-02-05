/*=========================================================================================
  File Name: imagemFotoDB.js
  Description: Classe de banco responsavel pelas Fotos dos produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';

class imagemFotoDB extends BasicDB {

    constructor() {
        super("foto");
    }   

    salvarFotos(fotos) {
        return new Promise((resolve) => {
            if (fotos.length <= 0) resolve(0);
            // const done = _.after(fotos.length, () => resolve(fotos.length));
            
            const done = _.after(1, () => resolve(fotos.length));
            fotos.forEach(imagem => {
                this._salvar(imagem).then(() => done()).catch(() => done());
            });
        });
    }

}

export default new imagemFotoDB();