import _ from 'lodash'

class produtoUtils {

    getTamanhosProduto(produto) {
        const tamanhos = [];
        let retorno = [];
        for (let index = 0; index < produto.cores.length; index++) {
            const cor = produto.cores[index];
            for (let index = 0; index < cor.tamanhos.length; index++) {
                const tamanho = cor.tamanhos[index];
                if (_.indexOf(tamanhos, tamanho.codigo) == -1) {
                    tamanho.ativo = true;
                    tamanhos.push(tamanho.codigo);
                    retorno.push(_.clone(tamanho));
                }
            }
        }
        return retorno;
    }

    getCoresProduto(produto) {
        const retorno = [];
        for (let index = 0; index < produto.cores.length; index++) {
            retorno.push({codigo: produto.cores[index].codigo, ativo: true});
        }
        return retorno;
    }

    createProdutoAdd(produto) {
        produto = _.cloneDeep(produto);
        produto.produtoAddCores = this.getCoresProduto(produto);
        produto.produtoAddCores.forEach(cor => {
            cor.produtoAddTamanhos = this.getTamanhosProduto(produto);
        });
        return produto;
    }
    
}

export default new produtoUtils();