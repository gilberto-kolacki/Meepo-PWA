/*=========================================================================================
  File Name: errorDB.js
  Description: Classe de banco para erros do App
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import _ from 'lodash';
import BasicDB from './basicDB'

let localDB = null;
let remoteDB = null;

const createDB = () => {
    BasicDB.createDBLocal("erros").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 1, auto_compaction: true});
            BasicDB.createDBRemote(dataBaseLocal).then((dataBaseRemote) => {
                remoteDB = new PouchDB(dataBaseRemote, {ajax: {cache: false, timeout: 10000 }});
            })
        }
    })
};

createDB();

class errorDB {

    criarLog(erro) {
        return new Promise((resolve) => {

            console.log(erro);
            
            const logger = {};
            logger._id = _.toString(new Date().getTime());
            logger.compnente = erro.vm.id;
            logger.caminho = erro.vm.$el.baseURI;
            logger.erro = erro.info;
            logger.messagem = erro.err.message;
            this.salvar(logger).then((result) => {
                resolve(result);
            })
        });
    }

    salvar(logger) {
        return new Promise((resolve) => {
            localDB.put(logger).then((result) => {
                resolve(result);
            }).catch((erro) => {
                console.log(erro);
                resolve(erro);
            });
        });
    }

    getAll() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((erro) => {
                    delete erro.doc['_rev'];
                    return _.clone(erro.doc);
                }))
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            localDB.get(_.toString(id)).then((result) => {
                delete result['_rev'];
                resolve(result);  
            }).catch(() => {
                resolve();
            });
        });
    }

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    

}
export default new errorDB();