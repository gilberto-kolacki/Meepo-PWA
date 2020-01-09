/*=========================================================================================
  File Name: basicDB.js
  Description: Classe Default de banco 
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import Config from '../../../public/config.json'
import Storage from '../utils/storage'
// import ErrorDB from './errorDB'

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBLiveFind from 'pouchdb-live-find';
PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBLiveFind);

const createDBLocal = (dataBaseName, representante) => {
    return "meepo_"+Config.empresa+"_rep_"+representante.id+"_"+dataBaseName;
}

const createDBLocalBasic = (dataBaseName) => {
    return "meepo_"+Config.empresa+"_"+dataBaseName;
}

const createDBRemote = (dataBaselocal) => {
    return Config.endereco_couchdb+dataBaselocal;
}

const create = (name, remote, callback) => {
    if (remote) {
        const representante = Storage.getUsuario();
        if (representante) {
            const dataBaseLocal = createDBLocal(name, representante);
            if (dataBaseLocal) {
                const localDB = new PouchDB(dataBaseLocal, {revs_limit: 1, auto_compaction: true});
                const dataBaseRemote = createDBRemote(dataBaseLocal);
                if (dataBaseRemote) {
                    const remoteDB = new PouchDB(dataBaseRemote, {skip_setup: true, ajax: {cache: false, timeout: 50000 }});
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
}

class basicDB {

    // 1 local, 2 local e remote
    constructor(name, remote = false) {
        this._name = name;
        this._remote = remote;
        this._lastId = null;
        create(this._name, this._remote, (localDB, remoteDB) => {
            this._localDB = localDB;
            this._remoteDB = remoteDB;
        });
    }

    _exists(array, value) {
        // return array.indexOf(value) >= 0 ? true : false;
        return _.findIndex(array, (object) => {
            return object == value
        }) >= 0 ? true : false;
    }

    _existsId(array, value) {
        return _.findIndex(array, (object) => {
            return object.id === value.id
        }) >= 0 ? true : false;
    }

    _limparBase() {
        return new Promise((resolve) => {
            this._localDB.destroy().then(() => {
                create(this._name, this._remote, (localDB, remoteDB) => {
                    this._localDB = localDB;
                    this._remoteDB = remoteDB;
                    resolve();
                });
            }).catch((err) => {
                // ErrorDB.criarLogDB({url:'db/basicDB',method:'_limparBase',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

    _salvar(value) {
        return new Promise((resolve, reject) => {
            value._id = _.toString(value.id ? value.id : value._id);
            this._localDB.put(value).then((result) => {
                resolve(_.toNumber(result.id));
            }).catch((erro) => {
                // ErrorDB.criarLogDB({url:'db/basicDB',method:'_salvar',message: erro,error:'Failed Request'});
                reject(erro);
            });
        });
    }

    _getById(id, rev = false) {
        return new Promise((resolve) => {
            this._localDB.get(_.toString(id)).then((result) => {
                if(!rev) delete result['_rev'];
                resolve({existe: true, value: result});  
            }).catch((error) => {
                // ErrorDB.criarLogDB({url:'db/basicDB',method:'_getById',message: error,error:'Failed Request'});
                resolve({existe: false, result: error});
            });
        });
    }

    _getAll() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((row) => {
                    if (row.doc['_id']) {
                        delete row.doc['_rev'];
                        return row.doc;
                    }
                }))
            }).catch((err) => {
                // ErrorDB.criarLogDB({url:'db/basicDB',method:'_getAll',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

    _getIds() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                resolve(resultDocs.rows.map((row) => row.id ));
            }).catch((err) => {
                // ErrorDB.criarLogDB({url:'db/basicDB',method:'_getAll',message: err,error:'Failed Request'});
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

    async _createIndex(index) {
        try {
            const result = await this._localDB.createIndex({
                index: {
                    fields: [index],
                    name: index +'_'+ this._name,
                    ddoc: '_'+index +'_'+ this._name,
                }
            });
            if (result.result !== "exists") console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    async _createIndexes(indices, indexName) {
        try {
            const result = await this._localDB.createIndex({
                index: {
                    fields: indices,
                    name: indexName +'_'+ this._name,
                    ddoc: '_'+indexName +'_'+ this._name,
                    type: 'json',
                }
            });
            if (result.result !== "exists") console.log(result);
        } catch (err) {
            console.log(err);
        }
    }
    
    _sincNuvem() {
        return new Promise((resolve) => {
            // this._localDB.replicate.to(this._remoteDB).then((result) => {
            //     if (result.ok) {
            //         this._localDB.replicate.from(this._remoteDB).then((result) => {
            //             if (result.ok) {
            //                 resolve();
            //             } else {
            //                 this.sincNuvem().then(() => {
            //                     resolve();
            //                 });
            //             }
            //         });
            //     } else {
            //         this.sincNuvem().then(() => {
            //             resolve();
            //         });
            //     }
            // });
            this._localDB.sync(this._remoteDB).then(() => {
                resolve();
             }).catch((err) => {
                 if (err.error === "not_found") {
                    this._remoteDB = new PouchDB(this._remoteDB.name);
                 } else {
                     resolve(err);
                 }
            });
        });
    }

}

export default basicDB;