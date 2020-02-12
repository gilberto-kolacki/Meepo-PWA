/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco de Segmentos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';

class segmentoDB extends BasicDB {

    constructor() {
        super("segmento");
    }

    salva(segmentos) {
        return new Promise((resolve) => {
            const done = _.after(segmentos.length, () => resolve());
            segmentos.forEach(segmento => {
                segmento._id = _.toString(segmento.id);
                this._localDB.put(segmento).then(() => done()).catch(() => done());
            });
        });
    }

    getSegmentosItens(itens) {
        return itens.reduce((segmentos, produto) => {
            return segmentos.concat(produto.segmento);
        }, []);
    }

    getSegmentosCarrinho(itensCarrinho) {
        return new Promise((resolve) => {
            const idsSegmentos = this.getSegmentosItens(itensCarrinho);
            this._getFindCondition({id : {$in : idsSegmentos}}).then((segmentos) => {
                resolve(segmentos);
            });
        });
    }
    

}
export default new segmentoDB();