/*=========================================================================================
  File Name: imagemCorDB.js
  Description: Classe de banco responsavel pelas imagens das cores
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class imagemCorDB extends BasicDB {

    constructor() {
        super("cor");
    }

    salvarCores(cores) {
        return new Promise((resolve) => {
            if (_.isArray(cores) && cores.length > 0) {
                const done = _.after(cores.length, () => resolve(cores.length));
                cores.forEach(imagem => {
                    this._salvar(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0)
            }
        })
    }

}

export default new imagemCorDB();