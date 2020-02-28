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

    deleteCarrinhoItens(itens) {
        const carrinho = this.getCarrinho();
        carrinho.itens = carrinho.itens.filter((itemCarrinho) => !(itens.some((itemDelete) => itemDelete === itemCarrinho.idProduto)));
        if (carrinho.itens.length > 0 && itens.length > 0) {
            this.setCarrinho(carrinho);
        } else {
            this.deleteCarrinho();
            this.deleteGrupoCarrinho();
            this.deleteClienteCarrinho();
        }
    }

    getCarrinhoItens() {
        if (this.existeCarrinho()) {
            const carrinho = this.getCarrinho();
            return carrinho.itens;
        } else {
            return [];
        }
    }

    getValorTotalCarrinho(itens) {
        return Number(itens.reduce((total, item) => {
            total = total + (item.quantidade * item.precoCusto);
            return total;
        }, 0).toFixed(2));
    }

    setCarrinhoItens(itens) {
        const carrinho = this.getCarrinho();
        carrinho.valorTotal = this.getValorTotalCarrinho(itens);
        carrinho.itens = itens;
        this.setCarrinho(carrinho);
    }

    setIdOrcamentoCarrinho(idOrcamento) {
        const carrinho = this.getCarrinho();
        carrinho.idOrcamento = idOrcamento;
        this.setCarrinho(carrinho);
    }

    getIdOrcamentoCarrinho() {
        if (this.existeCarrinho()) {
            const carrinho = this.getCarrinho();
            return carrinho.idOrcamento;
        } else {
            return null;
        }
    }

    setEmbarquesCarrinho(embarques) {
        const carrinho = this.getCarrinho();
        carrinho.embarques = embarques;
        this.setCarrinho(carrinho);
    }

    getEmbarquesCarrinho() {
        if (this.existeCarrinho()) {
            const carrinho = this.getCarrinho();
            return carrinho.embarques;
        } else {
            return null;
        }
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
        delete catalogo.capa;
        delete catalogo.base64;
        delete catalogo._id;
        delete catalogo._rev;
        localStorage.setItem('catalogoCarrinho', JSON.stringify(catalogo));
    }

}

export default new storage();