/*=========================================================================================
  File Name: carrinhoDB.js
  Description: Classe de banco do carrinho
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
// import _ from 'lodash';
import BasicDB from './basicDB';

// const CARRINHO = "carrinho";
const GRUPO_CLIENTE_CARRINHO = "grupoCliente";
const CLIENTE_CARRINHO = "cliente";

class carrinhoDB extends BasicDB {

    constructor() {
        super("carrinho", true);
    }

    getCarrinho() {
        return new Promise((resolve) => {
            this._localDB.get("1").then((result) => {
                resolve(result);
            }).catch(() => {
                resolve(null);
            });
        });
    }

    setCarrinho(carrinho) {
        return new Promise((resolve) => {
            carrinho._id = "1";
            this._localDB.put(carrinho).then((result) => {
                resolve(result);
            }).catch((erro) => {
                this._criarLogDB({url:'db/carrinhoDB',method:'setCarrinho',message: erro,error:'Failed Request'});
                resolve(erro);
            });
        });
    }

    existeCarrinho() {
        return new Promise((resolve) => {
            this.getCarrinho().then((carrinho) => {
                if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    deleteCarrinho() {
        return new Promise((resolve) => {
            this.getCarrinho().then((carrinho) => {
                this._localDB.remove(carrinho).then((result) => {
                    resolve(result);
                }).catch(() => {
                    resolve();
                });
            });
        });
    }

    deleteCarrinhoItens(itens) {
        return new Promise((resolve) => {
            const carrinho = this.getCarrinho();
            carrinho.itens = carrinho.itens.filter((itemCarrinho) => !(itens.some((itemDelete) => itemDelete === itemCarrinho.sku || itemDelete === itemCarrinho.idProduto)));
            if (carrinho.itens.length > 0 && itens.length > 0) {
                this.setCarrinho(carrinho).then(resolve());
            } else {
                this.deleteCarrinho();
                resolve();
            }
        });
    }

    getCarrinhoItens() {
        return new Promise((resolve) => {
            this.getCarrinho().then((carrinho) => {
                if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
                    resolve(carrinho.itens);
                } else {
                    resolve([]);
                }
            });
        });
    }

    getValorTotalCarrinho(itens) {
        return Number(itens.reduce((total, item) => {
            total = total + (item.quantidade * item.precoCusto);
            return total;
        }, 0).toFixed(2));
    }

    setCarrinhoItens(itens) {
        if (itens.length > 0) {
            this.getCarrinho().then((carrinho) => {
                carrinho.valorTotal = this.getValorTotalCarrinho(itens);
                carrinho.itens = itens;
                this.setCarrinho(carrinho);
            });
        } else {
            this.deleteCarrinho();
        }
    }

    getGrupoCarrinho() {
        this.getCarrinho().then((carrinho) => {
            return carrinho[GRUPO_CLIENTE_CARRINHO];
        });
    }

    setGrupoCarrinho(grupoCliente) {
        this.getCarrinho().then((carrinho) => {
            carrinho[GRUPO_CLIENTE_CARRINHO] = grupoCliente;
            this.setCarrinho(carrinho);
        });
    }

    deleteGrupoCarrinho() {
        this.getCarrinho().then((carrinho) => {
            carrinho[GRUPO_CLIENTE_CARRINHO] = null;
            this.setCarrinho(carrinho);
        });
    }

    existeClienteCarrinho() {
        return new Promise((resolve) => {
            this.getCarrinho().then((carrinho) => {
                if (carrinho && carrinho.cliente && carrinho.cliente.cpfCnpj) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    setClienteCarrinho(cliente) {
        delete cliente['_id'];
        delete cliente['_rev'];
        this.getCarrinho().then((carrinho) => {
            carrinho[CLIENTE_CARRINHO] = cliente;
            this.setCarrinho(carrinho);
        });
    }

    getClienteCarrinho() {
        this.getCarrinho().then((carrinho) => {
            return carrinho[CLIENTE_CARRINHO];
        });
    }

    deleteClienteCarrinho() {
        this.getCarrinho().then((carrinho) => {
            carrinho[CLIENTE_CARRINHO] = null;
            this.setCarrinho(carrinho);
        });
    }


}

export default new carrinhoDB();    