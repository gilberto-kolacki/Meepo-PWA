import _ from "lodash";
import Storage from '../utils/storage';

class pedidoUtils {

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
        return new Promise((resolve) => {
            const pedido = {};
            pedido.endEntrega = null;
            pedido.observacao = null;
            pedido.desconto1 = 0;
            pedido.desconto2 = 0;
            pedido.desconto3 = 0;
            resolve(pedido);
        });
    }

    gerarPedidosPorEmbarques(pedido, embarques) {
        return new Promise((resolve) => {
            const pedidosNew = [];
            const itens = Storage.getCarrinhoItens();
            const done = _.after(embarques.length, () => resolve(pedidosNew));
            embarques.forEach(embarque => {
                const newPedido = _.cloneDeep(pedido);
                newPedido.embarque = _.cloneDeep(embarque);
                newPedido.itens = _.cloneDeep(itens.filter((item) => item.embarque.id == embarque.id ));
                newPedido.itens = newPedido.itens.map((item) => {
                    delete item.embarque;
                    return item;
                });
                pedidosNew.push(newPedido);
                done();
            });
        });
    }

    concluirGeracaoPedidos(view, carrinho = false) {        
        Storage.deleteCarrinho();
        Storage.deleteGrupoCarrinho();
        Storage.deleteClienteCarrinho();
        if (carrinho) {
            view.$router.push({ name: 'orcamentoConsulta'});
        } else {
            view.$router.push({ name: 'pedidoConsulta'});
        }
    }
        
}

export default new pedidoUtils();