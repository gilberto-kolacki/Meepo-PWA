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
        this._createIndex('alterado');
    }

    salvar(orcamento) {
        return new Promise((resolve) => {
            
            const salva = (orcamento) => {
                orcamento.alterado = true;
                this._salvar(orcamento).then(() => {
                    resolve();
                });
            };

            if (orcamento.id) {
                this.get(orcamento.id).then((orcamentoDB) => {
                    orcamento._id = orcamentoDB._id;
                    orcamento._rev = orcamentoDB._rev;
                    salva(orcamento);
                });
            } else {
                this._getNextId().then((Id) => {
                    orcamento.id = Id;
                    salva(orcamento);
                });
            }
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
                this._remoteDB.get(orcamento.id).then((orcamentoRemote) => {
                    this._remoteDB.remove(orcamentoRemote).then(() => {
                        resolve();
                    });
                });
            }).catch((err) => {
                this._criarLogDB({url:'db/orcamentoDB',method:'deletar',message: err,error:'Failed Request'});
                resolve();
            });
        });
    }

    buscaSinc() {
        return new Promise((resolve) => {
            this._getAll().then((result) => {
                resolve(result);
            });
        });
    }

}

export default new orcamentoDB();
