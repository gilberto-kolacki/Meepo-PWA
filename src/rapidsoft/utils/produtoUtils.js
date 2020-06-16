import Round from 'lodash/round';
import Storage from '../utils/storage';

class produtoUtils{


    criaPaginaProdutoSearch(produto) {
        return new Promise((resolve) => {
            const novaPagina = {};
            novaPagina.pag = 0;
            novaPagina.produtoA = {
                id: produto.cores[0].idProduto,
                ref: produto.referencia,
                seq: 1
            };
            resolve(novaPagina);
        });
    }

    addProdutoSearchFromPages(paginas, produto) {
        return new Promise((resolve) => {
            this.criaPaginaProdutoSearch(produto).then((pagina) => {
                paginas.push(pagina);
                resolve(paginas);
            });
        });
    }

    calcularPreco(itemCor, tipo = 1) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        const precoProduto = tipo === 1 ? (itemCor.precoCusto + ((percentual/100) * itemCor.precoCusto)) : itemCor.precoVenda;
        return Round(precoProduto, 2);
    }

    calcularPrecoCarrinho(itemCor) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        const precoProduto = itemCor.precoCusto;
        return Round(precoProduto + ((percentual/100) * precoProduto), 2);
    }

    calcularCarrinho(carrinho) {
        return new Promise((resolve) => {
            carrinho.valorTotal = carrinho.itens.reduce((total, item) => {
                return total = total + (item.quantidade * this.calcularPreco(item));
            }, 0);
            resolve(carrinho);
        });
    }

}

export default new produtoUtils();