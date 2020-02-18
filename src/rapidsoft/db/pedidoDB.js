/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
import _ from 'lodash';
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
            const done = _.after(pedidos.length, () => resolve());
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
            this.getPedido(pedido.id).then((object) => {
                console.log(object);
                
                pedido._rev = object._rev;
                pedido.cliente.id = String(pedido.cliente.id);
                
                console.log(pedido);
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
            if (window.navigator.onLine && this._remoteDB) {
                this._sincToNuvem().then(() => {
                    this._sincFromNuvem().then(() => {
                        resolve();        
                    });
                });
            } else {
                resolve();
            }
        });
    }    

}

export default new pedidoDB();
