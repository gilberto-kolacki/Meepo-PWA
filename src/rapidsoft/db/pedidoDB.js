/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
import BasicDB from './basicDB';

class pedidoDB extends BasicDB {

    constructor() {
        super("pedido", true);
        this._createIndex('id');
        this._createIndex('status');
    }

    findLastId() {
        return new Promise((resolve) => {
            this._count().then((count) => {
                this._lastId = new Date().getTime() +''+ count;
                resolve(this._lastId);
            });
        });
    }

    deletarItemPedido(pedido) {
        return new Promise((resolve) => {
            this._getById(pedido._id,true).then((pedidoById) => {
                if (pedidoById.existe) {
                    pedido._rev = pedidoById.value._rev;
                    this.salvar(pedido).then(() => {
                        resolve();
                    });
                }
            });
        });
    }
    
    atualizarPedido(pedido) {
        return new Promise((resolve) => {
            this._getById(pedido._id, true).then((pedidoById) => {
                if (pedidoById.existe) {
                    pedidoById.result = pedido;
                    this.salvar(pedidoById.result).then(() => {
                        resolve();
                    });
                }
            });
        });
    }

    salvar(value) {
        return new Promise((resolve, reject) => {
            try {
                value._id = (value.id ? value.id : value._id).toString();
                value._id = value._id.replace(/[^a-z0-9]/gi, "");
                this._localDB.put(value).then((result) => {
                    resolve(Number(result.id));
                });
            } catch (err) {
                reject(err);
            }
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

    salvarPedidoNovo(pedido) {
        return new Promise((resolve) => {
            this.findLastId().then((idPedido) => {
                pedido.id = idPedido;
                console.log(idPedido);
                this._salvar(pedido).then(() => {
                    resolve();
                }).catch((error) => {
                    console.log(error);
                    resolve(error);
                });
            });
        });
    }

    getPedido(pedidoId) {
        return new Promise((resolve, reject) => {
            this._getById(pedidoId, true).then((pedido) => {
                if (pedido.existe) resolve(pedido.value);
                else reject();
            });
        });
    }

    buscaSinc() {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {
                    status: {$eq: 20}
                },
            }).then((result) => {
                resolve(result.docs.filter((doc) => Object.keys(doc).length > 0));
            });
        });
    }

    

    salvarSinc(pedido) {
        return new Promise((resolve) => {
            this.getPedido(pedido.id, true).then((object) => {
                pedido._rev = object._rev;
                pedido.cliente.id = String(pedido.cliente.id);
                this._salvar(pedido).then(() => {
                    resolve();
                });
            }).catch(() => {
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
