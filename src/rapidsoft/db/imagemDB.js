/*=========================================================================================
  File Name: imagemDB.js
  Description: Classe de banco responsavel pelas imagens
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import BasicDB from './basicDB'
import _ from 'lodash';
import PouchDB from 'pouchdb';


let nameFotoDB = "foto";
let nameCorDB = "cor";
let nameSeloDB = "selo";
let nameSimboloDB = "simbolo";

let imagemFotoDB = null;
let imagemCorDB = null;
let imagemSeloDB = null;
let imagemSimboloDB = null;

const createDB = (name) => {
    switch(name) {
        case nameFotoDB:
            BasicDB.createDBLocalBasic(name).then((dataBaseLocal) => {
                if (dataBaseLocal) {
                    imagemFotoDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
                }
            });
            break;
        
        case nameCorDB:
            BasicDB.createDBLocalBasic(name).then((dataBaseLocal) => {
                if (dataBaseLocal) {
                    imagemCorDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
                }
            });
            break;
        
        case nameSeloDB:
            BasicDB.createDBLocalBasic(name).then((dataBaseLocal) => {
                if (dataBaseLocal) {
                    imagemSeloDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
                }
            });
            break;
        
        case nameSimboloDB:
            BasicDB.createDBLocalBasic(name).then((dataBaseLocal) => {
                if (dataBaseLocal) {
                    imagemSimboloDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
                }
            });
            break;
    }
};

createDB(nameFotoDB);
createDB(nameCorDB);
createDB(nameSeloDB);
createDB(nameSimboloDB);

class imagemDB {

    salvar(imagem, localDB) {
        return new Promise((resolve) => {
            localDB.get(imagem._id).then((result) => {
                imagem._rev = result._rev;
                localDB.put(imagem).then(() => {
                    resolve();
                });
            }).catch((error) => {
                if (error.status === 404) {
                    localDB.put(imagem).then(() => {
                        resolve();
                    });
                } else {
                    console.log(error);
                    resolve();
                }
            });
        });
    }    

    listarFotos() {
        return new Promise((resolve, reject) => {
            let imagens = []
            imagemFotoDB.allDocs({include_docs: true}).then((result) => {
                for (let index = 0; index < result.rows.length; index++) {
                    imagens.push(_.cloneDeep(result.rows[index].doc));
                    if (index+1 == result.rows.length) {
                        resolve(imagens);
                    }
                }
            }).catch((erro) => {
                console.log(erro);
                reject(erro);
            });
        });
    }

    getImagemCor(id) {
        return new Promise((resolve) => {
            this.getById(id, imagemCorDB).then((cor) => {
                if (cor.existe) resolve(cor.result)
                else resolve(null)
            });
        });
    }

    getImagemFotos(codigosImagens) {
        return new Promise((resolve) => {
            let imagens = []
            codigosImagens.forEach(codigo => {
                imagemFotoDB.get(codigo).then((result) => {
                    console.log(result);
                    imagens.push(result)
                });
            });
            resolve(imagens);
        });
    }

    getById(id, localDB) {
        return new Promise((resolve) => {
            localDB.get(_.toString(id)).then((result) => {
                delete result['_rev'];
                resolve({existe: true, result: result});  
            }).catch((error) => {
                resolve({existe: false, result: error});
            });
        });
    }

    salvarFotos(fotos) {
        return new Promise((resolve) => {
            if (_.isArray(fotos) && fotos.length > 0) {
                const done = _.after(fotos.length, () => resolve(fotos.length));
                fotos.forEach(imagem => {
                    imagem._id = _.toString(imagem.id);
                    imagemFotoDB.put(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0)
            }
        })
    }

    salvarCores(cores) {
        return new Promise((resolve) => {
            if (_.isArray(cores) && cores.length > 0) {
                const done = _.after(cores.length, () => resolve(cores.length));
                cores.forEach(imagem => {
                    imagem._id = _.toString(imagem.id);
                    imagemCorDB.put(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0)
            }
        })
    }

    salvarSelos(selos) {
        return new Promise((resolve) => {
            if (_.isArray(selos) && selos.length > 0) {
                const done = _.after(selos.length, () => resolve(selos.length));
                selos.forEach(imagem => {
                    imagem._id = _.toString(imagem.id);
                    imagemSeloDB.put(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0);
            }
        })
    }

    salvarSimbolos(simbolos) {
        return new Promise((resolve) => {
            if (_.isArray(simbolos) && simbolos.length > 0) {
                const done = _.after(simbolos.length, () => resolve(simbolos.length));
                simbolos.forEach(imagem => {
                    imagem._id = _.toString(imagem.id);
                    imagemSimboloDB.put(imagem).then(() => done()).catch(() => done());
                });
            } else {
                resolve(0)
            }
        })
    }       

    // downloadSelo(cor) {
    
    // }

    // downloadSimbolo(cor) {
    
    // }
    

    limparBase() {
        return new Promise((resolve) => {
            imagemFotoDB.destroy().then(() => {
                createDB(nameFotoDB);
                imagemCorDB.destroy().then(() => {
                    createDB(nameCorDB);
                    imagemSeloDB.destroy().then(() => {
                        createDB(nameSeloDB);
                        imagemSimboloDB.destroy().then(() => {
                            createDB(nameSimboloDB);
                            resolve();
                        });
                    });
                });
            });
        });
    }

    getCorById(cor) {
        return new Promise((resolve) => {
            if (cor.idCor && cor.idCor > 0) {
                this.getById(cor.idCor, imagemCorDB).then((corProduto) => {
                    if(corProduto.existe) {
                        resolve(corProduto.result.base64);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        })
    }

    getFotoById(idFoto) {
        return new Promise((resolve) => {
            if (idFoto > 0) {
                this.getById(idFoto, imagemFotoDB).then((fotoProduto) => {
                    if(fotoProduto.existe) {
                        resolve(fotoProduto.result.base64);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        })
    }

    existFoto(idFoto) {
        this.getById(idFoto, imagemFotoDB).then((fotoProduto) => {
            if(fotoProduto.existe) {
                return true;
            } else {
                return false;
            }
        });
    }

    getSelos(cor) {
        return new Promise((resolve) => {
            resolve([]);
        });
    }

    getSimbolos(cor) {
        return new Promise((resolve) => {
            resolve([]);
        });
    }

    getFotosProduto(cor) {
        return new Promise((resolve) => {
            if (cor.imagens && cor.imagens.length > 0) {
                cor.imagens.forEach(imagem => {
                    this.getById(imagem.id, imagemFotoDB).then((fotoProduto) => {
                        if(fotoProduto.existe) {
                            imagem.base64 = fotoProduto.result.base64
                            if(_.last(cor.imagens) === imagem) {
                                resolve(cor.imagens)
                            }
                        } else {
                            imagem.base64 = null
                            if(_.last(cor.imagens) === imagem) {
                                resolve(cor.imagens)
                            }
                        }
                    });
                });
            } else {
                resolve(cor.imagens);
            }
        });
    }

    getFotoPrincipal(produto) {
        return new Promise((resolve) => {
            console.log(produto)
            if (produto.cores[0].imagens.length > 0) {
                this.getById(_.orderBy(produto.cores[0].imagens, ['seq'])[0].id, imagemFotoDB).then((fotoProduto) => {
                    if(fotoProduto.existe) {
                        resolve(fotoProduto.result.base64);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });
    }

}

export default new imagemDB();