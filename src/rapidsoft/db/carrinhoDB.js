/*=========================================================================================
  File Name: carrinhoDB.js
  Description: Classe de banco de carrinhos de compra
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
// import _ from 'lodash';
import BasicDB from './basicDB';

class carrinhoDB extends BasicDB {

    constructor() {
        super("carrinho", true);
        this._createIndex('id');
    }

    getNextIdCarrinho() {
        return new Promise((resolve) => {
            this._findLastId().then((ultimoIdCarrinho) => {
                ultimoIdCarrinho = ultimoIdCarrinho >= 0 ? ultimoIdCarrinho : 0;
                resolve(ultimoIdCarrinho+1);
            });
        });
    }
    
    salvarCarrinho(carrinho) {
        return new Promise((resolve) => {
            this.getNextIdCarrinho().then((carrinhoId) => {
                carrinho.id = carrinhoId;
                
                console.log(carrinho);
                
                this._salvar(carrinho).then(() => {
                    resolve();
                }).catch(() => {
                    this.salvarPedido(carrinho).then(() => {
                        resolve();
                    });
                });
            });
        });
    }

    getCarrinho(carrinhoId) {
        return new Promise((resolve) => {
            this._getById(carrinhoId, true).then((pedido) => {
                resolve(pedido.value);
            });
        });
    }

}

export default new carrinhoDB();
