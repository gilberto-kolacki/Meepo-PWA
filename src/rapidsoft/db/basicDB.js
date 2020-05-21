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

// const filter = (doc) => {
//     if(doc.alterado || doc._deleted || doc.status < 50) {
//         if (doc._deleted) console.log('filter', doc);
//         return true;
//     } else {
//         return false;
//     }
// };

// const setTimeout = (delay) => {
//     if (delay === 0) return 1000;
//     return delay * 3;
// };

// const changeMethod = (origem, change) => {
//     console.log("'change "+origem+"' yo, something changed!", change);
// };

// const pausedMethod = (origem, info) => {
//     console.log("'paused "+origem+"' replication was paused, usually because of a lost connection", info);
// };

// const activeMethod = (origem, info) => {
//     console.log("'active "+origem+"' replication was resumed", info);
// };

// const deniedMethod = (origem, err) => {
//     console.log("'denied "+origem+"'a document failed to replicate (e.g. due to permissions)", err);
// };

// const completeMethod = (origem, info) => {
//     console.log("'complete "+origem+"' handle complete", info);
// };

// const errorMethod = (origem, err) => {
//     console.log("'error "+origem+"' totally unhandled error (shouldn't happen)", err);
// };


// const changes = (localDB) => {
//     localDB.changes({
//         since: 'now',
//         live: true,
//         include_docs: false,
//         conflicts: true,
//         filter: (doc) => filter(doc)
//     }).on('change', (change) => changeMethod('changes', change)
//     ).on('complete', (info) => completeMethod('changes', info)
//     ).on('error', (err) => errorMethod('changes', err));
// };

// const replicate = (localDB, remoteDB) => {
//     if (remoteDB) {
//         // changes(localDB);
//         localDB.replicate.to(remoteDB, {
//             since: 'now',
//             live: true,
//             retry: true,
//             back_off_function: (delay) => setTimeout(delay),
//             filter: (doc) => filter(doc)
//         }).on('change', (change) => changeMethod('to', change)
//         ).on('paused', (info) => pausedMethod('to', info)
//         ).on('active', (info) => activeMethod('to', info)
//         ).on('denied', (err) => deniedMethod('to', err)
//         ).on('complete', (info) => completeMethod('to', info)
//         ).on('error', (err) => errorMethod('to', err));

//         localDB.replicate.from(remoteDB, {
//             since: 'now',
//             live: true,
//             retry: true,            
//             back_off_function: (delay) => setTimeout(delay),
//         }).on('change', (change) => changeMethod('from', change)
//         ).on('paused', (info) => pausedMethod('from', info)
//         ).on('active', (info) => activeMethod('from', info)
//         ).on('denied', (err) => deniedMethod('from', err)
//         ).on('complete', (info) => completeMethod('from', info)
//         ).on('error', (err) => errorMethod('from', err));
//     }
// };

// const sync = (localDB, remoteDB) => {
//     if (remoteDB) {
//         localDB.replicate.from(remoteDB).on('complete', function(info) {
//             console.log('complete sync', info);
//             localDB.sync(remoteDB, { 
//                 live: true, 
//                 retry: true,
//                 back_off_function: (delay) => setTimeout(delay),
//                 filter: (doc) => filter(doc),
//             })
//             .on('change', (change) => changeMethod('sync', change))
//             .on('paused', (info) => pausedMethod('sync', info))
//             .on('error', (err) => errorMethod('sync', err));
//         }).on('error', (err) => errorMethod('from', err));
//     }
// };


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
    return CloneDeep(logger); 
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
            // replicate(this._localDB, this._remoteDB);
            // replicate(this._localDB, this._remoteDB);
            // sync(this._localDB, this._remoteDB);
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
        return new Promise((resolve, reject) => {
            try {
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
                }).catch(() => {resolve(0);});
            } catch(error) {
                this._criarLogDB({url:'db/basicDB',method:'_findLastId',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _getNextId() {
        return new Promise((resolve, reject) => {
            try {
                this._findLastId().then((ultimoId) => {
                    ultimoId = ultimoId >= 0 ? ultimoId : 0;
                    resolve(ultimoId+1);
                }).catch((error) => {
                    this._criarLogDB({url:'db/basicDB',method:'_getNextId',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch(error) {
                this._criarLogDB({url:'db/basicDB',method:'_getNextId',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    _exists(array, value) {
        // return array.indexOf(value) >= 0 ? true : false;
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
                
                this._localDB.put(value).then((result) => {
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
                        const done = After(objectsLocal.length, () => resolve());      
                        objectsLocal.forEach(object => {
                            delete object._rev;
                            this._remoteDB.put(object).then((teste) => {
                                console.log(teste);
                                
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
                        const done = After(objectsNuvem.length, () => resolve());      
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