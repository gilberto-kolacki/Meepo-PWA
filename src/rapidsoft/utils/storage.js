// import _ from "lodash";
import PedidoUtils from './pedidoUtils';

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
        if (carrinho) {
            return JSON.parse(carrinho);
        } else {
            return PedidoUtils.newCarrinho();
        }
    }

    setCarrinho(carrinho) {
        localStorage.setItem(CARRINHO, JSON.stringify(carrinho));
    }

    deleteCarrinho() {
        localStorage.removeItem(CARRINHO);
    }

    getCarrinhoItens() {
        if (this.existeCarrinho()) {
            const carrinho = this.getCarrinho();
            return carrinho.itens;
        } else {
            return [];
        }
    }

    setCarrinhoItens(itens) {
        const carrinho = this.getCarrinho();
        carrinho.itens = itens;
        this.setCarrinho(carrinho);
    }

    getGrupoCarrinho() {
        const carrinho = this.getCarrinho();
        return carrinho[GRUPO_CLIENTE_CARRINHO];
    }

    setGrupoCarrinho(grupoCliente) {
        const carrinho = this.getCarrinho();
        carrinho[GRUPO_CLIENTE_CARRINHO] = grupoCliente;
        this.setCarrinho(carrinho);
    }

    deleteGrupoCarrinho() {
        if (this.existeCarrinho()) {
            const carrinho = this.getCarrinho();
            carrinho[GRUPO_CLIENTE_CARRINHO] = null;
            this.setCarrinho(carrinho);
        }
    }

    existeClienteCarrinho() {
        if (this.existeCarrinho()) {
            const carrinho = this.getCarrinho();
            if (carrinho.cliente && carrinho.cliente.cpfCnpj) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    setClienteCarrinho(cliente) {
        delete cliente['_id'];
        delete cliente['_rev'];
        const carrinho = this.getCarrinho();
        carrinho[CLIENTE_CARRINHO] = cliente;
        this.setCarrinho(carrinho);
    }

    getClienteCarrinho() {
        const carrinho = this.getCarrinho();
        return carrinho[CLIENTE_CARRINHO];
    }

    deleteClienteCarrinho() {
        if (this.existeCarrinho()) {
            const carrinho = this.getCarrinho();
            carrinho[CLIENTE_CARRINHO] = null;
            this.setCarrinho(carrinho);
        }
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
        localStorage.setItem('catalogoCarrinho', JSON.stringify(catalogo));
    }

}

export default new storage();