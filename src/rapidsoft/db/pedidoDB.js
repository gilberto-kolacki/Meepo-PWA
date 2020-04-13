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
        return new Promise((resolve, reject) => {
            try {
                this._count().then((count) => {
                    this._lastId = new Date().getTime() +''+ count;
                    resolve(this._lastId);
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'findLastId',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'findLastId',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    deletarItemPedido(pedido) {
        return new Promise((resolve, reject) => {
            try {
                this._getById(pedido._id,true).then((pedidoById) => {
                    if (pedidoById.existe) {
                        pedido._rev = pedidoById.value._rev;
                        this.salvar(pedido).then(() => {
                            resolve();
                        }).catch((error) => {
                            this._criarLogDB({url:'db/pedidoDB',method:'deletarItemPedido',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    }
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'deletarItemPedido',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'deletarItemPedido',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }
    
    atualizarPedido(pedido) {
        return new Promise((resolve, reject) => {
            try {
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
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'atualizarPedido',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'atualizarPedido',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    atualizarStatusPedido(pedido) {
        return new Promise((resolve, reject) => {
            try {
                this._getById(pedido._id, true).then((pedidoById) => {
                    if (pedidoById.existe) {
                        pedidoById.value.status = pedido.status;
                        this.salvar(pedidoById.value).then(() => {
                            resolve();
                        }).catch((error) => {
                            this._criarLogDB({url:'db/pedidoDB',method:'atualizarStatusPedido',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    }
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'atualizarStatusPedido',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'atualizarStatusPedido',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    salvar(pedido) {
        return new Promise((resolve, reject) => {
            try {
                pedido.alterado = true;
                this._salvar(pedido).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'salvar',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'salvar',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    buscaPedidosEmDigitacao() {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.find({
                    selector: { status: {$eq: 10}},
                }).then((result) => {
                    resolve(result.docs.reduce((pedidos, doc) => {
                        if (doc) pedidos.push(doc);
                        return pedidos;
                    }, []));
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'buscaPedidosEmDigitacao',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'buscaPedidosEmDigitacao',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    salvarPedidoNovo(pedido) {
        return new Promise((resolve, reject) => {
            try {
                this.findLastId().then((idPedido) => {
                    pedido.id = idPedido;
                    pedido.alterado = true;
                    this._salvar(pedido).then(() => {
                        resolve();
                    }).catch((error) => {
                        this._criarLogDB({url:'db/pedidoDB',method:'salvarPedidoNovo',message: error,error:'Failed Request'});
                        reject(error);
                    });
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'salvarPedidoNovo',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'salvarPedidoNovo',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    getPedido(pedidoId) {
        return new Promise((resolve, reject) => {
                try {
                this._getById(pedidoId, true).then((pedido) => {
                    if (pedido.existe) resolve(pedido.value);
                    else reject(pedido.existe);
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'getPedido',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'getPedido',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }
    
    atualizaStatusPedidos(pedidos) {
        return new Promise((resolve, reject) => {
            try{
                const done = After(pedidos.length, () => resolve());
                pedidos.forEach(pedido => {
                    this._getById(pedido.id, true).then((pedido) => {
                        pedido.status = 45;
                        this._salvar(pedido).then(() => {
                            done();
                        }).catch((error) => {
                            this._criarLogDB({url:'db/pedidoDB',method:'atualizaStatusPedidos',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    }).catch((error) => {
                        this._criarLogDB({url:'db/pedidoDB',method:'atualizaStatusPedidos',message: error,error:'Failed Request'});
                        reject(error);
                    });
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'atualizaStatusPedidos',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'atualizaStatusPedidos',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    buscaSinc() {
        return new Promise((resolve, reject) => {
            try{
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
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'buscaSinc',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'buscaSinc',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    deletar(idPedido) {
        return new Promise((resolve, reject) => {
            try{
                this._deletar(idPedido).then((result) => {
                    resolve(result);
                    // TODO (Luiz): Removido para testar a aplicação sem sincronizar base local com a nuvem
                    /* this._remoteDB.get(idPedido).then((objectRemote) => {
                        this._remoteDB.remove(objectRemote).then(() => {
                            resolve(result);
                        });
                    }); */
                }).catch((error) => {
                    this._criarLogDB({url:'db/pedidoDB',method:'deletar',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'deletar',message: error,error:'Failed Request'});
                reject(error);
            }
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
