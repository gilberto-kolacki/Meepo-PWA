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
        return itens.map((produto) => produto.segmento).sort().reduce((init, current) => {
            if (init.length === 0 || init[init.length - 1] !== current) {
                init.push(current);
            }
            return init;
        }, []);
    }

    getSegmentosCarrinho(itensCarrinho) {
        return new Promise((resolve) => {
            const idsSegmentos = this.getSegmentosItens(itensCarrinho);
            const arraySegmentos = [];
            const done = _.after(idsSegmentos.length, () => resolve(arraySegmentos));
            idsSegmentos.forEach(idSegmento => {
                this._getById(idSegmento).then((segmento) => {
                    if (segmento.existe) {
                        arraySegmentos.push(segmento.value);
                    }
                    done();
                });
            });
        });
    }
    

}
export default new segmentoDB();