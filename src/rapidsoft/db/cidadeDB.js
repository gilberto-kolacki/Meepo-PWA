/*=========================================================================================
  File Name: cidadeDB.js
  Description: Classe de banco de cidades
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import IsNil from 'lodash/isNil';
import FlattenDeep from 'lodash/flattenDeep';
import Clone from 'lodash/clone';
import BasicDB from './basicDB';

class cidadeDB extends BasicDB {

    constructor() {
        super("cidade");
        this.indexes = ['uf', 'rel'];
        this._createIndexes(this.indexes, 'estado_relacionado');
        this._createIndex('rel');
    }

    criaCidades(estado) {
        return new Promise((resolve) => {
            const cidades = estado.cidades.filter((cidade) => !IsNil(cidade)).map(cidade => {
                const cidadeNew = cidade;
                cidadeNew._id = String(cidadeNew.id);
                cidadeNew.uf = estado.uf;
                cidadeNew.estado = estado.nome;
                cidadeNew.idCidade = cidade.id;

                delete cidadeNew.id;
                delete cidadeNew.ceps;
                return cidadeNew;
            });
            resolve(cidades);
        });
    }

    criaCeps(estado) {
        return new Promise((resolve) => {
            let cidades = FlattenDeep(estado.cidades.map(cidade => {
                console.log(cidade);
                
                if (cidade.ceps.length > 0) {
                    return cidade.ceps.map(cep => {
                        let cidadeNew = Clone(cidade);
                        if (!IsNil(cidadeNew)) {
                            cidadeNew._id = cep.c;
                            cidadeNew.cep = cep.c;
                            cidadeNew.bairro = cep.b;
                            cidadeNew.endereco = cep.e;
                            cidadeNew.uf = estado.uf;
                            cidadeNew.estado = estado.nome;
    
                            delete cidadeNew.id;
                            delete cidadeNew.ceps;
                            return cidadeNew;
                        } else return {};
                    });
                } else return [];
            }));
            resolve(cidades);
        });
    }

    salvarSinc(cidades) {
        return new Promise((resolve, reject) => {
            this._localDB.bulkDocs(cidades).then(() => {
                resolve();
            }).catch((error) => {
                this._criarLogDB({url:'db/cidadeDB',method:'salvarSinc',message: error,error:'Failed Request'});
                reject(error);
            });
        });
    }

    getCidadeByIds(idsCidades) {
        return new Promise((resolve) => {
            this._getFindCondition({idCidade : {$in : idsCidades}}).then((cidades) => {
                resolve(cidades);
            });
        });
    }

    buscaCidade(idCidade) {
        return new Promise((resolve) => {
            idCidade = String(idCidade);
            this._localDB.get(idCidade).then((result) => {
                delete result._rev;
                resolve({existe: true, result: result});  
            }).catch((error) => {
                this._criarLogDB({url:'db/cidadeDB',method:'buscaCidade',message: error,error:'Failed Request'});
                resolve({existe: false, result: error});
            });
        });
    }

    salvar(estado) {
        return new Promise((resolve) => {
            this.criaCidades(estado).then(cidades => {
                if(cidades.length > 0) {
                    this._localDB.bulkDocs(cidades).then(() => {
                        resolve();
                    }).catch((error) => {
                        this._criarLogDB({url:'db/cidadeDB',method:'salvar.bulkDocs',message: error,error:'Failed Request'});
                        resolve(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    // getCidadesFromEstado(estado) {
    //     console.log(estado);
        
    //     return new Promise((resolve) => {
    //         this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
    //             const cidadesEstado = resultDocs.rows.filter((cidade) => cidade.doc.uf === estado).map((cidade) => {
    //                 delete cidade.doc['_rev'];
    //                 return cidade.doc;
    //             });
    //             resolve(cidadesEstado);
    //         }).catch((err) => {
    //             this._criarLogDB({url:'db/cidadeDB',method:'getCidadesFromEstado',message: err,error:'Failed Request'})
    //             resolve(err);
    //         });
    //     });
    // }

    getCidadesFromEstado(estado) {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {'uf': {$eq: estado}},
                fields: ['idCidade', 'nome'],
            }).then((result) => {
                resolve(result.docs);
            });
        });
    }

    getCidadesRelacionadas() {
        return new Promise((resolve) => {
            this._getFindCondition({rel : {$eq : 1}}).then((cidades) => {
                resolve(cidades);
            });
        });
    }

    getEstados() {
        return new Promise((resolve) => {
            const estados = [
                {id: 1, nome: "Acre", sigla: "AC"},
                {id: 2, nome: "Alagoas", sigla: "AL"},
                {id: 3, nome: "Amapá", sigla: "AP"},
                {id: 4, nome: "Amazonas", sigla: "AM"},
                {id: 5, nome: "Bahia", sigla: "BA"},
                {id: 6, nome: "Ceará", sigla: "CE"},
                {id: 7, nome: "Distrito Federal", sigla: "DF"},
                {id: 8, nome: "Espírito Santo", sigla: "ES"},
                {id: 9, nome: "Goiás", sigla: "GO"},
                {id: 10, nome: "Maranhão", sigla: "MA"},
                {id: 11, nome: "Mato Grosso", sigla: "MT"},
                {id: 12, nome: "Mato Grosso do Sul", sigla: "MS"},
                {id: 13, nome: "Minas Gerais", sigla: "MG"},
                {id: 14, nome: "Pará", sigla: "PA"},
                {id: 15, nome: "Paraíba", sigla: "PB"},
                {id: 16, nome: "Paraná", sigla: "PR"},
                {id: 17, nome: "Pernambuco", sigla: "PE"},
                {id: 18, nome: "Piauí", sigla: "PI"},
                {id: 19, nome: "Rio de Janeiro", sigla: "RJ"},
                {id: 20, nome: "Rio Grande do Norte", sigla: "RN"},
                {id: 21, nome: "Rio Grande do Sul", sigla: "RS"},
                {id: 22, nome: "Rondônia", sigla: "RO"},
                {id: 23, nome: "Roraima", sigla: "RR"},
                {id: 24, nome: "Santa Catarina", sigla: "SC"},
                {id: 25, nome: "São Paulo", sigla: "SP"},
                {id: 26, nome: "Sergipe", sigla: "SE"},
                {id: 27, nome: "Tocantins", sigla: "TO"}
            ];
            resolve(estados);
        });            
    }
    

}

export default new cidadeDB();