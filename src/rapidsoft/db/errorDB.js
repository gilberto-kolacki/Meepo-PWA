/*=========================================================================================
  File Name: errorDB.js
  Description: Classe de banco para erros do App
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

class errorDB extends BasicDB {

    constructor() {
        super("erros", true);
    }

    criarLog(erro) {
        return new Promise((resolve) => {
            console.log(erro);
            
            const logger = {};
            logger._id = _.toString(new Date().getTime());
            logger.compnente = erro.vm.id;
            logger.caminho = erro.vm.$el.baseURI;
            logger.erro = erro.info;
            logger.messagem = erro.err.message;
            this._salvar(logger).then((result) => {
                resolve(result);
            })
        });
    }

    limparBase() {
        return this._limparBase();
    }

}
export default new errorDB();