
import Storage from '../utils/storage'

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
            pedido.condPagto = {
                nome: null
            };
            resolve(pedido);
        });
    }

        
}

export default new pedidoUtils();