import _ from 'lodash';
import Storage from '../utils/storage';
import ProdutoDB from '../db/produtoDB';

class produtoUtils {

    getTamanhosLabelProduto(produto) {
        const tamanhos = [];
        let labels = [];
        for (let index = 0; index < produto.cores.length; index++) {
            const cor = produto.cores[index];
            if (cor.tamanhos && cor.tamanhos.length > 0) {
                for (let index = 0; index < cor.tamanhos.length; index++) {
                    const tamanho = cor.tamanhos[index];
                    if (_.indexOf(tamanhos, tamanho.codigo) == -1) {
                        tamanhos.push(tamanho.codigo);
                        labels.push({codigo: tamanho.codigo, ativo: true, seq: tamanho.seq});
                    }
                }
            }
        }
        return labels;
    }

    getTamanhosCor(cor) {
        const carrinho = Storage.getCarrinho();
        if (cor.tamanhos && cor.tamanhos.length > 0) {
            return cor.tamanhos.map((tamanho) => {
                const itemCarrinho = _.find(carrinho.itens, (item) => item.id == tamanho.id);
                if (itemCarrinho) {
                    tamanho.quantidade = itemCarrinho.quantidade;
                }
                return tamanho;
            });
        } else {
            return [];
        }
    }

    getCoresProduto(produto) {
        return produto.cores.map((cor) => {
            return {codigo: cor.codigo, ativo: true, idCor: cor.idCor, idProduto: cor.idProduto, tamanhos: cor.tamanhos};
        });
    }

    createProdutoAdd(produto) {
        produto = _.cloneDeep(produto);
        produto.produtoAddCores = this.getCoresProduto(produto);
        produto.produtoLabelTamanhos = this.getTamanhosLabelProduto(produto);
        produto.produtoAddCores.forEach(cor => {
            cor.produtoAddTamanhos = this.getTamanhosCor(cor);
            delete cor['tamanhos'];
        });
        return produto;
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

    getCarrinho() {
        return new Promise((resolve) => {
            ProdutoDB.getProdutosFromCarrinho(Storage.getCarrinho()).then((carrinho) => {
                resolve(carrinho);
            });
        });
    }

    getProdutosSegmentos(segmentos, produtos) {
        return new Promise((resolve) => {
            const produtosSegmentos = new Map();
            segmentos.forEach(segmento => {
                const produtosSegmento = produtos.filter((produto) => {
                    return produto.segmento == segmento.id;
                });
                produtosSegmentos.set(segmento.id, produtosSegmento);
            });
            resolve(produtosSegmentos);
        });
    }

    calcularPreco(itemCor) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        const precoProduto = itemCor.precoCusto;
        return _.round(precoProduto + ((percentual/100) * precoProduto), 2);
    }

    calcularCarrinho(carrinho) {
        return new Promise((resolve) => {
            carrinho.valorTotal = 0;
            const done = _.after(carrinho.itens.length, () => resolve(carrinho));
            carrinho.itens.forEach((item) => {
                const precoProduto = this.calcularPreco(item);
                carrinho.valorTotal = _.round(carrinho.valorTotal + (item.quantidade * precoProduto), 2);
                done();
            });
        });
    }

}

export default new produtoUtils();