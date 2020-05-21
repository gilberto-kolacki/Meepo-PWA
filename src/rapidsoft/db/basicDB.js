/*=========================================================================================
  File Name: basicDB.js
  Description: Classe Default de banco 
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import IsEqual from 'lodash/isEqual';
import CloneDeep from 'lodash/cloneDeep';
import FindIndex from 'lodash/findIndex';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

import Config from '../../../public/config.json';

const createDBLocalBasic = (dataBaseName) => {
    return "meepo_"+Config.empresa+"_"+dataBaseName;
};

const create = (name, remote, callback) => {
    if (!remote) {
        const dataBaseLocal = createDBLocalBasic(name);
        if (dataBaseLocal) {
            const localDB = new PouchDB(dataBaseLocal, {auto_compaction: true});
            callback(localDB);
        }
    }
};

const newLog = (tipo, compnente, caminho, erro, messagem) => {
    const logger = {};
    logger._id = String(new Date().getTime());
    logger.type = tipo;
    logger.compnente = compnente;
    logger.caminho = caminho;
    logger.erro = erro;
    logger.messagem = messagem;
    return CloneDeep(logger); 
};

class basicDB {

    // 1 local, 2 local e remote
    constructor(name, remote) {
        this._name = name;
        this._remote = remote ? remote : false;
        this._lastId = null;        
        this.createBases();
    }

    createBases() {
        create(this._name, this._remote, (localDB) => {
            this._localDB = localDB;
            this._createErrorDB();
        });
    }

    _createErrorDB(callback) {
        create("erros", true, (localErroDB, remoteErroDB) => {
            this._localErroDB = localErroDB;
            this._remoteErroDB = remoteErroDB;
            callback();
        });
    }

    _exists(array, value) {
        return FindIndex(array, (object) => {
            return object == value;
        }) >= 0 ? true : false;
    }

    _existsId(array, value) {
        return FindIndex(array, (object) => {
            return object.id === value.id;
        }) >= 0 ? true : false;
    }

    _limparBase(dados = null) {
        return new Promise((resolve, reject) => {
            try {
                if (this._localDB) {
                    this._delete(dados).then(() => {
                        this._localDB.destroy().then(() => {
                            this.createBases();
                            resolve();
                        }).catch((error) => {
                            this._criarLogDB({url:'db/basicDB',method:'_limparBase',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    }).catch((error) => {
                        this._criarLogDB({url:'db/basicDB',method:'_limparBase',message: error,error:'Failed Request'});
                        reject(error);
                    });
                } else {
                    resolve();
                }
            } catch(error) {
                this._criarLogDB({url:'db/basicDB',method:'_limparBase',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _delete(dados) {
        return new Promise((resolve, reject) => {
            try {
                if (dados && dados.length > 0) {
                    const done = After(dados.length, () => resolve());    
                    dados.forEach(object => {
                        this._localDB.remove(object).then(() => {
                            done();
                        }).catch((error) => {
                            this._criarLogDB({url:'db/basicDB',method:'_delete',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    });
                } else {
                    resolve();
                }
            } catch(error) {
                this._criarLogDB({url:'db/basicDB',method:'_delete',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _salvar(value) {
        return new Promise((resolve, reject) => {
            try {
                value._id = (value.id ? value.id : value._id).toString();
                
                this._inserOrUpdate(value).then((result) => {
                    resolve({id: result.id, _rev: result.rev});
                }).catch((error) => {
                    if (error.status == 409) {
                        console.log('Salvar recursivo, ver controle _rev');
                        this._getById(value.id, true).then((objectDB) => {
                            value._rev = objectDB.value._rev;
                            this._salvar(value).then((result) => {
                                resolve(result);
                            }).catch((error) => {
                                this._criarLogDB({url:'db/basicDB',method:'_salvar',message: error,error:'Failed Request'});
                                reject(error);
                            });
                        }).catch((error) => {
                            this._criarLogDB({url:'db/basicDB',method:'_salvar',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    } else if (error.name == "QuotaExceededError") {
                        alert('QuotaExceededError');
                        this._criarLogDB({url:'db/basicDB',method:'_salvar',message: error,error:'Failed Request'});
                        reject(error);
                    } else {
                        this._criarLogDB({url:'db/basicDB',method:'_salvar',message: error,error:'Failed Request'});
                        reject(error);
                    }
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_salvar',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _inserOrUpdate(value){
        if (value._rev) return this._update(value);
        else return this._insert(value);
    }

    _insert(value){
        value._id = String(value.id ? value.id : value._id);
        return this._localDB.post(value);
    }

    _update(value){
        return new Promise((resolve, reject) => {
            this._localDB.put(value).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    _getById(id, rev = false) {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.get(String(id)).then((result) => {
                    if(!rev) delete result._rev;
                    resolve({existe: true, value: result});
                }).catch((error) => {
                    resolve({existe: false, result: error});
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB', method:'_getById', message: error, error:'Failed Request'});
                reject(error);
            }
        });
    }

    _getAll() {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    const rows = resultDocs.rows.filter((row) => row.doc.language !== "query" && row.doc.hasOwnProperty('id'));
                    resolve(rows.map((row) => {
                        return row.doc;
                    }));
                }).catch((error) => {
                    this._criarLogDB({url:'db/basicDB',method:'_getAll',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_getAll',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _count() {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                    const rows = resultDocs.rows.filter((row) => !row.id.includes("_design"));
                    resolve(rows.length);
                }).catch(() => {resolve(0);});
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_count',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _getAllMap() {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    const rows = resultDocs.rows.filter((row) => row.doc.language !== "query");
                    const result = rows.reduce((map, row) => {
                        map[row.doc.id] = row.doc;
                        return map;
                    }, {});
                    resolve(result);
                }).catch((error) => {
                    this._criarLogDB({url:'db/basicDB',method:'_getAllMap',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_getAllMap',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _getIds() {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                    resolve(resultDocs.rows.map((row) => row.id ));
                }).catch((error) => {
                    this._criarLogDB({url:'db/basicDB',method:'_getIds',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_getIds',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _getFindCondition(condition) {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.find({selector: condition}).then((result) => {
                    resolve(result.docs);
                }).catch((error) => {
                    this._criarLogDB({url:'db/basicDB',method:'_getFindCondition',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_getFindCondition',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }
    
    _deletar(id) {
        return new Promise((resolve, reject) => {
            try {
                this._getById(id, true).then((object) => {
                    this._localDB.remove(object.value).then((result) => {
                        resolve(result);
                    }).catch((error) => {
                        this._criarLogDB({url:'db/basicDB',method:'_deletar',message: error,error:'Failed Request'});
                        reject(error);
                    });
                }).catch((error) => {
                    this._criarLogDB({url:'db/basicDB',method:'_deletar',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_deletar',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    async _createIndex(index) {
        try {
            if (this._localDB) {
                const result = await this._localDB.createIndex({
                    index: {
                        fields: [index],
                        name: index +'_'+ this._name,
                        ddoc: '_'+index +'_'+ this._name,
                    }
                });
                if (result.result !== "exists") console.log(result);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async _createIndexes(indices, indexName) {
        try {
            if (this._localDB) {
                const result = await this._localDB.createIndex({
                    index: {
                        fields: indices,
                        name: indexName +'_'+ this._name,
                        ddoc: '_'+indexName +'_'+ this._name,
                        type: 'json',
                    }
                });
                if (result.result !== "exists") console.log(result);
            }
        } catch (err) {
            console.log(err);
        }
    }

    _getObjeto(objetoId) {
        return new Promise((resolve, reject) => {
            this._getById(objetoId, true).then((objeto) => {
                if (objeto.existe) resolve(objeto.value);
                else reject(objeto.existe);
            }).catch((error) => {
                this._criarLogDB({url:'db/basicDB',method:'_getObjeto',message: error,error:'Failed Request'});
                reject(error);
            });
        });
    }

    _salvarSinc(objeto) {
        return new Promise((resolve, reject) => {
            try {
                this._getObjeto(objeto._id).then((objetoDB) => {
                    objeto._rev = objetoDB._rev;
                    if (!IsEqual(objetoDB, objeto)) {
                        objeto.embarque = objetoDB.embarque;
                        objeto.cliente.id = String(objeto.cliente.id);
                        this._salvar(objeto).then(() => {
                            resolve();
                        }).catch((error) => {
                            this._criarLogDB({url:'db/basicDB',method:'_salvarSinc',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    } else {
                        resolve();
                    }
                }).catch((error) => {
                    if (!error) {
                        objeto.cliente.id = String(objeto.cliente.id);
                        this._salvar(objeto).then(() => {
                            resolve();
                        }).catch((error) => {
                            this._criarLogDB({url:'db/basicDB',method:'_salvarSinc',message: error,error:'Failed Request'});
                            reject(error);
                        });
                    } else {
                        this._criarLogDB({url:'db/basicDB',method:'_salvarSinc',message: error,error:'Failed Request'});
                        reject(error);
                    }
                });
            } catch (error) {
                this._criarLogDB({url:'db/basicDB',method:'_salvarSinc',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    // logs
    __salvarErro(value) {
        return new Promise((resolve) => {
            if (this._localErroDB) {
                this._localErroDB.put(value).then((result) => {
                    resolve(Number(result.id));
                }).catch(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    _criarLogDB(erro){
        const logger = newLog('DB', erro.method, erro.url, erro.error,erro.message);
        this.__salvarErro(logger);
    }

    _criarLog(erro) {
        console.log(erro);
        const caminho = erro.vm.$el ? erro.vm.$el.baseURI : erro.vm.$vnode.tag;
        const logger = newLog('tela', erro.vm.id, caminho, erro.info, erro.err.message);
        this.__salvarErro(logger);
    }

    _criarLogErroSinc(sinc, erro, mensagem) {
        return new Promise((resolve) => {
            erro = CloneDeep(erro.config);
            delete erro.transformRequest;
            delete erro.transformResponse;
            delete erro.validateStatus;
            delete erro.xsrfCookieName;
            delete erro.xsrfHeaderName;
            delete erro.adapter;
            const logger = newLog('sincronizacao', sinc.methodo, erro.url, erro, mensagem);
            this.__salvarErro(logger).then((result) => {
                resolve(result);
            }).catch(() => {
                resolve();
            });
        });
    }

}

export default basicDB;