/*=========================================================================================
  File Name: pedidoDB.js
  Description: Classe de banco de pedidos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/
import BasicDB from './basicDB';

class pedidoDB extends BasicDB {

  constructor() {
    super("pedido", true);
  }

}

export default new pedidoDB();
