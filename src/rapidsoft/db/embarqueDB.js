/*=========================================================================================
  File Name: embarqueDB.js
  Description: Classe de banco de embarques
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import defer from 'promise-defer';
import BasicDB from './basicDB';
import Storage from '../utils/storage';

class embarqueDB extends BasicDB {

    constructor() {
        super("embarque");
    }

    salvarSinc(embarques) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(embarques.length > 0) {
                    const done = _.after(embarques.length, () => resolve());
                    embarques.forEach(embarque => {
                        this._salvar(embarque).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    getEmbarqueProduto(produto) {
        const deferred = defer();
        const grupo = Storage.getGrupoCarrinho();

        this._getAll().then((embarques) => {
            embarques.forEach(embarque => {
                if (this._exists(grupo.embarques, embarque.id)) {
                    if (this._exists(produto.segmento, embarque.idSegmento)) {
                        if (this._exists(embarque.produtos, produto.cor.idProduto)) {
                            deferred.resolve(embarque);
                        }
                    }
                }
            });
        });
        return deferred.promise;
    }

    getInfosEmbarques(carrinho) {
        return new Promise((resolve) => {
            const grupo = Storage.getGrupoCarrinho();
            const embarques = new Map();
            const done = _.after(carrinho.length, () => resolve([...embarques.values()]));
            carrinho.forEach(produto => {
                if (!embarques.has(produto.embarque.id)) {
                    embarques.set(produto.embarque.id, produto.embarque);
                }
                const embarque = embarques.get(produto.embarque.id);
                embarque.quantidade = (embarque.quantidade || 0 ) + produto.cor.quantidade;
                embarque.valor = ((embarque.valor || 0 ) + produto.cor.precoVenda);
                embarque.valor = _.round(embarque.valor + ((Number(grupo.porcentagem)/100) * embarque.valor), 2);
                embarque.total = embarque.quantidade * embarque.valor;
                embarque.dataEmbarque = new Date(_.toNumber(embarque.dataInicio));
                done();
            });
        });
    }

    getPedidosPorEmbarques(carrinho) {
        return new Promise((resolve) => {
            const grupo = Storage.getGrupoCarrinho();
            const embarques = new Map();
            const done = _.after(carrinho.length, () => resolve([...embarques.values()]));
            carrinho.forEach(produto => {
                if (!embarques.has(produto.embarque.id)) {
                    embarques.set(produto.embarque.id, produto.embarque);
                }
                const embarque = embarques.get(produto.embarque.id);
                embarque.brinde = false;
                embarque.pedidoParcial = false;
                embarque.antecipacaoPedido = false;
                embarque.copiaEmail = false;
                embarque.quantidade = (embarque.quantidade || 0 ) + produto.cor.quantidade;
                embarque.valor = ((embarque.valor || 0 ) + produto.cor.precoVenda);
                embarque.valor = _.round(embarque.valor + ((Number(grupo.porcentagem)/100) * embarque.valor), 2);
                embarque.total = embarque.quantidade * embarque.valor;
                embarque.dataEmbarque = new Date(_.toNumber(embarque.dataInicio));
                done();
            });
        });
    }

}

export default new embarqueDB();