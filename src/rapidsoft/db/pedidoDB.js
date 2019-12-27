/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de Pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import BasicDB from './basicDB'
// import _ from 'lodash';

class pedidoDB extends BasicDB {

    constructor() {
        super("pedido", true);
    }

    // getNextIdPedido() {
    //     return new Promise((resolve) => {
    //         this._getIds().then((idsPedidos) => {
    //             console.log(idsPedidos);
    //             resolve();
    //         });
    //     });
    // }

}

export default new pedidoDB();