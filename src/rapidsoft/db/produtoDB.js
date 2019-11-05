/*=========================================================================================
  File Name: produtoDB.js
  Description: Classe de banco de Produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'
import imagemDB from './imagemDB'

import PouchDB from 'pouchdb';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("produto").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

const getProdutoToDBFilterCategoria = (rows, idsCategorias, textoSearch) => {
    textoSearch = _.toUpper(textoSearch);
    return rows.map((row) => { 
        return _.clone(row.doc)
    }).filter((produto) => {
        return textoSearch === null || textoSearch === "" || _.toUpper(produto.referencia).includes(textoSearch) || produto.nome.includes(textoSearch);
    }).filter((produto) => {
        return idsCategorias.length === 0 || produto.cores.some((cor) => {
            return cor.categorias.some((categoria) => {
                return idsCategorias.some((idCategoria) => {
                    return categoria === idCategoria
                });
            });
        });
    })
}

const getProdutoToDB = (rows) => {
    return rows.filter((produto) => {
        return produto.doc['referencia'];
    }).map((row) => { return _.clone(row.doc)});
}

class produtoDB {

    getAllProdutos() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(getProdutoToDB(resultDocs.rows))
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    getAllProdutosByCategorias(categorias) {
        return new Promise((resolve) => {
            const idCategorias = categorias.filter((categoria) => {return categoria.check}).map((categoria) => { return categoria.id});
            if (idCategorias.length > 0) {
                localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    resolve(getProdutoToDBFilterCategoria(resultDocs.rows, idCategorias))
                }).catch((err) => {
                    console.log(err);
                    resolve(err);
                });
            } else {
                resolve([]);
            }
        });
    }

    getAllProdutosByIdCategorias(idCategorias, textoSearch) {
        return new Promise((resolve) => {
            if (idCategorias.length > 0 || textoSearch.length > 0) {
                localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    resolve(getProdutoToDBFilterCategoria(resultDocs.rows, idCategorias, textoSearch))
                }).catch((err) => {
                    console.log(err);
                    resolve(err);
                });
            } else {
                resolve([]);
            }
        });
    }

    getProdutosCatalogo() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(produtos);
            });
        });
    }

    // filtrarProdutosPesquisa(produtos) {
    //     return this.produtos.filter((produto) => {
    //         return this.getCategoriasCardPesquisa.some((categoria) => {
    //             return categoria.check && produto.hasOwnProperty('categoria') && produto.categoria.hasOwnProperty('codigo') && produto.categoria.codigo == categoria.codigo;
    //         });
    //     });
    // }

    getProdutosSearch(categorias) {
        return new Promise((resolve) => {
            this.getAllProdutosByCategorias(categorias).then((produtos) => {
                produtos = _.take(produtos, 50);
                if(produtos.length > 0) {
                    produtos.forEach(produto => {
                        if(produto.cores.length > 0) {
                            imagemDB.getFotoPrincipal(produto).then((result) => {
                                produto.imagemPrincipal = result;
                                if (_.last(produtos) === produto) resolve(produtos);
                            })
                        } else {
                            if (_.last(produtos) === produto) resolve(produtos);
                        }
                    });
                }
            });
        });
    }

    getProdutosSearch2(categorias, textoSearch) {
        return new Promise((resolve) => {
            this.getAllProdutosByIdCategorias(categorias, textoSearch).then((produtos) => {
                if(produtos.length > 0) {
                    const done = _.after(produtos.length, () => resolve(produtos));
                    produtos.forEach(produto => {
                        if(produto.cores.length > 0) {
                            imagemDB.getFotoPrincipal(produto).then((result) => {
                                produto.imagemPrincipal = result;
                                done();
                            })
                        } else {
                            done();
                        }
                    });
                }
            });
        });
    }

    getImagensProduto(produto) {
        return new Promise((resolve) => {
            if(produto.cores.length > 0) {
                produto.cores.forEach(cor => {
                    imagemDB.getCorById(cor).then((resultImagemCor) => {
                        cor.imagemCor = resultImagemCor
                        imagemDB.getSelos(cor).then((resultSelos) => {
                            cor.selos = resultSelos
                            imagemDB.getSimbolos(cor).then((resultSimbolos) => {
                                cor.simbolos = resultSimbolos
                                imagemDB.getFotosProduto(cor).then((resultFotos) => {
                                    cor.imagens = _.orderBy(resultFotos, ['seq'], ['asc']);
                                    if (_.last(produto.cores) === cor) resolve(produto);
                                });
                            });
                        });
                    });
                });
            } else {
                resolve(produto);
            }
        });
    }

    salvar(produto) {
        return new Promise((resolve) => {
            produto._id = produto.referencia;
            localDB.put(produto).then(() => {
                resolve();
            });
        });
    }

    //demorado no ipad
    salvarLista(produtos) {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                produtos.forEach(produto => {
                    produto._id = produto.referencia;
                    if (_.last(produtos) === produto) {
                        localDB.bulkDocs(produtos).then((result) => {
                            resolve(result.length);
                        });
                    }
                });        
            });
        });
    }    

    getIdsFotos() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(_.flattenDeep(produtos.map((produto) => {
                    let cores = _.clone(produto['cores']);
                    return cores.map((cor) => {
                        return cor.imagens.map((imagem) => {
                            return imagem.id;
                        })
                    });
                })));
            });
        });
    }

    getIdsCores() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(_.flattenDeep(produtos.map((produto) => {
                    let cores = _.clone(produto['cores']);
                    return cores.map((cor) => {
                        if(cor != undefined && cor.idCor) return cor.idCor;
                    });
                })));
            });
        });
    }

    getIdsSelos() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(_.flattenDeep(produtos.map((produto) => {
                    let cores = _.clone(produto['cores']);
                    return cores.map((cor) => {
                        if(cor != undefined && _.isArray(cor.selos)) return cor.selos;
                    })
                })));
            })
        });
    }

    getIdsSimbolos() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(_.flattenDeep(produtos.map((produto) => {
                    let cores = _.clone(produto['cores']);
                    return cores.map((cor) => {
                        if(cor != undefined && _.isArray(cor.simbolos)) return cor.simbolos;
                    })
                })));
            })
        });
    }

    getIdsImagens() {
        return new Promise((resolve) => {
            const dataResult = {fotos:[], selos:[], simbolos:[], cores:[]};
            this.getIdsFotos().then((idsImagens) => {
                dataResult.fotos = _.uniq(idsImagens);
                this.getIdsCores().then((idsCores) => {
                    dataResult.cores = _.uniq(idsCores);
                    this.getIdsSelos().then((idsSelos) => {
                        dataResult.selos = _.uniq(idsSelos);
                        this.getIdsSimbolos().then((idsSimbolos) => {
                            dataResult.simbolos = _.uniq(idsSimbolos);
                            console.log(dataResult);
                            
                            const qtdeImagens = dataResult.fotos.length + dataResult.cores.length + dataResult.selos.length + dataResult.simbolos.length;
                            resolve({quantidade: qtdeImagens, data: dataResult});
                        })
                    })
                })
            })
        });
    }

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                createDB();
                resolve();
            }).catch((err) => {
                resolve(err);
            });
        });
    }

}

export default new produtoDB();