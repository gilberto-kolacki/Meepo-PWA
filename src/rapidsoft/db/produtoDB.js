/*=========================================================================================
  File Name: produtoDB.js
  Description: Classe de banco de Produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import arrayMove from 'array-move';
import BasicDB from './basicDB'
import ImagemDB from './imagemDB'
import CatalogoDB from './catalogoDB'

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

    getProdutosCatalogo(idCatalogo) {
        return new Promise((resolve) => {
            CatalogoDB.getById(idCatalogo).then((catalogo) =>{
                this.getProdutosFromPaginas(_.orderBy(catalogo.paginas, ['pag'], ['asc'])).then((produtos) => {
                    resolve(produtos);
                })
            })
        });
    }

    getProdutosFromPaginas(paginas) {
        return new Promise((resolve) => {
            const paginasProdutos = paginas.map((pagina) => {
                const prodOrderSeq = _.orderBy(pagina.produtos, ['seq']);
                delete pagina['produtos'];
                pagina.produtoA = prodOrderSeq[0];
                if (prodOrderSeq[1]) {
                    pagina.produtoB = prodOrderSeq[1];
                }
                if (prodOrderSeq[2]) {
                    pagina.produtoC = prodOrderSeq[2];
                }
                if (prodOrderSeq[3]) {
                    pagina.produtoD = prodOrderSeq[3];
                }
                return pagina;
            })
            resolve(paginasProdutos);
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            localDB.get(_.toString(id)).then((result) => {
                delete result['_rev'];
                resolve({existe: true, result: result});  
            }).catch((error) => {
                resolve({existe: false, result: error});
            });
        });
    }
    

    getByProdPagina(pagina) {
        return new Promise((resolve) => {
            if (pagina && pagina.ref) {
                this.getById(pagina.ref).then((resultProduto) => {
                    if (resultProduto.existe && resultProduto.result.cores && resultProduto.result.cores.length > 0) {                        
                        resultProduto.result.cores = arrayMove(resultProduto.result.cores, _.findIndex(resultProduto.result.cores, (cor) => { return cor.idProduto == pagina.id }), 0);
                        resolve(resultProduto.result)    
                    } else {
                        resolve(null)        
                    }
                })
            } else {
                resolve(null)
            }
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
                            ImagemDB.getFotoPrincipal(produto).then((result) => {
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
                            ImagemDB.getFotoPrincipal(produto).then((result) => {
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
            if(produto && produto.cores && produto.cores.length > 0) {
                const done = _.after(produto.cores.length, () => resolve(produto));
                produto.cores.forEach(cor => {
                    ImagemDB.getCorById(cor).then((resultImagemCor) => {
                        cor.imagemCor = resultImagemCor
                        ImagemDB.getSelos(cor).then((resultSelos) => {
                            cor.selos = resultSelos
                            ImagemDB.getSimbolos(cor).then((resultSimbolos) => {
                                cor.simbolos = resultSimbolos
                                ImagemDB.getFotosProduto(cor).then((resultFotos) => {
                                    cor.imagens = _.orderBy(resultFotos, ['seq'], ['asc']);
                                    done();
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

    getProdutoPagina(pagina) {
        return new Promise((resolve) => {
            console.log("pagina", pagina);
            this.getProdutos(pagina).then((itemProduto) => {                
                this.getImagens(itemProduto).then((resultImagem) => {
                    console.log(resultImagem)
                    resolve(resultImagem);
                })
            });
        });
    }

    getImagens(item) {
        return new Promise((resolve) => {
            this.getImagensProduto(item.produtoA).then((produtoA) => {
                item.produtoA = produtoA;
                resolve(item);
            })
        });
    }

    getProdutos(pagina) {
        return new Promise((resolve) => {
            let item = {};
            this.getByProdPagina(pagina.produtoA).then((resultProdutoA) => {
                item.produtoA = resultProdutoA;
                this.getByProdPagina(pagina.produtoB).then((resultProdutoB) => {
                    if (resultProdutoB != null) {
                        item.produtoB = resultProdutoB;
                    }
                    this.getByProdPagina(pagina.produtoC).then((resultProdutoC) => {
                        if (resultProdutoC != null) {
                            item.produtoC = resultProdutoC;
                        }
                        this.getByProdPagina(pagina.produtoD).then((resultProdutoD) => {
                            if (resultProdutoD != null) {
                                item.produtoD = resultProdutoD;
                            }
                            if (item.produtoA == null && item.produtoB != null) {
                                item.produtoA = item.produtoB;
                                item.produtoB = null;
                            }
                            resolve(item)
                        });
                    });
                });
            });
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