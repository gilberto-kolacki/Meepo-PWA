import PouchDB from 'pouchdb';
import _ from 'lodash';
import store from '../../store/store'
import BasicDB from './basicDB'

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("segmento").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class segmentoDB {

    salva(segmentos) {
        return new Promise((resolve) => {
            segmentos.forEach(segmento => {
                segmento._id = _.toString(segmento.id);
                localDB.put(_.clone(segmento)).then(() => {
                    resolve();
                }).catch((erro) => {
                    console.log(erro);
                    resolve();
                });
            });
        });
    }

    getAll() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((segmento) => {
                    delete segmento.doc['_rev'];
                    return _.clone(segmento.doc);
                }))
            }).catch((err) => {
                console.log(err);
                resolve(err);
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
export default new segmentoDB();