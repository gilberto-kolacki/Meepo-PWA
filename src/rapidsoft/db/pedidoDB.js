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

    getNextIdPedido() {
        return new Promise((resolve) => {
            this._findLastId().then((ultimoIdPedido) => {
                ultimoIdPedido = ultimoIdPedido >= 0 ? ultimoIdPedido : 0;
                resolve(ultimoIdPedido+1);
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

}

export default new pedidoDB();
