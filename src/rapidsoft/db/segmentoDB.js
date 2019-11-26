/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco de Segmentos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

// let localDB = null;

// const createDB = () => {
//     BasicDB.createDBLocalBasic("segmento").then((dataBaseLocal) => {
//         if (dataBaseLocal) {
//             localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
//         }
//     })
// };

// createDB();

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

    limparBase() {
        return new Promise((resolve) => {
            this._localDB.destroy().then(() => {
                resolve(new segmentoDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    

}
export default new segmentoDB();