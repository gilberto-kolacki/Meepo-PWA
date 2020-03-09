import _ from 'lodash';
import Storage from '../utils/storage';

class produtoUtils{

    getTamanhosLabelProduto(produto) {
        const labels = produto.cores.reduce((labels, cor) => {
            for (let index = 0; index < cor.tamanhos.length; index++) {
                const tamanho = cor.tamanhos[index];
                labels[tamanho.codigo] = {codigo: tamanho.codigo, ativo: true, seq: tamanho.seq};
            }
            return labels;
        }, {});
        return Object.values(labels);
    }

    getTamanhosCor(cor) {
        const carrinho = Storage.getCarrinho();
        return cor.tamanhos.reduce((tamanhosCor, tamanho) => {
            const itemCarrinho = carrinho.itens.find((item) => item.id == tamanho.id);
            if (itemCarrinho) {
                tamanho.quantidade = itemCarrinho.quantidade;
            }
            tamanho.fixadoAtivo = tamanho.ativo;
            tamanhosCor.push(tamanho);
            return tamanhosCor;
        }, []);
    }

    getCoresProduto(produto) {
        return _.orderBy(produto.cores.map((cor) => {
            return {codigo: cor.codigo, ativo: true, idCor: cor.idCor, idProduto: cor.idProduto, tamanhos: cor.tamanhos};
        }), ['seq'], ['asc']);
    }

    createProdutosAddCarrinho(produtos) {
        return new Promise((resolve) => {
            produtos = produtos.filter((produto) => produto != undefined);
            const produtosAdd = produtos.reduce((produtosAdd, produto) => {
                produto.produtoAddCores = this.getCoresProduto(produto);
                produto.produtoLabelTamanhos = this.getTamanhosLabelProduto(produto);
                produto.produtoAddCores = produto.produtoAddCores.map((cor) => {
                    cor.produtoAddTamanhos = this.getTamanhosCor(cor);
                    delete cor.tamanhos;
                    return cor;
                });
                produtosAdd.push(produto);
                return produtosAdd;
            }, []);
            resolve(produtosAdd);
        });
    }

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

    getProdutosSegmentos(segmentos, produtos) {
        return segmentos.reduce((produtosSegmentos, segmento) => {
            produtosSegmentos[segmento.id] = produtos.filter((produto) => produto.segmento.indexOf(segmento.id) > -1 );
            return produtosSegmentos;
        }, {});
    }

    calcularPreco(itemCor, tipo = 1) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        const precoProduto = tipo === 1 ? itemCor.precoCusto : itemCor.precoVenda;
        return _.round(precoProduto + ((percentual/100) * precoProduto), 2);
    }

    calcularPrecoCarrinho(itemCor) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        const precoProduto = itemCor.precoCusto;
        return _.round(precoProduto + ((percentual/100) * precoProduto), 2);
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