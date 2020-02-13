/*=========================================================================================
  File Name: embarqueDB.js
  Description: Classe de banco de embarques
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';
import Storage from '../utils/storage';

class embarqueDB extends BasicDB {

    constructor() {
        super("embarque");
        this.indexes = ['id', 'idSegmento', 'produtos'];
        this._createIndexes(this.indexes, 'embarque_segmento');
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
        return new Promise((resolve) => {
            const grupo = Storage.getGrupoCarrinho();
            this._getFindCondition({$and : [{id : {$in : grupo.embarques}}, {idSegmento : {$in : produto.segmento}}, {produtos : {$all : [produto.idProduto]}}]}).then((embarques) => {
                const embarqueProduto = embarques.find((embarque) => embarque.produtos.some((idProduto) => idProduto === produto.idProduto));
                resolve(embarqueProduto);
            });
        });
    }

    getInfosEmbarques(carrinho) {
        return new Promise((resolve) => {
            const grupo = Storage.getGrupoCarrinho();
            const embarques = new Map();
            const done = _.after(carrinho.length, () => resolve([...embarques.values()]));
            carrinho.forEach(produto => {
                this._getById(produto.embarque).then((embarque) => {
                    const calculaEmbarque = (idEmbarque) => {
                        const embarque = embarques.get(idEmbarque);
                        embarque.quantidade = (embarque.quantidade || 0 ) + produto.quantidade;
                        embarque.valor = ((embarque.valor || 0 ) + produto.precoCusto);
                        embarque.valor = _.round(embarque.valor + ((Number(grupo.porcentagem)/100) * embarque.valor), 2);
                        embarque.totalBruto = _.round((embarque.quantidade * embarque.valor), 2);
                        embarque.dataEmbarque = embarque.dataInicio;
                        done();
                    };
                    
                    if (embarques.has(produto.embarque)) calculaEmbarque(produto.embarque);
                    else {
                        embarques.set(produto.embarque, embarque.value);
                        calculaEmbarque(produto.embarque);
                    }
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
            return total + item.precoCusto;
        }, 0);
    }

    getEmbarquesPedido(pedido) {
        return new Promise((resolve) => {
            const grupo = pedido.grupoCliente;
            const done = _.after(pedido.listEmbarques.length,() => resolve(pedido));
            
            pedido.listEmbarques = _.orderBy(pedido.listEmbarques, ['dataEmbarque', 'nome'], ['asc', 'asc']);
            pedido.listEmbarques.forEach(embarque => {
                embarque.brinde = false;
                embarque.pedidoParcial = true;
                embarque.antecipacaoPedido = true;
                embarque.copiaEmail = true;
                embarque.formaPagamento = null;
                embarque.condicaoPagamento = null;
                embarque.quantidade = this.getQuantidadeEmbarque(embarque.itensPedido);
                embarque.valor = this.getValorEmbarque(embarque.itensPedido);
                embarque.totalBruto = _.round(embarque.quantidade * (embarque.valor + ((Number(grupo.porcentagem)/100) * embarque.valor)), 2);
                done();
            });
        });
    }

}

export default new embarqueDB();