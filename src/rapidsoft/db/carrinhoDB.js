/*=========================================================================================
  File Name: carrinhoDB.js
  Description: Classe de banco do carrinho
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
import BasicRemoteDB from './basicRemoteDB';
import Storage from '../utils/storage';

class carrinhoDB extends BasicRemoteDB {

    constructor() {
        super("carrinho");
    }

    getCarrinho(rev = false) {
        return new Promise((resolve) => {
            this._localDB.get("1").then((result) => {
                if (!rev) delete result._rev;
                Storage.setCarrinho(result);
                resolve(result);
            }).catch(() => {
                const cliente = Storage.getClienteCarrinho();
                let newCarrinho = {};
                newCarrinho._id = "1";
                newCarrinho.valorTotal = 0;
                newCarrinho.itens = [];   
                if (cliente) {
                    newCarrinho.cliente = cliente;
                } else {
                    const grupoCliente = Storage.getGrupoCarrinho();
                    newCarrinho.cliente = { cpfCnpj: null, nome: null, grupoCliente };
                }
                resolve(newCarrinho);
            });
        });
    }

    setCarrinho(carrinho) {
        return new Promise((resolve) => {
            carrinho._id = "1";
            carrinho.alterado = true;
            carrinho.valorTotal = this.getValorTotalCarrinho(carrinho.itens);
            this._localDB.put(carrinho).then((result) => {
                Storage.setCarrinho(carrinho);
                resolve(result);
            }).catch((erro) => {
                if (erro.status == 409) {
                    this.getCarrinho(true).then((carrinhoBanco) => {
                        this._localDB.remove(carrinhoBanco).then(() => {
                            this.setCarrinho(carrinho).then((result) => {
                                resolve(result);
                            });
                        });
                    });
                } else {
                    this._criarLogDB({url:'db/carrinhoDB', method:'setCarrinho', message: erro, error:'Failed Request'});
                    resolve(erro);
                }
            });
        });
    }

    deleteCarrinho(itens = []) {
        return new Promise((resolve) => {
            if (itens.length > 0) {
                this.getCarrinho().then((carrinho) => {
                    carrinho.itens = carrinho.itens.filter((itemCarrinho) => !(itens.some((itemDelete) => itemDelete === itemCarrinho.sku || itemDelete === itemCarrinho.idProduto)));
                    if (carrinho.itens.length > 0) {
                        Storage.setCarrinho(carrinho);
                        this.setCarrinho(carrinho).then(resolve());
                    } else {
                        this.deleteCarrinho().then(() => {
                            resolve();
                        });
                    }
                });
            } else {
                this.getCarrinho(true).then((carrinho) => {
                    this._localDB.remove(carrinho).then((result) => {
                        Storage.deleteCarrinho();
                        resolve(result);
                    }).catch((error) => {
                        console.log('erro deletar carrinho', carrinho, error);
                        resolve();
                    });
                });
            }
        });
    }

    getValorTotalCarrinho(itens) {
        return Number(itens.reduce((total, item) => {
            total = total + (item.quantidade * item.precoCusto);
            return total;
        }, 0).toFixed(2));
    }

    getCouchDB() {
        return new Promise((resolve) => {
            this._remoteDB.get("1").then((carrinhoCouch) => {
                delete carrinhoCouch._rev;
                this.setCarrinho(carrinhoCouch).then(() => {
                    resolve();
                });
            }).catch(() => {
                resolve();
            });
        });
    }

}

export default new carrinhoDB();    