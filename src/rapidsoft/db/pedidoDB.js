/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
import After from 'lodash/after';
import BasicDB from './basicDB';

class pedidoDB extends BasicDB {

    constructor() {
        super("pedido", true);
        this._createIndex('id');
        this._createIndex('status');
        this._createIndex('alterado');
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
                    pedidoById.value.itens = pedido.itens;
                    pedidoById.value.status = pedido.status;
                    pedidoById.value.cliente = pedido.cliente;
                    pedidoById.value.grupoCliente = pedido.grupoCliente;
                    pedidoById.value.endEntrega = pedido.endEntrega;
                    pedidoById.value.desconto1 = pedido.desconto1;
                    pedidoById.value.desconto2 = pedido.desconto2;
                    pedidoById.value.desconto3 = pedido.desconto3;
                    pedidoById.value.emailNfe = pedido.emailNfe;
                    pedidoById.value.nome = pedido.nome;
                    pedidoById.value.pedidoParcial = pedido.pedidoParcial;
                    pedidoById.value.antecipacaoPedido = pedido.antecipacaoPedido;
                    pedidoById.value.brinde = pedido.brinde;
                    pedidoById.value.copiaEmail = pedido.copiaEmail;
                    pedidoById.value.formaPagamento = pedido.formaPagamento;
                    pedidoById.value.condicaoPagamento = pedido.condicaoPagamento;
                    pedidoById.value.quantidade = pedido.quantidade;
                    pedidoById.value.dataEmbarque = pedido.dataEmbarque;
                    pedidoById.value.totalBruto = pedido.totalBruto;
                    pedidoById.value.totalLiquido = pedido.totalLiquido;
                    pedidoById.value.observacao = pedido.observacao;
                    pedidoById.value.embarque = pedido.embarque;
                    pedidoById.value.segmento = pedido.segmento;
                    this.salvar(pedidoById.value).then(() => {
                        resolve();
                    });
                }
            });
        });
    }

    atualizarStatusPedido(pedido) {
        return new Promise((resolve) => {
            this._getById(pedido._id, true).then((pedidoById) => {
                if (pedidoById.existe) {
                    pedidoById.value.status = pedido.status;
                    this.salvar(pedidoById.value).then(() => {
                        resolve();
                    });
                }
            });
        });
    }

    salvar(pedido) {
        return new Promise((resolve, reject) => {
            try {
                pedido.alterado = true;
                this._salvar(pedido).then((result) => {
                    resolve(result);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    buscaPedidosEmDigitacao() {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: { status: {$eq: 10}},
            }).then((result) => {
                resolve(result.docs.reduce((pedidos, doc) => {
                    if (doc) pedidos.push(doc);
                    return pedidos;
                }, []));
            });
        });
    }

    salvarPedidoNovo(pedido) {
        return new Promise((resolve) => {
            this.findLastId().then((idPedido) => {
                pedido.id = idPedido;
                pedido.alterado = true;
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
    
    atualizaStatusPedidos(pedidos) {
        return new Promise((resolve) => {
            const done = After(pedidos.length, () => resolve());
            pedidos.forEach(pedido => {
                this._getById(pedido.id, true).then((pedido) => {
                    pedido.status = 45;
                    this._salvar(pedido).then(() => {
                        done();
                    });
                });
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
                const pedidos = result.docs.reduce((docs, doc) => {
                    if (Object.keys(doc).length > 0) {
                        const pedido = doc;
                        pedido.cliente = pedido.cliente.idClienteErp ? {idClienteErp: pedido.cliente.idClienteErp} : pedido.cliente;
                        docs.push(pedido);
                    }
                    return docs;
                }, []);
                resolve(pedidos);
            });
        });
    }

    

    salvarSinc(pedido) {
        return new Promise((resolve) => {
            if (pedido.id) {
                if (pedido.id == "15861912133870") console.log(pedido);
                
                this.getPedido(pedido.id).then((object) => {

                    console.log("encontrou", object);
                    
                    pedido._rev = object._rev;
                    pedido.cliente.id = String(pedido.cliente.id);
                    this._salvar(pedido).then(() => {
                        if (object.status < 50) {
                            this._remoteDB.get(pedido.id).then((objectRemote) => {
                                this._remoteDB.remove(objectRemote).then(() => {
                                    resolve();
                                });
                            });
                        } else {
                            resolve();
                        }
                    });
                }).catch(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }    

    deletar(idPedido) {
        return new Promise((resolve, reject) => {
            this._deletar(idPedido).then((result) => {
                // this._remoteDB.get(idPedido).then((objectRemote) => {
                    // this._remoteDB.remove(objectRemote).then(() => {
                        resolve(result);
                    // });
                // });
            }).catch((err) => {
                this._criarLogDB({url:'db/pedidoDB',method:'deletar',message: err,error:'Failed Request'});
                reject(err);
            });
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

export default new pedidoDB();
