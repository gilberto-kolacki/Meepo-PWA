/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco de Segmentos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class catalogoDB extends BasicDB {

    constructor() {
        super("catalogo");
    }

    limparBase() {
        return this._limparBase();
    }

    salvarSinc(catalogos) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(catalogos.length > 0) {
                    const done = _.after(catalogos.length, () => resolve());
                    catalogos.forEach(catalogo => {
                        catalogo._id = _.toString(catalogo.idCatalogo);
                        this._localDB.put(catalogo).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            this._localDB.get(_.toString(id)).then((result) => {
                delete result['capa'];
                delete result['base64'];
                delete result['_rev'];
                resolve(result);  
            }).catch(() => {
                resolve();
            });
        });
    }
    

}
export default new catalogoDB();