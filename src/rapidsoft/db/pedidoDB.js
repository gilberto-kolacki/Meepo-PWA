/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
import After from 'lodash/after';
import BasicDB from './basicDB';
import CarrinhoDB from './carrinhoDB';
import ClienteDB from './clienteDB';
import ProdutoDB from './produtoDB';
import GrupoClienteDB from './grupoClienteDB';

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

    getPedido(idPedido) {
        return new Promise((resolve, reject) => {
            this._getById(idPedido, true).then((pedido) => {
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
                this.getPedido(pedido.id).then((object) => {
                    pedido._rev = object._rev;
                    pedido.embarque = object.embarque;
                    pedido.cliente.id = String(pedido.cliente.id);
                    this._salvar(pedido).then(() => {
                        resolve();
                        // TODO (Luiz): Removido para testar a aplicação sem sincronizar base local com a nuvem
                        /* if (object.status < 50) {
                            this._remoteDB.get(pedido.id).then(() => {
                                this._remoteDB.remove(objectRemote).then(() => {
                                    resolve();
                                });
                            });
                        } else {
                            resolve();
                        } */
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
                resolve(result);
            }).catch((err) => {
                this._criarLogDB({url:'db/pedidoDB',method:'deletar',message: err,error:'Failed Request'});
                reject(err);
            });
        });
    }

    createPedidoCarrinhoFromPedido(pedido) {
        return new Promise((resolve) => {
            pedido = {
                pedidoParcial: pedido.pedidoParcial,
                antecipacaoPedido: pedido.antecipacaoPedido, 
                copiaEmail: pedido.copiaEmail,
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
            const itensCarrinho = [];
            const done = After(pedido.itens.length, () => resolve(itensCarrinho));
            pedido.itens.forEach((item) => {

                console.log("pedido", pedido);
                console.log("item", item);
                
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
                                embarqueSelecionado: {id: pedido.embarque, seq: 1}
                            };
                            itensCarrinho.push(produtoTamanhoCarrinho);
                        }
                    }
                    done();
                });
            });
        });
    }

    createCarrinhoFromPedido(idPedido, carrinho, montarPedido) {
        return new Promise((resolve) => {
            this._getById(idPedido, true).then((pedido) => {
                if (pedido.existe) {
                    pedido = pedido.value;
                    if (montarPedido) {
                        ClienteDB._getById(pedido.cliente.id).then((clientePedido) => {
                            if (clientePedido.existe) {
                                clientePedido = clientePedido.value;
                                GrupoClienteDB.getById(clientePedido.grupoCliente).then((grupoClienteCarrinho) => {
                                    clientePedido.grupoCliente = grupoClienteCarrinho;
                                    carrinho.cliente = clientePedido;
                                    this.createPedidoCarrinhoFromPedido(pedido).then((pedidoCarrinho) => {
                                        carrinho.pedido = pedidoCarrinho;
                                        this.createItensCarrinhoFromPedido(pedido).then((itensCarrinho) => {
                                            carrinho.itens = [...carrinho.itens.concat(itensCarrinho)];
                                            resolve(carrinho);
                                        });
                                    });
                                });
                            } else {
                                resolve(carrinho);
                            }
                        });
                    } else {
                        resolve(carrinho);
                    }
                } else {
                    resolve(carrinho);
                }
            });
        });
    }

    replicar(idsPedidos) {
        return new Promise((resolve) => {
            CarrinhoDB.getCarrinho().then((carrinho) => {
                if (idsPedidos.length > 1) {
                    const done = After(idsPedidos.length, () => resolve());
                    idsPedidos.forEach((idPedido) => {
                        this.createCarrinhoFromPedido(idPedido, carrinho, false).then((carrinhoResult) => {
                            carrinho = carrinhoResult;
                            done();
                        });
                    });
                } else {
                    this.createCarrinhoFromPedido(idsPedidos[0], carrinho, true).then((carrinhoResult) => {
                        CarrinhoDB.setCarrinho(carrinhoResult).then(() => {
                            resolve(carrinhoResult);
                        });
                    });
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
