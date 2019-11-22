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

    getGrupoCarrinho() {
        if (localStorage.getItem('grupoCarrinho')) {
            return JSON.parse(localStorage.getItem('grupoCarrinho'));
        } else {
            return null;
        }
    }

    setGrupoCarrinho(grupo) {
        localStorage.setItem('grupoCarrinho', JSON.stringify(grupo));
    }

    setClienteCarrinho(cliente) {
        delete cliente['_id'];
        delete cliente['_rev'];
        localStorage.setItem('clienteCarrinho', JSON.stringify(cliente));
    }

    getClienteCarrinho() {
        if (localStorage.getItem('clienteCarrinho')) return JSON.parse(localStorage.getItem('clienteCarrinho'));
        else return null;
    }

    deleteClienteCarrinho() {
        localStorage.removeItem('clienteCarrinho');
    }

    setUsuario(usuario) {
        localStorage.setItem('userInfo', JSON.stringify(usuario));
    }
    
    getUsuario() {
        if (localStorage.getItem('userInfo')) return JSON.parse(localStorage.getItem('userInfo'));
        else return null;
    }

}

export default new storage();