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

    newLog(tipo, compnente, caminho, erro, messagem) {
        const logger = {};
        logger._id = _.toString(new Date().getTime());
        logger.type = tipo;
        logger.compnente = compnente;
        logger.caminho = caminho;
        logger.erro = erro;
        logger.messagem = messagem;
        return _.cloneDeep(logger); 
    }

    listar() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((error) => {
                    return _.clone(error.doc);
                }))
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    criarLog(erro) {
        return new Promise((resolve) => {
            console.log(erro);
            const logger = this.newLog('tela', erro.vm.id, erro.vm.$el.baseURI, erro.info, erro.err.message);
            this._salvar(logger).then((result) => {
                resolve(result);
            })
        });
    }

    criarLogErroSinc(sinc, erro, mensagem) {
        return new Promise((resolve) => {
            erro = _.cloneDeep(erro.config);
            delete erro['transformRequest'];
            delete erro['transformResponse'];
            delete erro['validateStatus'];
            delete erro['xsrfCookieName'];
            delete erro['xsrfHeaderName'];
            delete erro['adapter'];
            const logger = this.newLog('sincronizacao', sinc.methodo, erro.url, erro, mensagem);
            this._salvar(logger).then((result) => {
                resolve(result);
            }).catch(() => {
                resolve();
            });
        });
    }

    limparBase() {
        return this._limparBase();
    }

}
export default new errorDB();