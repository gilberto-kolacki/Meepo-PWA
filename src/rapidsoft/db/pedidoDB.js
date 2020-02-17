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
        return new Promise((resolve) => {
            this._getById(pedidoId, true).then((pedido) => {
                resolve(pedido.value);
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
            
            // this._salvar(pedido).then(() => {
            //     resolve();
            // }).catch((erro) => {
            //     this._criarLogDB({url:'db/clienteDB',method:'salvarSinc',message: erro,error:'Failed Request'});
            //     resolve();
            // });
            

            this._getById(pedido._id, true).then((object) => {
                resolve(object);
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
