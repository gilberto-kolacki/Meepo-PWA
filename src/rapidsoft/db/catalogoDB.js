/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco de Segmentos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'
import ErrorDB from './errorDB'

class catalogoDB extends BasicDB {

    constructor() {
        super("catalogo");
    }

    salvarSinc(catalogos) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(catalogos.length > 0) {
                    const done = _.after(catalogos.length, () => resolve());
                    catalogos.forEach(catalogo => {
                        catalogo._id = _.toString(catalogo.idCatalogo);
                        this._salvar(catalogo).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            }).catch((erro) => {
                ErrorDB.criarLogDB({url:'db/catalogoDB',method:'salvarSinc',message: erro,error:'Failed Request'})
                resolve();
            });
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            this._getById(id).then((catalogo) => {
                catalogo = catalogo.result;
                delete catalogo['capa'];
                delete catalogo['base64'];
                resolve(catalogo);  
            }).catch((erro) => {
                ErrorDB.criarLogDB({url:'db/catalogoDB',method:'getById',message: erro,error:'Failed Request'})
                resolve();
            });
        });
    }
    
}
export default new catalogoDB();