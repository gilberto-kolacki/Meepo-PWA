import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("categoria").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class categoriaDB {

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    salvarSinc(categorias) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(categorias.length > 0) {
                    const done = _.after(categorias.length, () => resolve());
                    categorias.forEach(categoria => {
                        categoria._id = _.toString(categoria.id);
                        localDB.put(categoria).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    getAll() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((grupo) => {
                    if (grupo.doc['nome']) {
                        delete grupo.doc['_rev'];
                        return _.clone(grupo.doc);
                    }
                }))
            }).catch((err) => {
                resolve(err);
            });
        });
    }

}

export default new categoriaDB();