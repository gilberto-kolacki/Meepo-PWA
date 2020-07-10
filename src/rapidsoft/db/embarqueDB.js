/*=========================================================================================
  File Name: embarqueDB.js
  Description: Classe de banco de embarques
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import Round from 'lodash/round';
import Intersection from 'lodash/intersection';
import BasicDB from './basicDB';
import Storage from '../utils/storage';

class embarqueDB extends BasicDB {

    constructor() {
        super("embarque");
        this._createIndex('id');
        this.indexes = ['id', 'idSegmento'];
        this._createIndexes(this.indexes, 'embarque_segmento');
        this.indexesData = ['dataInicio', 'idSegmento'];
        this._createIndexes(this.indexesData, 'embarque_data_segmento');
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
        return new Promise((resolve,reject) => {
            const grupo = Storage.getGrupoCarrinho();
            const embarques = Intersection(grupo.embarques, produto.embarques);
            if (embarques.length > 0) {
                this._getFindCondition({$and : [{id : {$in : embarques}}, {idSegmento : {$in : produto.segmento}}]}).then((embarques) => resolve(embarques[0]));
            } else {
                reject({title:'Embarque não liberado ao grupo de cliente', text:'O embarque deste produto não está liberado para o grupo de cliente, sincronize o App e tente novamente.'});
            }
        });
    }

    calcularPrecoCarrinho(precoProduto) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        return Round(precoProduto.precoCusto + ((percentual/100) * precoProduto.precoCusto), 2);
    }

    getEmbarquesCarrinhoSegmento(segmento, carrinho) {
        return new Promise((resolve) => {
            const idsEmbarques = carrinho.reduce((idsEmbarques, produto) => {
                idsEmbarques.push(produto.embarque);
                idsEmbarques.push(produto.embarqueSelecionado.id);
                return idsEmbarques;
            }, []);
            this._getFindCondition({$and : [{id : {$in : idsEmbarques}}, {idSegmento : {$eq : segmento.id}}]}).then((embarques) => {
                resolve(embarques.map((embarque) => ({...embarque, dataEmbarque: embarque.dataInicio})));
            });
        });
    }

    isEqualsEmbarque(embarque, produto) {
        return embarque.id === produto.embarqueSelecionado.id && embarque.seq === produto.embarqueSelecionado.seq ? true : false;
    }

    getEmbarquesCarrinho(carrinho) {
        return new Promise((resolve) => {
            const idsEmbarques = carrinho.reduce((idsEmbarques, produto) => {
                idsEmbarques.push(produto.embarqueSelecionado.id);
                return idsEmbarques;
            }, []);
            this._getFindCondition({id : {$in : idsEmbarques}}).then((embarques) => {
                const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
                const embarquesCarrinho = carrinho.reduce((embarquesCarrinho, produto) => {
                    const index = embarquesCarrinho.findIndex((embarque) => this.isEqualsEmbarque(embarque, produto));
                    if (index >= 0) {
                        const embarque = {...embarquesCarrinho[index]};
                        embarque.quantidade = embarque.quantidade + produto.quantidade;
                        embarque.totalBruto = embarque.totalBruto + ((produto.precoCusto + ((percentual/100) * produto.precoCusto)) * produto.quantidade);
                        embarquesCarrinho[index] = embarque;
                    } else {
                        const embarque = {...embarques.find((embarque) => embarque.id === produto.embarqueSelecionado.id)};
                        embarque.seq = produto.embarqueSelecionado.seq;
                        embarque.dataEmbarque = embarque.dataInicio;
                        embarque.quantidade = produto.quantidade;
                        embarque.totalBruto = ((produto.precoCusto + ((percentual/100) * produto.precoCusto)) * produto.quantidade);
                        embarquesCarrinho.push(embarque);
                    }
                    return embarquesCarrinho;
                }, []);
                resolve(embarquesCarrinho);
            });
        });
    }    

    getFromEmbarque(embarque) {
        return new Promise((resolve) => {
            this._getFindCondition({$and : [{dataInicio : {$gte : embarque.dataInicio}}, {idSegmento : {$eq : embarque.idSegmento}}]}).then((embarques) => {
                resolve(embarques);
            });
        });
    }

}

export default new embarqueDB();