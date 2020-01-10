import _ from "lodash";
import Storage from '../utils/storage';

class pedidoUtils {

    newCarrinho() {
        return {
            numero: 0,
            numeroERP: 0,
            itens: [],            
        }
    }

    newPedido() {
        return new Promise((resolve) => {
            const pedido = {};
            pedido.cliente = Storage.getClienteCarrinho();
            pedido.endEntrega = null;
            pedido.observacao = null;
            pedido.desconto1 = 0;
            pedido.desconto2 = 0;
            pedido.desconto3 = 0;
            resolve(pedido);
        });
    }

    setEmbarqueItensCarrinho(carrinho) {
        return new Promise((resolve) => {
            const itensCarrinhoStorage = Storage.getCarrinhoItens();
			const done = _.after(itensCarrinhoStorage.length, () => {
				Storage.setCarrinhoItens(itensCarrinhoStorage);
				resolve();
			});        

			itensCarrinhoStorage.forEach(itemStorage => {
                const itemCarrinho = _.find(carrinho, (itemCarrinho) => itemCarrinho.cor.idProduto === itemStorage.idProduto);
                
                console.log(itemCarrinho.embarque);
                
				itemStorage.embarque = itemCarrinho.embarque;
				done();
			});
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

    concluirGeracaoPedidos(view) {        
        Storage.deleteCarrinho();
        Storage.deleteGrupoCarrinho();
        Storage.deleteClienteCarrinho();
        view.$router.push({ name: 'pedidoConsulta'});
    }

        
}

export default new pedidoUtils();