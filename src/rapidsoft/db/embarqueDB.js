/*=========================================================================================
  File Name: embarqueDB.js
  Description: Classe de banco de embarques
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import defer from 'promise-defer'
import BasicDB from './basicDB'
import Storage from '../utils/storage'

class embarqueDB extends BasicDB {

    constructor() {
        super("embarque");
    }

    salvarSinc(embarques) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(embarques.length > 0) {
                    const done = _.after(embarques.length, () => resolve());
                    embarques.forEach(embarque => {
                        this._salvar(embarque).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    getEmbarqueProduto(produto) {
        const deferred = defer();
        const grupo = Storage.getGrupoCarrinho();

        this._getAll().then((embarques) => {
            embarques.forEach(embarque => {
                if (this._exists(grupo.embarques, embarque.id)) {
                    if (this._exists(produto.segmento, embarque.idSegmento)) {
                        if (this._exists(embarque.produtos, produto.cor.idProduto)) {
                            deferred.resolve(embarque);
                        }
                    }
                }
            });
        });
        return deferred.promise;
    }

}

export default new embarqueDB();