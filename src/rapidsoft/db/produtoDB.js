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
import EmbarqueDB from './embarqueDB';
import ErrorDB from './errorDB';

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
        return produto.doc['referencia'] ;
    }).map((row) => row.doc);
}

const getCoresAtivas = (cores) => {
    return cores.filter((cor) => {
        return cor.ativo;
    });
}

class produtoDB extends BasicDB {

    constructor() {
        super("produto");
    }

    getAllProdutos() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(getProdutoToDB(resultDocs.rows))
            }).catch((err) => {
                ErrorDB.criarLogDB({url:'db/produtoDB',method:'getAllProdutos',message: err,error:'Failed Request'})
                resolve(err);
            });
        });
    }

    getAllProdutosByCategorias(categorias) {
        return new Promise((resolve) => {
            const idCategorias = categorias.filter((categoria) => {return categoria.check}).map((categoria) => { return categoria.id});
            if (idCategorias.length > 0) {
                this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    resolve(getProdutoToDBFilterCategoria(resultDocs.rows, idCategorias))
                }).catch((err) => {
                    ErrorDB.criarLogDB({url:'db/produtoDB',method:'getAllProdutosByCategorias',message: err,error:'Failed Request'})
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
                this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    resolve(getProdutoToDBFilterCategoria(resultDocs.rows, idCategorias, textoSearch))
                }).catch((err) => {
                    ErrorDB.criarLogDB({url:'db/produtoDB',method:'getAllProdutosByIdCategorias',message: err,error:'Failed Request'})
                    resolve(err);
                });
            } else {
                resolve([]);
            }
        });
    }

    getTamanhosProdutoCarrinho(tamanhos, carrinho) {
        return new Promise((resolve) => {
            const tamanhoResult = [];
            const done = _.after(tamanhos.length, () => resolve(tamanhoResult));

            tamanhos.forEach(tamanho => {
                const itemQuantidade = _.find(carrinho.itens, (item) => item.id === tamanho.id);
                tamanho.quantidade = itemQuantidade ? itemQuantidade.quantidade : 0;
                tamanhoResult.push(tamanho);
                done();
            });
        });   
    }

    getTotalCor(tamanhos, carrinho) {
        return new Promise((resolve) => {
            let totalCor = 0;   
            const done = _.after(tamanhos.length, () => resolve(totalCor));
            
            tamanhos.forEach(tamanho => {
                const itemQuantidade = _.find(carrinho.itens, (item) => item.id === tamanho.id);
                totalCor = totalCor + (itemQuantidade ? itemQuantidade.quantidade : 0);
                done();
            });
        });
    }

    getProdutoFromCarrinho(produto, carrinho) {
        return new Promise((resolve) => {
            const produtoCores = [];
            const done = _.after(produto.cores.length, () => resolve(produtoCores));
            
            produto.cores.forEach(cor => {
                const produtoCor = _.clone(produto);
                produtoCor.cor = _.clone(cor);
                this.getTotalCor(produtoCor.cor.tamanhos, carrinho).then((totalCor) => {
                    produtoCor.cor.quantidade = totalCor;
                    if (produtoCor.cor.quantidade > 0) {
                        this.getTamanhosProdutoCarrinho(produtoCor.cor.tamanhos, carrinho).then((tamanhos) => {
                            produtoCor.cor.tamanhos = tamanhos;
                            const imagemPrincipal = _.orderBy(produtoCor.cor.imagens, ['seq'])[0];
                            ImagemDB.getFotoById(imagemPrincipal.id).then(imagem => {
                                produtoCor.imagemPrincipal = imagem;
                                EmbarqueDB.getEmbarqueProduto(produtoCor).then((embarque) => {
                                    produtoCor.embarque = embarque;
                                    produtoCor.segmento = produtoCor.segmento[0];
                                    delete produtoCor['cores'];
                                    delete produtoCor['video'];
                                    delete produtoCor['_rev'];
                                    delete produtoCor.cor['selos'];
                                    delete produtoCor.cor['simbolos'];
                                    delete produtoCor.cor['produtosLook'];
                                    delete produtoCor.cor['prontaEntrega'];
                                    delete produtoCor.cor['imagens'];
                                    produtoCores.push(produtoCor);
                                    done();
                                });
                            });                
                        });
                    } else {
                        done();
                    }
                });
            });
        });        
    }

    getProdutosFromCarrinho(carrinho) {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                const produtosCor = [];
                const produtos = resultDocs.rows.filter((produto) => _.findIndex(carrinho.itens, (item) => item.ref === produto.id ) >= 0 ).map((row) => row.doc);
                const done = _.after(produtos.length, () => resolve(_.flattenDeep(produtosCor)));                
                produtos.forEach(produto => {
                    produto.cores = _.filter(produto.cores, (cor) => _.findIndex(carrinho.itens, (item) => item.cor === cor.idCor) >= 0 );
                    this.getProdutoFromCarrinho(produto, carrinho).then((produtoCor) => {
                        produtosCor.push(produtoCor);
                        done();
                    });
                });
            }).catch((err) => {
                ErrorDB.criarLogDB({url:'db/produtoDB',method:'getProdutosFromCarrinho',message: err,error:'Failed Request'})
                resolve(err);
            });
        });
    }

    getPaginasCatalogo(idCatalogo) {
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
            });
            resolve(paginasProdutos);
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            this._localDB.get(_.toString(id)).then((result) => {
                delete result['_rev'];
                resolve({existe: true, result: result});  
            }).catch((error) => {
                ErrorDB.criarLogDB({url:'db/produtoDB',method:'getById',message: error,error:'Failed Request'})
                resolve({existe: false, result: error});
            });
        });
    }
    

    getByProdPaginaCatalogo(pagina) {
        return new Promise((resolve) => {
            if (pagina && (pagina.ref || pagina.referencia)) {
                this.getById(pagina.ref || pagina.referencia).then((resultProduto) => {
                    if (resultProduto.existe && resultProduto.result.cores && resultProduto.result.cores.length > 0) {                        
                        resultProduto.result.cores = _.filter(resultProduto.result.cores, (cor) => { return cor.prontaEntrega === false });
                        resultProduto.result.cores = arrayMove(resultProduto.result.cores, _.findIndex(resultProduto.result.cores, (cor) => { return cor.idProduto == pagina.id }), 0);
                        resultProduto.result.segmento = resultProduto.result.segmento[0];
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

    possuiCores(produto) {
        return produto && produto.cores && produto.cores.length > 0 && _.isObject(produto.cores[0]);
    }

    getImagensCorProduto(produto) {
        return new Promise((resolve) => {
            if(this.possuiCores(produto)) {
                const done = _.after(produto.cores.length, () => resolve(produto));
                produto.cores.forEach(cor => {
                    ImagemDB.getCorById(cor).then((resultImagemCor) => {
                        cor.imagemCor = resultImagemCor
                        ImagemDB.getSelos(cor).then((resultSelos) => {
                            cor.selos = resultSelos
                            ImagemDB.getSimbolos(cor).then((resultSimbolos) => {
                                cor.simbolos = resultSimbolos
                                done();
                            });
                        });
                    });
                });
            } else {
                resolve(produto);
            }
        });
    }

    getImagensProduto(produto) {
        return new Promise((resolve) => {
            if(this.possuiCores(produto)) {
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

    getProdutoEdicaoCarrinho(produto) {
        return new Promise((resolve) => {
            this.getByProdPaginaCatalogo(produto).then((resultProduto) => {
                resolve(resultProduto);
            });
        });
    }

    getProdutoPaginaCatalogo(pagina) {
        return new Promise((resolve) => {
            let item = {};
            this.getByProdPaginaCatalogo(pagina.produtoA).then((resultProdutoA) => {
                item.produtoA = resultProdutoA;
                this.getByProdPaginaCatalogo(pagina.produtoB).then((resultProdutoB) => {
                    if (resultProdutoB != null) {
                        item.produtoB = resultProdutoB;
                    }
                    this.getByProdPaginaCatalogo(pagina.produtoC).then((resultProdutoC) => {
                        if (resultProdutoC != null) {
                            item.produtoC = resultProdutoC;
                        }
                        this.getByProdPaginaCatalogo(pagina.produtoD).then((resultProdutoD) => {
                            if (resultProdutoD != null) {
                                item.produtoD = resultProdutoD;
                            }
                            if (item.produtoA == null && item.produtoB != null) {
                                item.produtoA = item.produtoB;
                                item.produtoB = null;
                            }
                            this.getImagens(item).then((resultImagem) => {
                                resolve(resultImagem);
                            })
                        });
                    });
                });
            });
        }).catch((err) => {
            ErrorDB.criarLogDB({url:'db/produtoDB',method:'getProdutoPaginaCatalogo',message: err,error:'Failed Request'})
        });
    }

    getImagens(item) {
        return new Promise((resolve) => {
            this.getImagensProduto(item.produtoA).then((produtoA) => {
                item.produtoA = produtoA;
                this.getImagensCorProduto(item.produtoB).then((produtoB) => {
                    item.produtoB = produtoB;
                    resolve(item);
                })
            })
        });
    }

    salvar(produto) {
        return new Promise((resolve) => {
            produto._id = produto.referencia;
            this._salvar(produto).then(() => {
                resolve();
            })
        });
    }   

    getIdsFotos() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(_.flattenDeep(produtos.map((produto) => {
                    let cores = _.clone(produto['cores']);
                    return getCoresAtivas(cores).map((cor) => {
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
                    return getCoresAtivas(cores).map((cor) => {
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
                    return getCoresAtivas(cores).map((cor) => {
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
                    return getCoresAtivas(cores).map((cor) => {
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
                            const qtdeImagens = dataResult.fotos.length + dataResult.cores.length + dataResult.selos.length + dataResult.simbolos.length;
                            resolve({quantidade: qtdeImagens, data: dataResult});
                        })
                    })
                })
            })
        });
    }

    getIdsCategoria() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(_.uniq(_.flattenDeep(produtos.map((produto) => {
                    return produto.cores.map((cor) => {
                        return cor.categorias;
                    })
                }))));
            });
        });
    }

    limparBase() {
        return this._limparBase()
    }

}

export default new produtoDB();