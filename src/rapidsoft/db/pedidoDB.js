/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
import After from 'lodash/after';
import Find from 'lodash/find';
import BasicRemoteDB from './basicRemoteDB';
import CarrinhoDB from './carrinhoDB';
import ClienteDB from './clienteDB';
import ProdutoDB from './produtoDB';
import GrupoClienteDB from './grupoClienteDB';

class pedidoDB extends BasicRemoteDB {

    constructor() {
        super("pedido");
        this._createIndex('status');
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
                    throw error;
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
                    throw error;
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
                    throw error;
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
                    selector: { status: {$eq: 1}},
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
                        throw error;
                    });
                }).catch((error) => {
                    throw error;
                });
            } catch (error) {
                this._criarLogDB({url:'db/pedidoDB',method:'salvarPedidoNovo',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    getPedido(idPedido) {
        return new Promise((resolve, reject) => {
                try {
                this._getById(idPedido, true).then((pedido) => {
                    if (pedido.existe) resolve(pedido.value);
                    else reject(pedido.existe);
                }).catch((error) => {
                    throw {url:'db/pedidoDB',method:'getPedido',message: error,error:'Failed Request'};
                });
            } catch (error) {
                this._criarLogDB(error);
                reject(error);
            }
        });
    }
    
    buscaSinc() {
        return new Promise((resolve, reject) => {
            try{
                this._localDB.find({
                    selector: {
                        status: {$eq: 2}
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

    createPedidoCarrinhoFromPedido(pedido) {
        return new Promise((resolve) => {
            pedido = {
                replica: true,
                pedidoParcial: pedido.pedidoParcial,
                antecipacaoPedido: pedido.antecipacaoPedido, 
                copiaEmail: pedido.copiaEmail,
                brinde: pedido.brinde,
                formaPagamento: pedido.formaPagamento,
                condicaoPagamento: pedido.condicaoPagamento,
                endEntrega: pedido.endEntrega,
                desconto1: pedido.desconto1,
                desconto2: pedido.desconto2,
                desconto3: pedido.desconto3,
                emailNfe: pedido.emailNfe
            };
            resolve(pedido);
        });
    }

    createItensCarrinhoFromPedido(pedido) {
        return new Promise((resolve) => {
            let produtoNaoEncontrado = false;
            const itensCarrinho = [];
            const done = After(pedido.itens.length, () => resolve({itens: itensCarrinho, mensagem: produtoNaoEncontrado}));
            pedido.itens.forEach((item) => {
                ProdutoDB.getById(item.referencia).then((produto) => {
                    if (produto.existe) {
                        produto = produto.value;
                        const produtoCor = produto.cores.find((cor) => cor.codigo === item.cor);
                        const produtoTamanho = produtoCor.tamanhos.find((tamanho) => tamanho.sku === item.sku);
                        if (produtoCor.ativo && produtoTamanho.ativo) {
                            const produtoTamanhoCarrinho = {
                                id: produtoTamanho.id,
                                sku: produtoTamanho.sku,
                                seq: produtoTamanho.seq,
                                codigo: produtoTamanho.codigo,
                                referencia: produto.referencia,
                                cor: produtoCor.idCor,
                                precoCusto: produtoCor.precoCusto,
                                idProduto: produtoCor.idProduto,
                                idSegmento: produto.segmento,
                                quantidade: item.quantidade,
                                embarqueSelecionado: {id: pedido.embarque, seq: pedido.seqEmbarque}
                            };
                            itensCarrinho.push(produtoTamanhoCarrinho);
                        } else {
                            produtoNaoEncontrado = true;
                        }
                    } else {
                        produtoNaoEncontrado = true;
                    }
                    done();
                });
            });
        });
    }

    buscaClienteCarrinhoFromPedido(idCliente, carrinho) {
        return new Promise((resolve) => {
            ClienteDB._getById(idCliente).then((clientePedido) => {
                if (clientePedido.existe) {
                    clientePedido = clientePedido.value;
                    GrupoClienteDB.getById(clientePedido.grupoCliente).then((grupoClienteCarrinho) => {
                        clientePedido.grupoCliente = grupoClienteCarrinho;
                        carrinho.cliente = clientePedido;
                        resolve(carrinho);
                    });
                } else {
                    resolve(carrinho);
                }
            });
        });
    }

    createCarrinhoFromPedido(pedido, carrinho, montarPedido, montarCliente) {
        return new Promise((resolve) => {
            if (montarCliente) {
                this.buscaClienteCarrinhoFromPedido(pedido.cliente.id, carrinho).then((carrinhoCliente) => {
                    carrinho = carrinhoCliente;
                    if (montarPedido) {
                        this.createPedidoCarrinhoFromPedido(pedido).then((pedidoCarrinho) => {
                            carrinho.pedido = pedidoCarrinho;
                            this.createItensCarrinhoFromPedido(pedido).then((result) => {
                                carrinho.itens = [...carrinho.itens.concat(result.itens)];
                                resolve({carrinho: carrinho, alerta: result.mensagem});
                            });
                        });
                    } else {
                        this.createItensCarrinhoFromPedido(pedido).then((result) => {
                            carrinho.itens = [...carrinho.itens.concat(result.itens)];
                            resolve({carrinho: carrinho, alerta: result.mensagem});
                        });
                    }
                });
            } else {
                this.createItensCarrinhoFromPedido(pedido).then((result) => {
                    carrinho.itens = [...carrinho.itens.concat(result.itens)];
                    resolve({carrinho: carrinho, alerta: result.mensagem});
                });
            }                
        });
    }

    clientesIguais(pedidos) {
        const idsCliente = Object.keys(pedidos.reduce((idsCliente, pedido) => {
            idsCliente[pedido.cliente.id] = pedido.cliente;
            return idsCliente;
        }, {}));
        return idsCliente.length === 1 ? true : false;
    }

    sequenciaEmbarques(pedidos) {
        var embarquesMap = new Map();
        return pedidos.reduce((pedidos, pedido) => {
            let sequencia = 1;
            if (embarquesMap.has(pedido.embarque)) {
                sequencia = Number(embarquesMap.get(pedido.embarque)) +1;
                pedido.seqEmbarque = sequencia;
            } else {
                pedido.seqEmbarque = sequencia;
            }
            embarquesMap.set(pedido.embarque, sequencia);
            pedidos.push(pedido);
            return pedidos;
        }, []);
    }

    replicar(idsPedidos) {
        return new Promise((resolve) => {
            CarrinhoDB.getCarrinho().then((carrinho) => {
                this._getFindCondition({id : {$in : idsPedidos}}).then((pedidosDB) => {
                    pedidosDB = this.sequenciaEmbarques(pedidosDB);
                    if (pedidosDB.length > 1) {
                        let alertaItemNaoEncontrado = false;
                        const clientesIguais = this.clientesIguais(pedidosDB);
                        const done = After(pedidosDB.length, () => CarrinhoDB.setCarrinho(carrinho).then(() => resolve(alertaItemNaoEncontrado)));
                        pedidosDB.forEach((pedidoDB) => {
                            this.createCarrinhoFromPedido(pedidoDB, carrinho, false, clientesIguais).then((result) => {
                                carrinho = result.carrinho;
                                alertaItemNaoEncontrado = result.alerta ? result.alerta : alertaItemNaoEncontrado;
                                done();
                            });
                        });
                    } else {
                        this.createCarrinhoFromPedido(pedidosDB[0], carrinho, true, true).then((result) => {
                            CarrinhoDB.setCarrinho(result.carrinho).then(() => {
                                resolve(result.alerta);
                            });
                        });
                    }
                });
            });
        });
    }

    reabrir(idsPedidos) {
        return new Promise((resolve) => {
            CarrinhoDB.getCarrinho().then((carrinho) => {
                this._getFindCondition({id : {$in : idsPedidos}}).then((pedidosDB) => {
                    pedidosDB = this.sequenciaEmbarques(pedidosDB);
                    if (pedidosDB.length > 1) {
                        let alertaItemNaoEncontrado = false;
                        const clientesIguais = this.clientesIguais(pedidosDB);
                        const done = After(pedidosDB.length, () => CarrinhoDB.setCarrinho(carrinho).then(() => resolve(alertaItemNaoEncontrado)));
                        pedidosDB.forEach((pedidoDB) => {
                            this.createCarrinhoFromPedido(pedidoDB, carrinho, false, clientesIguais).then((result) => {
                                carrinho = result.carrinho;
                                alertaItemNaoEncontrado = result.alerta ? result.alerta : alertaItemNaoEncontrado;
                                this.deletar(pedidoDB.id).then(() => {
                                    done();
                                });
                            });
                        });
                    } else {
                        const pedidoDB = pedidosDB[0];
                        this.createCarrinhoFromPedido(pedidoDB, carrinho, true, true).then((result) => {
                            CarrinhoDB.setCarrinho(result.carrinho).then(() => {
                                this.deletar(pedidoDB.id).then(() => {
                                    resolve(result.alerta);
                                });
                            });
                        });
                    }
                });
            });
        });
    }
    
    getPedidoByCliente(idCliente) {
        return new Promise((resolve) => {
            this._getAll().then((pedidos) => {
                if (Find(pedidos, (pedido) => { return pedido.cliente.id == idCliente; })) {
                    resolve(true);
                } else {
                    resolve(false);
                }
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
