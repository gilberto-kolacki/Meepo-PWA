/*=========================================================================================
  File Name: orcamentoDB.js
  Description: Classe de banco de orcamentos de compra
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
// import _ from 'lodash';
import BasicDB from './basicDB';

class orcamentoDB extends BasicDB {

    constructor() {
        super("orcamento", true);
        this._createIndex('id');
    }

    salvar(orcamento) {
        return new Promise((resolve) => {
            this._getNextId().then((Id) => {
                orcamento.id = Id;
                this._salvar(orcamento).then(() => {
                    resolve();
                });
            });
        });
    }

    get(carrinhoId) {
        return new Promise((resolve) => {
            this._getById(carrinhoId, true).then((pedido) => {
                resolve(pedido.value);
            });
        });
    }

    deletar(orcamento) {
        return new Promise((resolve) => {
            this._localDB.remove(orcamento).then(() => {
                resolve();
            }).catch((err) => {
                this._criarLogDB({url:'db/orcamentoDB',method:'deletar',message: err,error:'Failed Request'});
                resolve();
            });
        });
    }

}

export default new orcamentoDB();
