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
                    pedidoById.result.id = pedido.id
                    pedidoById.result.itens = pedido.itens
                    this._salvar(pedidoById.result).then(() => {
                        resolve();
                    })
                }
                
            })
            
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
            this._getById(pedido.id,true).then((pedidoById) => {
                if (pedidoById.existe) {
                    pedidoById.result = pedido
                    this._salvar(pedidoById.result).then(() => {
                        resolve();
                    })
                }
            })
            
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

}

export default new pedidoDB();
