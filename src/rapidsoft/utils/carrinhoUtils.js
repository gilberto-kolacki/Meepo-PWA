// import _ from "lodash";
import Storage from '../utils/storage';
import ProdutoDB from '../db/produtoDB';
import ClienteDB from '../db/clienteDB';
import GrupoClienteDB from '../db/grupoClienteDB';

class carrinhoUtils {

    newCarrinho() {
        return {
            id: 0,
            grupoCliente: null,
            cliente: {
                cpfCnpj: null,
                nome: null,
            },
            valorTotal: 0,
            itens: [],            
        };
    }

    newPedido() {
        const pedido = {};
        pedido.endEntrega = null;
        pedido.observacao = null;
        pedido.desconto1 = 0;
        pedido.desconto2 = 0;
        pedido.desconto3 = 0;
        pedido.quantidade = 0;
        pedido.totalLiquido = 0;
        pedido.totalBruto = 0;
        pedido.dataPedido = new Date().getTime();
        pedido.dataEmbarque = null;
        pedido.cliente = Storage.getClienteCarrinho();
        return pedido;
    }

    setItensToPedidoEmbarques(embarques, itensCarrinho) {
        return new Promise((resolve) => {
            const pedido = this.newPedido();
            pedido.listEmbarques = embarques.map((embarque) => {
                embarque.itensPedido = itensCarrinho.filter((itemCarrinho) => itemCarrinho.embarque === embarque.id);
                return embarque;
            });
            resolve(pedido);
        });
    }

    getCarrinho() {
        return new Promise((resolve) => {
            ProdutoDB.getProdutosFromCarrinho(Storage.getCarrinho()).then((carrinho) => {
                resolve(carrinho);
            });
        });
    }

    setOrcamentoToCarrinho(orcamento) {
        return new Promise((resolve) => {
            Storage.setIdOrcamentoCarrinho(orcamento.id);
            ClienteDB.findById(orcamento.cliente.id).then((cliente) => {
                Storage.setClienteCarrinho(cliente);
                GrupoClienteDB.getById(orcamento.grupoCliente.id).then((grupoCliente) => {
                    Storage.setGrupoCarrinho(grupoCliente);
                    const embarques = orcamento.embarques.map((embarque) => {return {id: embarque.id, dataEmbarque: embarque.dataEmbarque};});
                    Storage.setEmbarquesCarrinho(embarques);
                    const itens = orcamento.embarques.reduce((itens, embarque) => {
                        itens = itens.concat(embarque.itens.reduce((tamanhos, item) => {
                            tamanhos = tamanhos.concat(item.tamanhos.map((tamanho) => {
                                const tamanhoNew = {};
                                tamanhoNew.id = tamanho.id;
                                tamanhoNew.sku = tamanho.sku;
                                tamanhoNew.seq = tamanho.seq;
                                tamanhoNew.codigo = tamanho.codigo;
                                tamanhoNew.quantidade = tamanho.quantidade;
                                tamanhoNew.referencia = item.referencia;
                                tamanhoNew.cor = item.idCor;
                                tamanhoNew.precoCusto = item.precoCusto;
                                tamanhoNew.idProduto = item.idProduto;
                                tamanhoNew.idSegmento = item.segmento;
                                return tamanhoNew;
                            }));
                            return tamanhos;
                        }, []));
                        return itens;
                    }, []);
                    Storage.setCarrinhoItens(itens);
                    resolve();
                });
            });
        });
    }

        
}

export default new carrinhoUtils();