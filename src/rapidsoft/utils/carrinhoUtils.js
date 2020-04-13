// import _ from "lodash";
import ProdutoDB from '../db/produtoDB';
import ClienteDB from '../db/clienteDB';
import GrupoClienteDB from '../db/grupoClienteDB';
import CarrinhoDB from '../db/carrinhoDB';
import EmbarqueDB from '../db/embarqueDB';
import PeriodoDB from '../db/periodoDB';

class carrinhoUtils {

    newPedido() {
        return new Promise((resolve) => {
            const pedido = {};
            CarrinhoDB.getCarrinho().then((carrinho) => {
                pedido.cliente = carrinho.cliente;
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
                resolve(pedido);
            });
        });
    }

    setItensToPedidoEmbarques(idSegmento) {
        return new Promise((resolve) => {
            CarrinhoDB.getCarrinho().then((carrinho) => {                
                ProdutoDB.getProdutosFromCarrinho(carrinho).then((carrinhoTela) => {
                    EmbarqueDB.getEmbarquesCarrinho(carrinhoTela).then((embarques) => {
                        PeriodoDB.getPeriodosToEmbarque(embarques).then((embarques) => {
                            this.newPedido().then((pedido) => {
                                pedido.listEmbarques = embarques.reduce((listEmbarques, embarque) => {
                                    const itens = carrinhoTela.filter((itemCarrinho) => {
                                        return itemCarrinho.embarqueSelecionado.id === embarque.id 
                                            && itemCarrinho.embarqueSelecionado.seq === embarque.seq 
                                                && itemCarrinho.segmento.some((segmento) => segmento === idSegmento);
                                    });
                                    if (itens.length > 0) {
                                        embarque.itensPedido = itens;
                                        listEmbarques.push(embarque);
                                    }
                                    return listEmbarques;
                                }, []);
                                resolve(pedido);
                            });
                        });
                    });
                });
            });
        });
    }

    getCarrinho() {
        return new Promise((resolve) => {
            CarrinhoDB.getCarrinho().then((carrinhoBanco) => {
                ProdutoDB.getProdutosFromCarrinho(carrinhoBanco).then((carrinhoTela) => {
                    resolve(carrinhoTela);
                });
            });
        });
    }

    setOrcamentoToCarrinho(orcamento) {
        return new Promise((resolve) => {
            CarrinhoDB.getCarrinho().then((carrinhoNovo) => {
                ClienteDB.findById(orcamento.cliente.id).then((cliente) => {
                    GrupoClienteDB.getById(orcamento.cliente.grupoCliente).then((grupoCliente) => {
                        carrinhoNovo.cliente = cliente;
                        carrinhoNovo.cliente.grupoCliente = grupoCliente;
                        ProdutoDB.getProdutosAtivosFromEmbarques(orcamento.embarques).then((result) => {
                            if (result.embarques.some((embarque) => embarque.itens.length > 0)) {
                                carrinhoNovo.embarques = result.embarques.map((embarque) => ({id: embarque.id, dataEmbarque: embarque.dataEmbarque}));
                                carrinhoNovo.itens = orcamento.embarques.reduce((itens, embarque) => {
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
                                            tamanhoNew.embarqueSelecionado = item.embarqueSelecionado;
                                            return tamanhoNew;
                                        }));
                                        return tamanhos;
                                    }, []));
                                    return itens;
                                }, []);
                                CarrinhoDB.setCarrinho(carrinhoNovo).then(() => {
                                    resolve({deleta: true});
                                });
                            } else {
                                resolve({deleta: false, menssagem: result.menssagem});
                            }
                        });
                    });
                });
            });
        });
    }

        
}

export default new carrinhoUtils();