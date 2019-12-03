/*=========================================================================================
  File Name: categoriaDB.js
  Description: Classe de banco de categorias
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'
import ProdutoDB from './produtoDB'

class categoriaDB extends BasicDB {

    constructor() {
        super("categoria");
    }

    limparBase() {
        return this._limparBase();
    }

    salvarSinc(categorias) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(categorias.length > 0) {
                    const done = _.after(categorias.length, () => resolve());
                    categorias.forEach(categoria => {
                        categoria._id = _.toString(categoria.id);
                        this._localDB.put(categoria).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    getByIds(idsCategorias) {
        return new Promise((resolve) => {
            this._getAll().then((categorias) => {
                resolve(categorias.filter((categoria) => {
                    return _.indexOf(idsCategorias, categoria.id) >= 0;
                }))
            })
        });
    }

    getAllBySegmento(idSegmento) {
        return new Promise((resolve) => {
            ProdutoDB.getIdsCategoria().then((idsCategorias) => {
                this.getByIds(idsCategorias).then((categorias) => {
                    resolve(categorias.filter((categoria) => { return categoria.idSegmento === idSegmento }));
                })
            })
        });
    }

}

export default new categoriaDB();