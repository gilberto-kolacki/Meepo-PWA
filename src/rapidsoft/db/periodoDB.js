import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("periodo").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class periodoDB {

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    salvarSinc(periodos) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                if(periodos.length > 0) {
                    const done = _.after(periodos.length, () => resolve());
                    periodos.forEach(periodo => {
                        periodo._id = _.toString(periodo.id);
                        localDB.put(periodo).then(() => done()).catch(() => done());
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
                resolve(resultDocs.rows.map((periodo) => {
                    if (periodo.doc['nome']) {
                        delete periodo.doc['_rev'];
                        return _.clone(periodo.doc);
                    }
                }))
            }).catch((err) => {
                resolve(err);
            });
        });
    }

}

export default new periodoDB();