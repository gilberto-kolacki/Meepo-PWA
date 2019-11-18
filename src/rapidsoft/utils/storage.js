import PedidoUtils from './pedidoUtils'


class storage {

    get(chave) {
        return JSON.parse(localStorage.getItem(chave));
    }

    set(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    delete(chave) {
        localStorage.removeItem(chave);
    }

    getPedidoCarrinho() {
        if (localStorage.getItem('pedidoCarrinho')) {
            return JSON.parse(localStorage.getItem('pedidoCarrinho'));
        } else {
            return PedidoUtils.newPedido();
        }
    }

}

export default new storage();