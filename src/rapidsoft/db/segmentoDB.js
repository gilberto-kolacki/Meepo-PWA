/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco de Segmentos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';
import Storage from '../utils/storage';

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

    getSegmentosCarrinho() {
        return new Promise((resolve) => {
            const idsSegmentos = Storage.getSegmentosCarrinho();
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