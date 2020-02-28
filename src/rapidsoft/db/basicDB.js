/*=========================================================================================
  File Name: basicDB.js
  Description: Classe Default de banco 
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBUPSert from 'pouchdb-upsert';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBUPSert);

import Config from '../../../public/config.json';
// import ErrorUtils from './errorDB';

const createDBLocal = (dataBaseName, representante) => {
    return "meepo_"+Config.empresa+"_rep_"+representante.id+"_"+dataBaseName;
};

const createDBLocalBasic = (dataBaseName) => {
    return "meepo_"+Config.empresa+"_"+dataBaseName;
};

const createDBRemote = (dataBaselocal) => {
    return Config.endereco_couchdb+dataBaselocal;
};

const getRepres = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
};

const create = (name, remote, callback) => {
    if (remote) {
        const representante = getRepres();
        if (representante) {
            const dataBaseLocal = createDBLocal(name, representante);
            if (dataBaseLocal) {
                const localDB = new PouchDB(dataBaseLocal, {revs_limit: 1, auto_compaction: true});
                const dataBaseRemote = createDBRemote(dataBaseLocal);
                if (dataBaseRemote) {
                    const remoteDB = new PouchDB(dataBaseRemote, {skip_setup: false, auto_compaction: true, ajax: {cache: false, timeout: 50000 }});
                    callback(localDB, remoteDB);
                }
            }
        }
    } else {
        const dataBaseLocal = createDBLocalBasic(name);
        if (dataBaseLocal) {
            const localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
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
    return _.cloneDeep(logger); 
};

class basicDB {

    // 1 local, 2 local e remote
    constructor(name, remote = false) {
        this._name = name;
        this._remote = remote;
        this._lastId = null;        
        this.createBases();
    }

    createBases() {
        create(this._name, this._remote, (localDB, remoteDB) => {
            this._localDB = localDB;
            this._remoteDB = remoteDB;
            create("erros", true, (localErroDB, remoteErroDB) => {
                this._localErroDB = localErroDB;
                this._remoteErroDB = remoteErroDB;
            });
        });
    }

    getLocalErroDB() {
        return this._locaErrolDB;
    }

    _findLastId() {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {
                    id: {$gte: null}
                },
                sort: [{'id':'desc'}],
                limit: 1
            }).then((result) => {
                if (result.docs.length == 1) {
                    this._lastId = result.docs[0].id;
                } else {
                    this._lastId = 0;
                }
                resolve(this._lastId);
            });
        });
    }

    _getNextId() {
        return new Promise((resolve) => {
            this._findLastId().then((ultimoId) => {
                ultimoId = ultimoId >= 0 ? ultimoId : 0;
                resolve(ultimoId+1);
            });
        });
    }

    _exists(array, value) {
        // return array.indexOf(value) >= 0 ? true : false;
        return _.findIndex(array, (object) => {
            return object == value;
        }) >= 0 ? true : false;
    }

    _existsId(array, value) {
        return _.findIndex(array, (object) => {
            return object.id === value.id;
        }) >= 0 ? true : false;
    }

    _limparBase() {
        return new Promise((resolve) => {
            if (this._localDB) {
                this._localDB.destroy().then(() => {
                    this.createBases();
                    resolve();
                }).catch((err) => {
                    this._criarLogDB({url:'db/basicDB',method:'_limparBase',message: err,error:'Failed Request'});
                    resolve(err);
                });
            } else {
                resolve();
            }
        });
    }

    _salvar(value) {
        return new Promise((resolve, reject) => {
            try {
                value._id = (value.id ? value.id : value._id).toString();                           
                this._localDB.put(value).then((result) => {
                    resolve(result.id);
                }).catch((erro) => {
                    if (erro.status == 409) {
                        this._getById(value.id, true).then((objectDB) => {
                            this._salvar(objectDB.value).then(() => {
                                resolve();
                            });
                        });
                    } else if (erro.name == "QuotaExceededError") {
                        alert('QuotaExceededError');
                        console.log(erro);
                        reject(erro);
                    } else {
                        this._criarLogDB({url:'db/basicDB',method:'_salvar',message: erro,error:'Failed Request'});
                        reject(erro);
                    }
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    _getById(id, rev = false) {
        return new Promise((resolve) => {
            this._localDB.get(String(id)).then((result) => {
                if(!rev) delete result['_rev'];
                resolve({existe: true, value: result});  
            }).catch((error) => {
                this._criarLogDB({url:'db/basicDB', method:'_getById', message: error, error:'Failed Request'});
                resolve({existe: false, result: error});
            });
        });
    }

    _getAll() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                const rows = resultDocs.rows.filter((row) => row.doc.language !== "query" && row.doc.hasOwnProperty('id'));
                resolve(rows.map((row) => row.doc));
            }).catch((err) => {
                this._criarLogDB({url:'db/basicDB',method:'_getAll',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

    _count() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const rows = resultDocs.rows.filter((row) => !row.id.includes("_design"));
                resolve(rows.length);
            }).catch((err) => {
                this._criarLogDB({url:'db/basicDB',method:'_getAll',message: err,error:'Failed Request'});
                resolve(0);
            });
        });
    }

    _getAllMap() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                const rows = resultDocs.rows.filter((row) => row.doc.language !== "query");
                const result = rows.reduce((map, row) => {
                    map[row.doc.id] = row.doc;
                    return map;
                }, {});
                resolve(result);
            }).catch((err) => {
                this._criarLogDB({url:'db/basicDB',method:'_getAll',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

    

    _getIds() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                resolve(resultDocs.rows.map((row) => row.id ));
            }).catch((err) => {
                this._criarLogDB({url:'db/basicDB',method:'_getAll',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

    _getFindCondition(condition) {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: condition,
            }).then((result) => {
                resolve(result.docs);
            });
        });
    }
    
    _deletar(id) {
        return new Promise((resolve) => {
            this._getById(id, true).then((object) => {
                this._localDB.remove(object.value).then((result) => {
                    resolve(result);
                }).catch(() => {
                    resolve();
                });
            });
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

    // _sincNuvem() {
    //     return new Promise((resolve) => {
    //         if (window.navigator.onLine) {
    //             this._localDB.replicate.to(this._remoteDB).then((result) => {
    //                 if (result.ok) {
    //                     this._localDB.replicate.from(this._remoteDB).then((result) => {
    //                         if (result.ok) {
    //                             resolve();
    //                         } else {
    //                             this._sincNuvem().then(() => {
    //                                 resolve();
    //                             });
    //                         }
    //                     });
    //                 } else {
    //                     this._sincNuvem().then(() => {
    //                         resolve();
    //                     });
    //                 }
    //             });
    //         } else {
    //             resolve();
    //         }
    //     });
    // }

    // logs
    __salvarErro(value) {
        return new Promise((resolve, reject) => {
            if (this._localErroDB) {
                this._localErroDB.put(value).then((result) => {
                    resolve(_.toNumber(result.id));
                }).catch((erro) => {
                    this._criarLogDB({url:'db/basicDB',method:'_salvar',message: erro, error:'Failed Request'});
                    reject(erro);
                });
            } else {
                resolve();
            }
        });
    }

    _criarLogDB(erro){
        return new Promise((resolve) => {
            const logger = newLog('DB', erro.method, erro.url, erro.error,erro.message);
            this.__salvarErro(logger).then((result) => {
                resolve(result);
            });
        });
    }

    _criarLog(erro) {
        return new Promise((resolve) => {
            console.log(erro);
            const caminho = erro.vm.$el ? erro.vm.$el.baseURI : erro.vm.$vnode.tag;
            const logger = newLog('tela', erro.vm.id, caminho, erro.info, erro.err.message);
            this.__salvarErro(logger).then((result) => {
                resolve(result);
            });
        });
    }

    _criarLogErroSinc(sinc, erro, mensagem) {
        return new Promise((resolve) => {
            erro = _.cloneDeep(erro.config);
            delete erro['transformRequest'];
            delete erro['transformResponse'];
            delete erro['validateStatus'];
            delete erro['xsrfCookieName'];
            delete erro['xsrfHeaderName'];
            delete erro['adapter'];
            const logger = newLog('sincronizacao', sinc.methodo, erro.url, erro, mensagem);
            this.__salvarErro(logger).then((result) => {
                resolve(result);
            }).catch(() => {
                resolve();
            });
        });
    }

    //Sinc counch DB
    _sincNuvem() {
        return new Promise((resolve) => {
            if (window.navigator.onLine && this._remoteDB) {
                this._sincToNuvem().then(() => {
                    this._sincFromNuvem().then(() => {
                        resolve();        
                    });
                });
            } else {
                resolve();
            }
        });
    }

    _sincToNuvem() {
        return new Promise((resolve) => {
            try {
                this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    const objectsLocal = resultDocs.rows.map((row) => row.doc).filter((doc) => doc.alterado);
                    if (objectsLocal.length > 0) {
                        const done = _.after(objectsLocal.length, () => resolve());      
                        objectsLocal.forEach(object => {
                            delete object._rev;
                            this._remoteDB.put(object).then(() => {
                                done();
                            }).catch((error) => {
                                if (error.status == 409 ) {
                                    this._remoteDB.get(object._id).then((objectRemote) => {
                                        object._rev = objectRemote._rev;
                                        this._remoteDB.put(object).then(() => {
                                            done();
                                        });
                                    });
                                } else {
                                    this._criarLogDB({url: this._localDB.name, method:'sincFromNuvem', message: error, error:'Failed Request'});
                                    done();
                                }
                            });
                        });
                    } else {
                        resolve();
                    }
                }).catch((err) => {
                    this._criarLogDB({url: this._localDB.name, method:'sincFromNuvem', message: err, error:'Failed Request'});
                    resolve();
                });
            } catch (error) {
                console.log(error);
                resolve();
            }
        });
    }

    _sincFromNuvem() {
        return new Promise((resolve) => {
            try {
                this._remoteDB.allDocs({include_docs: true}).then((resultDocs) => {
                    const objectsNuvem = resultDocs.rows.map((row) => row.doc);
                    if (objectsNuvem.length > 0) {
                        const done = _.after(objectsNuvem.length, () => resolve());      
                        objectsNuvem.forEach(objectNuvem => {
                            this._localDB.put(objectNuvem).then(() => {
                                done();
                            }).catch(() => {
                                done();
                            });
                        });
                    } else {
                        resolve();
                    }
                }).catch((err) => {
                    this._criarLogDB({url: this._localDB.name, method:'sincFromNuvem', message: err, error:'Failed Request'});
                    resolve();
                });
            } catch (error) {
                console.log(error);
                resolve();
            }
        });
    }

    __IndexedError(localDB) {
        const request = indexedDB.open(localDB.__opts.name);
 
        // request.onupgradeneeded = () => {
        //     console.log("//fazer a criação das tabelas, indices e popular o banco se necessário");
        // };
        
        request.onsuccess = (e) => { 
            e.target.result.onabort = (event) => {
                console.log('onabort');
                console.log(event);
                
            };
        };
        
        request.onerror = (e) => { 
            console.log('onerror');
            console.log(e);
        };
    }

    

}

export default basicDB;