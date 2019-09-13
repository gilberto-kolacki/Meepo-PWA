import _ from 'lodash'

class produtoUtils {

    getTamanhosProduto(produto) {
        let tamanhos = [];
        for (let index = 0; index < produto.cores.length; index++) {
            const cor = produto.cores[index];
            for (let index = 0; index < cor.tamanhos.length; index++) {
                const tamanho = cor.tamanhos[index];
                if (_.indexOf(tamanhos, tamanho) == -1) tamanhos.push(tamanho);
            }
        }
        return tamanhos;
    }
    
}

export default new produtoUtils();