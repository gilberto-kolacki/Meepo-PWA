/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco de Segmentos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';

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
                        catalogo.id = String(catalogo.idCatalogo);
                        const categorias = catalogo.paginas.reduce((categPag, pagina) => {
                            return categPag.concat(pagina.produtos.reduce((categProd, produto) => {
                                return categProd.concat(produto.cat);
                            }, []));
                        }, []);
                        catalogo.categorias = _.uniq(categorias);
                        catalogo.paginas = catalogo.paginas.sort((a, b) => {
                            if (a.pag > b.pag) return 1;
                            if (a.pag < b.pag) return -1;
                            return 0;
                        });
                        this._salvar(catalogo).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            }).catch((erro) => {
                this._criarLogDB({url:'db/catalogoDB',method:'salvarSinc',message: erro,error:'Failed Request'})
                resolve();
            });
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            this._getById(id).then((catalogo) => {
                catalogo = catalogo.value;
                delete catalogo['capa'];
                delete catalogo['base64'];
                resolve(catalogo);  
            }).catch((erro) => {
                this._criarLogDB({url:'db/catalogoDB',method:'getById',message: erro,error:'Failed Request'})
                resolve();
            });
        });
    }
    
}
export default new catalogoDB();