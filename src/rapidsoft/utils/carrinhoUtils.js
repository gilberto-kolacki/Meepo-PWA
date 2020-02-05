// import _ from "lodash";
import Storage from '../utils/storage';
import ProdutoDB from '../db/produtoDB';
import OrcamentoDB from '../db/orcamentoDB';

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
                embarque.itensPedido = embarque.itensPedido.map((item) => {
                    const itemCor = {};
                    itemCor.referencia = item.referencia;
                    itemCor.segmento = item.segmento;
                    itemCor.idCor = item.cor.idCor;
                    itemCor.codigo = item.cor.nome;
                    itemCor.idProduto = item.cor.idProduto;
                    itemCor.quantidade = item.cor.quantidade;
                    itemCor.precoVenda = item.cor.precoVenda;
                    itemCor.precoCusto = item.cor.precoCusto;
                    itemCor.tamanhos = item.cor.tamanhos;
                    itemCor.categorias = item.cor.categorias;
                    return itemCor;
                });
                return embarque;
            });
            resolve(pedido);
        });
    }

    getCarrinho(orcamentoId = null) {
        return new Promise((resolve) => {
            const getProdutos = (carrinho) => {
                ProdutoDB.getProdutosFromCarrinho(carrinho).then((carrinho) => {
                    resolve(carrinho);
                });
            };

            if (orcamentoId) {
                OrcamentoDB._getById(orcamentoId).then((orcamento) => {
                    getProdutos(orcamento.value);
                });
            } else {
                getProdutos(Storage.getCarrinho());
            }
        });
    }

        
}

export default new carrinhoUtils();