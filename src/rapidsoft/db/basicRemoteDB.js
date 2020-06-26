/*=========================================================================================
  File Name: basicDB.js
  Description: Classe Default de banco 
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import BasicDB from './basicDB';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import Config from '../../../public/config.json';

PouchDB.plugin(PouchDBFind);

const setTimeout = (delay) => {
    if (delay === 0) delay = 1000;
    else delay = delay * 2;
    return delay;
};

const options = {
    live: true,
    retry: true,
    continuous: true,
    back_off_function: (delay) => setTimeout(delay),
};

const getRepres = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
};

const createDBLocal = (dataBaseName, representante) => {
    return "meepo_"+Config.empresa+"_rep_"+representante.id+"_"+dataBaseName;
};

const createDBRemote = (dataBaselocal) => {
    return Config.endereco_couchdb+dataBaselocal;
};

// const OnChange = (change) => {
//     if (change.doc.language !== "query") {
//         console.log('change users', change);
//     }
// };

const Sync = (localDB, remoteLink) => {
    localDB.sync(remoteLink, options)
        .on('change', function (info){
            console.log(info);
            //localStorage.setItem('syncChangeInfo',  [localStorage.getItem('syncChangeInfo'), info]);
        }).on('paused', function (err) {
            console.log(err);
            //localStorage.setItem('syncPausedInfo', [localStorage.getItem('syncPausedInfo'), err]);
        }).on('active', function () {
            console.log('active');
            //localStorage.setItem('syncActiveInfo', [localStorage.getItem('syncActiveInfo'), 'active']);
        }).on('complete', function (info) {
            console.log(info);
            //localStorage.setItem('syncCompleteInfo',  [localStorage.getItem('syncCompleteInfo'), info]);
        }).on('deneid', function (err) {
            console.log('deneid',err);
            //localStorage.setItem('syncErrorInfo', [localStorage.getItem('syncErrorInfo'), err]);
        }).on('error', function (err) {
            console.log('Erro',err);
            //localStorage.setItem('syncErrorInfo', [localStorage.getItem('syncErrorInfo'), err]);
        });
};

const create = (name, callback) => {
    const representante = getRepres();
    if (representante) {
        const dataBaseLocal = createDBLocal(name, representante);
        if (dataBaseLocal) {
            const localDB = new PouchDB(dataBaseLocal, {auto_compaction: true, cache : false});
            const dataBaseLink = createDBRemote(dataBaseLocal);
            if (dataBaseLink) {
                Sync(localDB, dataBaseLink);
                callback(localDB, dataBaseLink);
            }
        }
    }
};

class basicRemoteDB extends BasicDB {

    constructor(name) {
        super(name, true);
        this.createBases();
    }

    createBases() {
        create(this._name, (localDB, remoteLink) => {
            this._localDB = localDB;
            this._remoteLink = remoteLink;
            this._createIndex('id');
            this._createIndex('alterado');
            this._createErrorDB(() => {                                
                this._localDB.viewCleanup();
            });
        });
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

    
    

}
export default basicRemoteDB;