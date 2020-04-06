/*=========================================================================================
  File Name: imagemCorDB.js
  Description: Classe de banco responsavel pelas imagens das cores
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import BasicDB from './basicDB';

class imagemCorDB extends BasicDB {

    constructor() {
        super("cor");
    }

    salvarCores(cores) {
        return new Promise((resolve) => {
            if (cores.length <= 0) resolve(0);
            const done = After(cores.length, () => resolve(cores.length));
            cores.forEach(imagem => {
                this._salvar(imagem).then(() => done()).catch(() => done());
            });
        });
    }

}

export default new imagemCorDB();