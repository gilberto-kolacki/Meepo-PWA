import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocal("grupo_cliente").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 1, auto_compaction: true});
        }
    })
};

createDB();

class grupoClienteDB {

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    salvar(grupoCliente) {
        return new Promise((resolve) => {
            grupoCliente._id = _.toString(grupoCliente.id);
            localDB.put(grupoCliente).then(() => {
                resolve();
            });
        });
    }

    getAll() {
        return new Promise((resolve) => {
            let grupos = []
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resultDocs.rows.forEach(row => {
                    if (row.doc['nome']) {
                        let grupo = _.clone(row.doc);
                        delete grupo['_rev'];
                        grupos.push(grupo)
                        if (_.last(resultDocs.rows) === row) resolve(grupos);
                    } else {
                        if (_.last(resultDocs.rows) === row) resolve(grupos);
                    }
                });
            }).catch((err) => {
                resolve(err);
            });
        });
    }

}

export default new grupoClienteDB();