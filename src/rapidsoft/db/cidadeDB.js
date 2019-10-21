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

    salvar(estado) {
        return new Promise((resolve) => {
            estado.cidades.forEach(cidade => {
                if (cidade.ceps.length > 0) {
                    cidade.ceps.forEach(cep => {
                        let cidadeNew = _.clone(cidade);
                        cidadeNew._id = cep.c;
                        cidadeNew.cep = cep.c;
                        cidadeNew.bairro = cep.b;
                        cidadeNew.endereco = cep.e;
                        cidadeNew.uf = estado.uf;
                        cidadeNew.estado = estado.nome;
                        cidadeNew.idCidade = cidade.id;
    
                        delete cidadeNew["id"];
                        delete cidadeNew["ceps"];
                        localDB.put(cidadeNew).then(() => {
                            if (_.last(estado.cidades) == cidade && _.last(cidade.ceps) == cep) resolve();
                        }).catch(() => {
                            console.log(cidadeNew);
                            if (_.last(estado.cidades) == cidade && _.last(cidade.ceps) == cep) resolve();
                        });
                    });
                } else {
                    if (_.last(estado.cidades) == cidade) resolve();
                }
            });
        });
    }

    getCidades() {
    }
    

}

export default new cidadeDB();