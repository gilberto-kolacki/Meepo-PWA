/*=========================================================================================
  File Name: cidadeDB.js
  Description: Classe de banco de cidades
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("cidade").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class cidadeDB {

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                resolve(createDB());
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    criaCidades(estado) {
        return new Promise((resolve) => {
            let cidades = _.flattenDeep(estado.cidades.map(cidade => {
                let cidadeNew = _.clone(cidade);
                if (_.isNil(cidadeNew)) return {};
                else {
                    cidadeNew._id = _.toString(cidadeNew.id);
                    cidadeNew.uf = estado.uf;
                    cidadeNew.estado = estado.nome;
                    cidadeNew.idCidade = cidade.id;

                    delete cidadeNew["id"];
                    delete cidadeNew["ceps"];
                    return cidadeNew;
                }
            }));
            resolve(cidades);
        });
    }

    criaCeps(estado) {
        return new Promise((resolve) => {
            let cidades = _.flattenDeep(estado.cidades.map(cidade => {
                console.log(cidade);
                
                if (cidade.ceps.length > 0) {
                    return cidade.ceps.map(cep => {
                        let cidadeNew = _.clone(cidade);
                        if (!_.isNil(cidadeNew)) {
                            cidadeNew._id = cep.c;
                            cidadeNew.cep = cep.c;
                            cidadeNew.bairro = cep.b;
                            cidadeNew.endereco = cep.e;
                            cidadeNew.uf = estado.uf;
                            cidadeNew.estado = estado.nome;
    
                            delete cidadeNew["id"];
                            delete cidadeNew["ceps"];
                            return cidadeNew;
                        } else return {};
                    })
                } else return [];
            }));
            resolve(cidades);
        });
    }

    salvarSinc(cidades) {
        return new Promise((resolve) => {
            localDB.bulkDocs(cidades).then(() => {
                resolve();
            }).catch((error) => {
                console.log(error);
                resolve();
            });
        });
    }

    buscaCidade(idCidade) {
        return new Promise((resolve) => {
            idCidade = _.toString(idCidade);
            localDB.get(idCidade).then((result) => {
                delete result['_rev'];
                resolve({existe: true, result: result});  
            }).catch((error) => {
                resolve({existe: false, result: error});
            });
        });
    }

    salvar(estado) {
        return new Promise((resolve) => {
            this.criaCidades(estado).then(cidades => {
                if(cidades.length > 0) {
                    const done = _.after(cidades.length, () => resolve());
                    cidades.forEach(cidade => {
                        localDB.put(cidade).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    getAll() {
        return new Promise((resolve) => {
            // localDB.allDocs({include_docs: true}).then((resultDocs) => {
            //     resolve(resultDocs.rows.map((cidade) => {
            //         console.log(cidade);
                    
            //         delete cidade.doc['_rev'];
            //         return _.clone(cidade.doc);
            //     }))
            // }).catch((err) => {
            //     console.log(err);
            //     resolve(err);
            // });

            localDB.allDocs(function(err, docs) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log (docs.rows);
                }
                resolve(docs.rows);
            })
        });
    }

    getCidades() {
    }
    

}

export default new cidadeDB();