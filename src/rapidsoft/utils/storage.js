const CARRINHO = "carrinho";
const GRUPO_CLIENTE_CARRINHO = "grupoCliente";
const CLIENTE_CARRINHO = "cliente";

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

    existeCarrinho() {
        const carrinho = this.get(CARRINHO);
        if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    getCarrinho() {
        const carrinho = localStorage.getItem(CARRINHO);
        return JSON.parse(carrinho);
    }

    setCarrinho(carrinho) {
        localStorage.setItem(CARRINHO, JSON.stringify(carrinho));
    }

    deleteCarrinho() {
        localStorage.removeItem(CARRINHO);
    }

    getGrupoCarrinho() {
        const carrinho = this.getCarrinho();
        return carrinho.cliente[GRUPO_CLIENTE_CARRINHO];
    }

    existeClienteCarrinho(carrinho = null) {
        const existe = (cliente) => (cliente && cliente.cpfCnpj) ? true : false;
        if (carrinho) {
            return existe(carrinho.cliente);
        } else {
            if (this.existeCarrinho()) {
                carrinho = this.getCarrinho();
                return existe(carrinho.cliente);
            } else {
                return false;
            }
        }
    }

    getClienteCarrinho() {
        const carrinho = this.getCarrinho();
        return carrinho[CLIENTE_CARRINHO];
    }

    setUsuario(usuario) {
        localStorage.setItem('userInfo', JSON.stringify(usuario));
    }
    
    getUsuario() {
        if (localStorage.getItem('userInfo')) return JSON.parse(localStorage.getItem('userInfo'));
        else return null;
    }

    getCatalogo() {
        if (localStorage.getItem('catalogoCarrinho')) return JSON.parse(localStorage.getItem('catalogoCarrinho'));
        else return null;
    }

    setCatalogo(catalogo) {
        delete catalogo.capa;
        delete catalogo.base64;
        delete catalogo._id;
        delete catalogo._rev;
        localStorage.setItem('catalogoCarrinho', JSON.stringify(catalogo));
    }

}

export default new storage();