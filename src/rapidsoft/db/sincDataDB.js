import _ from 'lodash';
import BasicDB from './basicDB'

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBLiveFind from 'pouchdb-live-find';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBLiveFind);

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("sinc_data").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
            createSincs();
        }
    })
};

const sincDados =  [
    {
        _id:"10",
        type:"produto",
        titulo: "Produtos",
        methodo: "sincProduto",
        percent: 0,
        parcial: 0,
        total: 0,
        tempoSincronizacao: 0,
        dataSincronizacao: null
    },
    {
        _id:"11",
        type:"imagem",
        titulo: "Imagens",
        methodo: "sincImagem",
        percent: 0,
        parcial: 0,
        total: 0,
        tempoSincronizacao: 0,
        dataSincronizacao: null
    },
]

const createSincs = () => {
    localDB.bulkDocs(sincDados).then().catch((err) => {
        console.log(err);
    });
}

createDB();

class sincDataDB {

    findById(id) {
        return new Promise((resolve, reject) => {
            localDB.get(id).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    zerar(sincData) {
        sincData = _.clone(sincData);
        sincData.parcial = 0;
        sincData.percent = 0;
        sincData.ativo = false;
        return sincData;
    }

    getAll() {
        return new Promise((resolve) => {
            let sincDados = []
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resultDocs.rows.forEach(row => {
                    sincDados.push(this.zerar(row.doc))
                    if (_.last(resultDocs.rows) === row) resolve(sincDados);
                });
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    finalizaSinc(sinc) {
        return new Promise((resolve) => {
            sinc.tempoSincronizacao = _.round((Date.now() - sinc.inicio) / 1000, 1);
            sinc.dataSincronizacao = Date.now();
            localDB.put(sinc).then(() => {
                resolve(sinc);
            }).catch((erro) => {
                console.log(erro);
                resolve(sinc);
            });
            
            // this.findById(sinc._id).then((sincResult) => {
            //     console.log(sincResult);
            //     sinc.
                
            //     resolve();
            // })
        });
    }

}

export default new sincDataDB();