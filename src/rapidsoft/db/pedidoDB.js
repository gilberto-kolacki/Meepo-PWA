/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
// import _ from 'lodash';
import BasicDB from './basicDB';
// import Storage from '../utils/storage';

class pedidoDB extends BasicDB {

    constructor() {
        super("pedido", true);
        this._createIndex('id');
        this._createIndex('status');
    }

    findLastId() {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {
                    id: {$gte: null}
                },
                sort: [{'id':'desc'}],
                limit: 1
            }).then((result) => {
                if (result.docs.length == 1) {
                    this._lastId = result.docs[0].id;
                } else {
                    this._lastId = 0;
                }
                resolve(this._lastId);
            });
        });
    }

    deletarItemPedido(pedido) {
        return new Promise((resolve) => {
            this._getById(pedido.id,true).then((pedidoById) => {
                if (pedidoById.existe) {
                    pedido._rev = pedidoById.value._rev;
                    this._salvar(pedido).then(() => {
                        resolve();
                    });
                }
            });
        });
    }

    getNextIdPedido() {
        return new Promise((resolve) => {
            this.findLastId().then((ultimoIdPedido) => {
                ultimoIdPedido = ultimoIdPedido >= 0 ? ultimoIdPedido : 0;
                resolve(ultimoIdPedido+1);
            });
        });
    }
    
    atualizarPedido(pedido) {
        return new Promise((resolve) => {
            this._getById(pedido.id, true).then((pedidoById) => {
                if (pedidoById.existe) {
                    pedidoById.result = pedido;
                    this._salvar(pedidoById.result).then(() => {
                        resolve();
                    });
                }
            });
            
        });
    }

    existePedidoEmDigitacao() {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: { status: {$eq: 10}},
            }).then((result) => {
                if (result.docs.length > 0) {
                    resolve(result.docs);
                } else {
                    resolve(false);
                }
            });
        });
    }

    salvarPedido(pedido) {
        return new Promise((resolve) => {
            this.getNextIdPedido().then((idPedido) => {
                pedido.id = idPedido;
                this._salvar(pedido).then(() => {
                    resolve();
                }).catch(() => {
                    this.salvarPedido(pedido).then(() => {
                        resolve();
                    });
                });
            });
        });
    }

    getPedido(pedidoId) {
        return new Promise((resolve) => {
            this._getById(pedidoId, true).then((pedido) => {
                resolve(pedido.value);
            });
        });
    }

    buscaPedidosSinc() {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {
                    status: {$eq: 20}
                },
            }).then((result) => {
                resolve(result.docs);
            });
        });
    }

    salvarSinc(pedido) {
        return new Promise((resolve) => {
            
            // this._salvar(pedido).then(() => {
            //     resolve();
            // }).catch((erro) => {
            //     this._criarLogDB({url:'db/clienteDB',method:'salvarSinc',message: erro,error:'Failed Request'});
            //     resolve();
            // });

            this._getById(pedido.id, true).then((object) => {

                console.log(object);
                
                


                resolve();
            });
        });
    }

    _sincNuvem() {
        return new Promise((resolve) => {
            if (window.navigator.onLine) {
                this.sincToNuvem().then(() => {
                    this.sincFromNuvem().then(() => {
                        resolve();        
                    });
                });
            } else {
                resolve();
            }
        });
    }

    sincToNuvem() {
        return new Promise((resolve) => {
            resolve();
        });
    }

    sincFromNuvem() {
        return new Promise((resolve) => {
            resolve();
        });
    }

}

export default new pedidoDB();
