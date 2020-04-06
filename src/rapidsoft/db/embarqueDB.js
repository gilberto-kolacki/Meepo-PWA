/*=========================================================================================
  File Name: embarqueDB.js
  Description: Classe de banco de embarques
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import Round from 'lodash/round';
import OrderBy from 'lodash/orderBy';
import Intersection from 'lodash/intersection';
import BasicDB from './basicDB';
import Storage from '../utils/storage';

class embarqueDB extends BasicDB {

    constructor() {
        super("embarque");
        this.indexes = ['id', 'idSegmento'];
        this._createIndexes(this.indexes, 'embarque_segmento');
    }

    salvarSinc(embarques) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(embarques.length > 0) {
                    const done = After(embarques.length, () => resolve());
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
        return new Promise((resolve) => {
            const grupo = Storage.getGrupoCarrinho();
            const embarques = Intersection(grupo.embarques, produto.embarques);
            this._getFindCondition({$and : [{id : {$in : embarques}}, {idSegmento : {$in : produto.segmento}}]}).then((embarques) => resolve(embarques[0]));
        });
    }

    calcularPrecoCarrinho(precoProduto) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        return Round(precoProduto.precoCusto + ((percentual/100) * precoProduto.precoCusto), 2);
    }

    getInfosEmbarques(carrinho) {
        return new Promise((resolve) => {
            const embarques = new Map();
            const done = After(carrinho.length, () => resolve([...embarques.values()]));
            carrinho.forEach(produto => {
                this._getById(produto.embarque).then((embarque) => {
                    if (!embarques.has(produto.embarque)) {
                        embarque.value.dataEmbarque = embarque.value.dataInicio;
                        embarques.set(produto.embarque, embarque.value);
                    }
                    done();
                });
            });
        });
    }

    getQuantidadeEmbarque(itensEmbarque) {
        return itensEmbarque.reduce((total, item) => {
            return total + item.quantidade;
        }, 0);
    }

    getValorEmbarque(itensEmbarque) {
        return itensEmbarque.reduce((total, item) => {
            return total + item.precoCusto * item.quantidade;
        }, 0);
    }

    getEmbarquesPedido(pedido) {
        return new Promise((resolve) => {
            const grupo = pedido.grupoCliente;
            pedido.listEmbarques = OrderBy(pedido.listEmbarques, ['dataEmbarque', 'nome'], ['asc', 'asc']);
            pedido.listEmbarques = pedido.listEmbarques.reduce((listEmbarques, embarque) => {
                embarque.brinde = false;
                embarque.pedidoParcial = true;
                embarque.antecipacaoPedido = true;
                embarque.copiaEmail = true;
                embarque.formaPagamento = null;
                embarque.condicaoPagamento = null;
                embarque.quantidade = this.getQuantidadeEmbarque(embarque.itensPedido);
                embarque.valor = this.getValorEmbarque(embarque.itensPedido);
                embarque.totalBruto = Round(embarque.valor + ((Number(grupo.porcentagem)/100) * embarque.valor), 2);
                listEmbarques.push(embarque);
                return listEmbarques;
            }, []);
            resolve(pedido);
        });
    }

}

export default new embarqueDB();