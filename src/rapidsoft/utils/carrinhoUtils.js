import _ from "lodash";
import Storage from '../utils/storage';
import ProdutoDB from '../db/produtoDB';
import CarrinhoDB from '../db/carrinhoDB';

class carrinhoUtils {

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

    getCarrinho(orcamentoId = null) {
        return new Promise((resolve) => {
            const getProdutos = (carrinho) => {
                ProdutoDB.getProdutosFromCarrinho(carrinho).then((carrinho) => {
                    resolve(carrinho);
                });
            };

            if (orcamentoId) {
                CarrinhoDB._getById(orcamentoId).then((orcamento) => {
                    getProdutos(orcamento.value);
                });
            } else {
                getProdutos(Storage.getCarrinho());
            }
        });
    }

        
}

export default new carrinhoUtils();