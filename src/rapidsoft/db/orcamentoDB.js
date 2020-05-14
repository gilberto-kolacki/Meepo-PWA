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

    findLastId() {
        return new Promise((resolve, reject) => {
            try {
                this._count().then((count) => {
                    this._lastId = new Date().getTime() +''+ count;
                    resolve(this._lastId);
                }).catch((error) => {
                    this._criarLogDB({url:'db/orcamentoDB',method:'findLastId',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/orcamentoDB',method:'findLastId',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    salvar(orcamento) {
        return new Promise((resolve, reject) => {
            try {
                if (orcamento.id) {
                    orcamento.alterado = true;
                    this._salvar(orcamento).then((result) => {
                        resolve(result);
                    }).catch((error) => {
                        this._criarLogDB({url:'db/orcamentoDB',method:'salvar',message: error,error:'Failed Request'});
                        reject(error);
                    });
                } else {
                    this.findLastId().then((idOrcamento) => {
                        orcamento.id = idOrcamento;
                        orcamento.embarques = orcamento.embarques.reduce((embarques, embarque) => {
                            embarque.itens = embarque.itens.reduce((itens, item) => {
                                delete item.imagemPrincipal;
                                itens.push(item);
                                return itens;
                            }, []);
                            embarques.push(embarque);
                            return embarques;
                        }, []);
                        this._salvar(orcamento).then((result) => {
                            resolve(result);
                        }).catch((error) => {
                            this._criarLogDB({url:'db/orcamentoDB',method:'salvar',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    });
                }
            } catch (error) {
                this._criarLogDB({url:'db/orcamentoDB',method:'salvar',message: error,error:'Failed Request'});
                reject(error);
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
        return new Promise((resolve, reject) => {
            try {
                this._localDB.remove(orcamento).then(() => {
                    resolve();
                    /* this._remoteDB.get(orcamento.id).then((orcamentoRemote) => {
                        this._remoteDB.remove(orcamentoRemote).then(() => {
                            resolve();
                        });
                    }); */
                }).catch((error) => {
                    this._criarLogDB({url:'db/orcamentoDB',method:'deletar',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/orcamentoDB',method:'deletar',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    buscaSinc() {
        return new Promise((resolve) => {
            resolve([ ]);
            /* this._getAll().then((result) => {
                resolve(result);
            }); */
        });
    }

    getCouchDB() {
        return new Promise((resolve) => {
            this._sincFromNuvem().then(() => {
                resolve();
            });
        });
    }

}

export default new orcamentoDB();
