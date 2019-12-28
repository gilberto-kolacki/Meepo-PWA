import _ from "lodash"
import Storage from '../utils/storage'
// import PedidoDB from '../db/pedidoDB'

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
				itemStorage.embarque = itemCarrinho.embarque;
				done();
			});
        });
    }

    gerarPedidosFromEmbarques(pedido, embarques) {
        return new Promise((resolve) => {
            console.log("pedido", pedido);
            const itens = Storage.getCarrinhoItens();

            const done = _.after(embarques.length, () => resolve());
            embarques.forEach(embarque => {

                console.log(embarque);

                // console.log(PedidoDB);
                
                
                // PedidoDB.getNextIdPedido(() => {

                    const itensEmbarque = itens.filter((item) => item.embarque.id == embarque.id );
                    console.log(embarque);
                    console.log(itensEmbarque);
                    
                    
                    done();
                // });
            });
        });
    }

        
}

export default new pedidoUtils();