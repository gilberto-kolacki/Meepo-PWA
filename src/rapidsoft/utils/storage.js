class Storage {

    constructor() {
        this.CARRINHO = "carrinho";
        this.GRUPO_CLIENTE_CARRINHO = "grupoCliente";
        this.CLIENTE_CARRINHO = "cliente";        
    }

    get(chave) {
        return JSON.parse(localStorage.getItem(chave));
    }
    
    set(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }
    
    deleteStorage(chave) {
        localStorage.removeItem(chave);
    }
    
    existeCarrinho() {
        const carrinho = this.get(this.CARRINHO);
        if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    getCarrinho() {
        const carrinho = localStorage.getItem(this.CARRINHO);
        return JSON.parse(carrinho);
    }
    
    setCarrinho(carrinho) {
        localStorage.setItem(this.CARRINHO, JSON.stringify(carrinho));
    }
    
    deleteCarrinho() {
        localStorage.removeItem(this.CARRINHO);
    }
    
    getGrupoCarrinho() {
        const carrinho = this.getCarrinho();
        if (carrinho && carrinho[this.CLIENTE_CARRINHO]) {
            return carrinho[this.CLIENTE_CARRINHO][this.GRUPO_CLIENTE_CARRINHO];
        } else {
            return this.get("grupo_padrao");
        }
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
        if (carrinho && carrinho[this.CLIENTE_CARRINHO].nome) {
            return carrinho[this.CLIENTE_CARRINHO];
        } else {
            return null;
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

    validaCarrinho(view, acao) {
        if (this.existeCarrinho()) {
            view.$vs.dialog({
                color: 'warning',
                title: 'Não foi possível reabrir o orçamento!',
                text: 'Há itens no carrinho, para reabrir um orçamento é necessário limpar o carrinho ou finalizar a compra!',
                acceptText: 'Entendi',
            });
        } else {
            acao();
        }
    }
}

export default new Storage();

