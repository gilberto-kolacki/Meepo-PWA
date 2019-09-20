import _ from 'lodash'

class produtoUtils {

    getTamanhosProduto(produto) {
        let tamanhos = [];
        let retorno = [];
        for (let index = 0; index < produto.cores.length; index++) {
            const cor = produto.cores[index];
            for (let index = 0; index < cor.tamanhos.length; index++) {
                const tamanho = cor.tamanhos[index];
                if (_.indexOf(tamanhos, tamanho.codigo) == -1) {
                    tamanhos.push(tamanho.codigo);
                    retorno.push(tamanho);
                }
            }
        }
        return retorno;
    }

    getCoresProduto(produto) {
        let cores = [];
        let retorno = [];
        for (let index = 0; index < produto.cores.length; index++) {
            const cor = produto.cores[index];
            cores.push(cor.codigo);
            retorno.push({codigo: cor.codigo, ativo: true});
        }
        return retorno;
    }
    
}

export default new produtoUtils();