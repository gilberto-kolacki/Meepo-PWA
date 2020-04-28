/*=========================================================================================
  File Name: produtoDB.js
  Description: Classe de banco de Produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import ToUpper from 'lodash/toUpper';
import After from 'lodash/after';
import OrderBy from 'lodash/orderBy';
import Uniq from 'lodash/uniq';
import FlattenDeep from 'lodash/flattenDeep';
import IsObject from 'lodash/isObject';
import Round from 'lodash/round';

import arrayMove from 'array-move';
import BasicDB from './basicDB';
import ImagemDB from './imagemDB';
import EmbarqueDB from './embarqueDB';
import CategoriaDB from './categoriaDB';
import Storage from '../utils/storage';



const getProdutoToDBFilterCategoria = (produtos, idsCategorias, textoSearch) => {
    
    textoSearch = ToUpper(textoSearch);
    return produtos.filter((produto) => {
        return textoSearch === null || textoSearch === "" || ToUpper(produto.referencia).includes(textoSearch) || produto.nome.includes(textoSearch);
    }).filter((produto) => {
        return idsCategorias.length === 0 || produto.cores.some((cor) => {
            return cor.categorias.some((categoria) => {
                return idsCategorias.some((idCategoria) => {
                    return categoria === idCategoria;
                });
            });
        });
    });
};

const getProdutoToDBCategoria = (produtos, idCategoria) => {
    return produtos.filter((produto) => {
        return idCategoria.length === 0 || produto.cores.some((cor) => {
            return cor.categorias.some((categoria) => {
                return categoria === idCategoria;
            });
        });
    });
};

const getCoresAtivas = (cores) => {
    return cores.filter((cor) => cor.ativo);
};

const getReferenciasCarrinho = (carrinho) => {
    return carrinho.itens.map((produto) => produto.referencia);
};

class produtoDB extends BasicDB {

    constructor() {
        super("produto");
        this._createIndex('referencia');
    }

    getAllProdutos() {
        return new Promise((resolve) => {
            this._getFindCondition({referencia : {$ne : null}}).then((produtos) => {
                resolve(produtos);
            });
        });
    }

    getProdutosByIdCategorias(idCategoria) {
        
        return new Promise((resolve) => {
                this.getAllProdutos().then((produtos) => {
                    resolve(getProdutoToDBCategoria(produtos, idCategoria));
                });
        });
    }

    getAllProdutosByIdCategorias(idCategorias, textoSearch) {
        
        return new Promise((resolve) => {
            if (idCategorias.length > 0 || textoSearch.length > 0) {
                this.getAllProdutos().then((produtos) => {
                    resolve(getProdutoToDBFilterCategoria(produtos, idCategorias, textoSearch));
                });
            } else {
                resolve([]);
            }
        });
    }

    getTamanhosProdutoCarrinho(tamanhos, carrinho) {
        return tamanhos.reduce((tamanhoResult, tamanho) => {
            const itemQuantidade = carrinho.itens.find((item) => item.id === tamanho.id);
            tamanho.quantidade = itemQuantidade ? itemQuantidade.quantidade : 0;
            tamanhoResult.push(tamanho);
            return tamanhoResult;
        }, []);
    }

    getTotalCor(tamanhos, carrinho) {
        return tamanhos.reduce((total, tamanho) => {
            const itemQuantidade = carrinho.itens.find((item) => item.id === tamanho.id);
            return total + (itemQuantidade ? itemQuantidade.quantidade : 0);
        }, 0);
    }

    getProdutoCorCarrinho(produtos) {
        return produtos.reduce((produtosCor, produto) => {
            const produtoCores = produto.cores.map((cor) => {
                const produtoCor = {};
                produtoCor.referencia = produto.referencia;
                produtoCor.nome = produto.nome;
                produtoCor.segmento = produto.segmento;
                produtoCor.linhas = [ produto.idLinha ];
                produtoCor.prontaEntrega = cor.prontaEntrega;
                produtoCor.idCor = cor.idCor;
                produtoCor.idProduto = cor.idProduto;
                produtoCor.codigoCor = cor.codigo;
                produtoCor.nomeCor = cor.nome;
                produtoCor.precoCusto = cor.precoCusto;
                produtoCor.precoVenda = cor.precoVenda;
                produtoCor.imagem = cor.imagens[0].id;
                produtoCor.tamanhos = cor.tamanhos;
                produtoCor.categorias = cor.categorias;
                produtoCor.embarques = cor.embarques;
                produtoCor.embarqueSelecionado = produto.embarqueSelecionado;
                return produtoCor;
            });
            return produtosCor.concat(produtoCores);
        }, []);
    }
    
    getEmbarqueSelecionado(produto, carrinho) {
        const item = carrinho.itens.find((itemCarrinho) => itemCarrinho.idProduto == produto.idProduto);
        return item.embarqueSelecionado;
    }

    getProdutoEmbarqueSelecionadoSeq(produtos, carrinho) {
        const produtoEmbarqueSeq = carrinho.itens.reduce((produtoEmbarquesSeq, itemCarrinho) => {
            const chave = itemCarrinho.idProduto +"-"+ itemCarrinho.embarqueSelecionado.id +"-"+ itemCarrinho.embarqueSelecionado.seq;
            if (!produtoEmbarquesSeq.hasOwnProperty(chave)) {
                const produto = {...produtos.find((produto) => produto.referencia === itemCarrinho.referencia)};
                produto.cores = [...produto.cores.filter((cor) => cor.idProduto === itemCarrinho.idProduto)];
                produto.embarqueSelecionado = itemCarrinho.embarqueSelecionado ? {...itemCarrinho.embarqueSelecionado} : null;
                produtoEmbarquesSeq[chave] = produto;
            }
            return produtoEmbarquesSeq;
        }, {});
        return Object.values(produtoEmbarqueSeq);
    }

    getProdutosFromCarrinho(carrinho) {
        return new Promise((resolve) => {
            const produtosCarrinho = [];
            const refsCarrinho = getReferenciasCarrinho(carrinho);
            this._getFindCondition({referencia : {$in : refsCarrinho}}).then((produtos) => {
                produtos = this.getProdutoEmbarqueSelecionadoSeq(produtos, carrinho);
                produtos = this.getProdutoCorCarrinho(produtos, carrinho);
                if (produtos.length > 0) {
                    const done = After(produtos.length, () => resolve(produtosCarrinho));
                    produtos.forEach((produto) => {
                        produto.quantidade = this.getTotalCor(produto.tamanhos, carrinho);
                        produto.tamanhos = this.getTamanhosProdutoCarrinho(produto.tamanhos, carrinho);
                        ImagemDB.getFotoById(produto.imagem).then(imagem => {
                            produto.imagemPrincipal = imagem;
                            EmbarqueDB.getEmbarqueProduto(produto).then((embarque) => {
                                if (embarque) {
                                    produto.embarque = embarque.id;
                                    produto.segmento = produto.segmento;
                                    produtosCarrinho.push(produto);
                                }
                                done();
                            });
                        });
                    });
                } else {
                    resolve(produtosCarrinho);
                }
            });
        });
    }

    getPaginasByCategorias(idCategoria, paginas) {
        return new Promise((resolve) => {
            if (idCategoria) {
                resolve(paginas.filter((pagina) => {
                    return pagina.produtos.some((produto) => produto.cat.indexOf(idCategoria) >= 0);
                }));
            } else {
                resolve(paginas);
            }
        });
    }

    getPaginasCatalogo(idCategoria = null) {
        return new Promise((resolve) => {
            const catalogo = Storage.getCatalogo();
            this.getPaginasByCategorias(idCategoria, catalogo.paginas).then((paginas) => {
                catalogo.paginas = paginas;

                const produtos = this.getProdutosFromPaginas(catalogo.paginas);
                CategoriaDB.getByIds(catalogo.categorias).then((categorias) => {
                    produtos.categorias = categorias;
                    resolve(produtos);
                });
            });
        });
    }

    getProdutosFromPaginas(paginas) {
        return paginas.map((pagina) => {
            const prodOrderSeq = OrderBy(pagina.produtos, ['seq']);
            pagina.produtoA = prodOrderSeq[0];
            // if (prodOrderSeq[1]) {
            //     pagina.produtoB = prodOrderSeq[1];
            // }
            // if (prodOrderSeq[2]) {
            //     pagina.produtoC = prodOrderSeq[2];
            // }
            // if (prodOrderSeq[3]) {
            //     pagina.produtoD = prodOrderSeq[3];
            // }
            return pagina;
        });
    }

    getProdutosLook(produtosLook) {
        return new Promise((resolve) => {
            this._getFindCondition({referencia : {$in : produtosLook}}).then((produtos) => {
                const produtosLook = [];
                if (produtos.length > 0) {
                    const done = After(produtos.length, () => resolve(produtosLook));
                    produtos.forEach(produto => {
                        ImagemDB.getFotoPrincipal(produto).then((imagemProdutoPrincipal) => {
                            produtosLook.push({
                                id: produto.referencia, 
                                nome: produto.nome, 
                                img: imagemProdutoPrincipal,
                                produto: produto
                            });
                            done();
                        });
                    });
                } else {
                    resolve(produtosLook);
                }
            });
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            this._localDB.get(String(id)).then((result) => {
                delete result._rev;
                delete result.video;
                resolve({existe: true, value: result});  
            }).catch((error) => {
                this._criarLogDB({url:'db/produtoDB',method:'getById',message: error,error:'Failed Request'});
                resolve({existe: false, result: error});
            });
        });
    }

    calcularPreco(itemCor, tipo = 1) {
        const percentual = Number(Storage.getGrupoCarrinho().porcentagem);
        const precoProduto = tipo === 1 ? itemCor.precoCusto : itemCor.precoVenda;
        return Round(precoProduto + ((percentual/100) * precoProduto), 2);
    }

    getEmbarquesProdutoCor(produto) {
        return new Promise((resolve) => {
            const done = After(produto.cores.length, () => resolve(produto));
            produto.cores.forEach((cor) => {
                EmbarqueDB.getEmbarqueProduto(cor).then((embarque) => {
                    cor.embarqueSelecionado = {id: embarque.id, seq: 1};
                    this.getImagensCorProduto(cor).then(() => {
                        done();
                    });
                });
            });
        });
    }

    getByReferenciasAddCarrinho(produtos, prontaEntrega=false) {
        return new Promise((resolve) => {
            const referenciasAddCarrinho = [];
            produtos = [...produtos.filter((produto) => produto != undefined)];
            const done = After(produtos.length, () => resolve(referenciasAddCarrinho));
            produtos.forEach((produto) => {
                this._localDB.get(String(produto.referencia)).then((resultProduto) => {
                    delete resultProduto._rev;
                    delete resultProduto.video;
                    resultProduto.cores = [...resultProduto.cores.filter((cor) => cor.prontaEntrega === prontaEntrega)];
                    this.createProdutosAddCarrinho(resultProduto).then((resultProdutoAdd) => {
                        this.getEmbarquesProdutoCor(resultProdutoAdd).then((resultProdutoEmbarques) => {
                            referenciasAddCarrinho.push(resultProdutoEmbarques);
                            done();
                        });
                    });
                }).catch((error) => {
                    this._criarLogDB({url:'db/produtoDB',method:'getById',message: error,error:'Failed Request'});
                    resolve({existe: false, result: error});
                });
            });
        });
    }

    createProdutosAddCarrinho(produto) {
        return new Promise((resolve) => {            
            produto.produtoAddCores = this.getProdutoAddCores(produto);
            produto.produtoLabelTamanhos = this.getTamanhosLabelProduto(produto);
            resolve(produto);
        });
    }

    getProdutoAddCores(produto) {
        const carrinho = Storage.getCarrinho();
        return OrderBy(produto.cores.reduce((produtoAddCores, cor) => {
            const itemCarrinho = carrinho.itens.find((item) => item.idProduto === cor.idProduto);
            const produtoAddCor = {codigo: cor.codigo, ativo: true, idCor: cor.idCor, idProduto: cor.idProduto};
            produtoAddCor.embarqueSelecionado = itemCarrinho && itemCarrinho.embarqueSelecionado ? itemCarrinho.embarqueSelecionado : null;
            produtoAddCor.produtoAddTamanhos = this.getTamanhosCor(cor, carrinho);
            produtoAddCores.push(produtoAddCor);
            return produtoAddCores;
        },[]), ['seq'], ['asc']);
    }

    getTamanhosLabelProduto(produto) {
        const labels = produto.cores.reduce((labels, cor) => {
            for (let index = 0; index < cor.tamanhos.length; index++) {
                const tamanho = cor.tamanhos[index];
                labels[tamanho.codigo] = {codigo: tamanho.codigo, ativo: true, seq: tamanho.seq};
            }
            return labels;
        }, {});
        return Object.values(labels);
    }

    getTamanhosCor(cor, carrinho) {
        return cor.tamanhos.reduce((tamanhosCor, tamanho) => {
            const itemCarrinho = carrinho.itens.find((item) => item.id == tamanho.id);
            if (itemCarrinho) {
                tamanho.quantidade = itemCarrinho.quantidade;
            }
            tamanho.fixadoAtivo = tamanho.ativo;
            tamanhosCor.push(tamanho);
            return tamanhosCor;
        }, []);
    }
    

    getByProdPaginaCatalogo(pagina) {
        return new Promise((resolve) => {
            if (pagina && (pagina.ref || pagina.referencia)) {
                this.getById(pagina.ref || pagina.referencia).then((resultProduto) => {
                    const produto = resultProduto.value;
                    if (resultProduto.existe && produto.cores && produto.cores.length > 0) {                        
                        produto.cores = produto.cores.filter((cor) => cor.prontaEntrega === false);
                        const indexCor = produto.cores.findIndex((cor) => cor.idProduto == pagina.id);
                        if (indexCor > 0) {
                            produto.cores = arrayMove(produto.cores, indexCor, 0);
                        }
                        resolve(produto);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });            
    }

    getProdutosSearch(idsCategorias, textoSearch) {
        return new Promise((resolve) => {
            this.getAllProdutosByIdCategorias(idsCategorias, textoSearch).then((produtos) => {
                if(produtos.length > 0) {
                    const done = After(produtos.length, () => resolve(produtos));
                    produtos.forEach(produto => {
                        if(produto.cores.length > 0) {
                            ImagemDB.getFotoPrincipal(produto).then((result) => {
                                produto.imagemPrincipal = result;
                                done();
                            });
                        } else {
                            done();
                        }
                    });
                }
            });
        });
    }

    possuiCores(produto) {
        return produto && produto.cores && produto.cores.length > 0 && IsObject(produto.cores[0]);
    }

    getImagensCoresProduto(produto) {
        return new Promise((resolve) => {
            if(this.possuiCores(produto)) {
                const done = After(produto.cores.length, () => resolve(produto));
                produto.cores.forEach((cor) => {
                    this.getImagensCorProduto(cor).then(() => {
                        done();
                    });
                });
            } else {
                resolve(produto);
            }
        });
    }

    getImagensCorProduto(produtoCor) {
        return new Promise((resolve) => {
            ImagemDB.getCorById(produtoCor).then((resultImagemCor) => {
                produtoCor.imagemCor = resultImagemCor;
                ImagemDB.getSelos(produtoCor).then((resultSelos) => {
                    produtoCor.selos = resultSelos;
                    ImagemDB.getSimbolos(produtoCor).then((resultSimbolos) => {
                        produtoCor.simbolos = resultSimbolos;
                        resolve(produtoCor);
                    });
                });
            });
        });
    }

    getImagensProduto(produto) {
        return new Promise((resolve) => {
            if(this.possuiCores(produto)) {
                const done = After(produto.cores.length, () => resolve(produto));
                produto.cores.forEach(cor => {
                    ImagemDB.getCorById(cor).then((resultImagemCor) => {
                        cor.imagemCor = resultImagemCor;
                        ImagemDB.getSelos(cor).then((resultSelos) => {
                            cor.selos = resultSelos;
                            ImagemDB.getSimbolos(cor).then((resultSimbolos) => {
                                cor.simbolos = resultSimbolos;
                                ImagemDB.getFotosProduto(cor).then((resultFotos) => {
                                    cor.imagens = resultFotos;
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
                if (resultProdutoA) {
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
                                });
                            });
                        });
                    });
                } else {
                    this._criarLogDB({url:'db/produtoDB',method:'getProdutoPaginaCatalogo',message: 'Produto não encontrado: '+pagina.produtoA,error:'Failed Request'});
                    resolve();
                }
            });
        }).catch((err) => {
            this._criarLogDB({url:'db/produtoDB',method:'getProdutoPaginaCatalogo',message: err,error:'Failed Request'});
        });
    }

    getImagens(item) {
        return new Promise((resolve) => {
            this.getImagensProduto(item.produtoA).then((produtoA) => {
                item.produtoA = produtoA;
                this.getImagensCoresProduto(item.produtoB).then((produtoB) => {
                    item.produtoB = produtoB;
                    resolve(item);
                });
            });
        });
    }

    salvar(produto) {
        return new Promise((resolve, reject) => {
            produto._id = produto.referencia;
            produto.cores = produto.cores.map((cor) => {
                cor.imagens = cor.imagens.sort((a, b) => {
                    if (a.seq > b.seq) return 1;
                    if (a.seq < b.seq) return -1;
                    return 0;
                });
                return cor;
            });
            this._salvar(produto).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }   

    getIdsFotos(produto) {
        return new Promise((resolve) => {
            const IdsFotos = getCoresAtivas(produto.cores).reduce((idsFotos, cor) => {
                return idsFotos.concat(cor.imagens.map((imagem) => imagem.id.toString()));
            }, []);
            resolve(IdsFotos);
        });
    }

    getIdsCores(produto) {
        return new Promise((resolve) => {
            const IdsCores = getCoresAtivas(produto.cores).reduce((idsCores, cor) => {
                if (cor && cor.idCor) idsCores.push(cor.idCor.toString());
                return idsCores;
            }, []);
            resolve(IdsCores);
        });
    }

    getIdsSelos(produto) {
        return new Promise((resolve) => {
            const IdsSelos = getCoresAtivas(produto.cores).reduce((selos, cor) => {
                if (cor && cor.selos && cor.selos.length > 0) selos = selos.concat(cor.selos.map((selo) => selo.toString()));
                return selos;
            }, []);
            resolve(IdsSelos);
        });
    }

    getIdsSimbolos(produto) {
        return new Promise((resolve) => {
            const IdsSimbolos = getCoresAtivas(produto.cores).reduce((simbolos, cor) => {
                if (cor && cor.simbolos && cor.simbolos.length > 0) simbolos = simbolos.concat(cor.simbolos.map((simbolo) => simbolo.toString()));
                return simbolos;
            }, []);
            resolve(IdsSimbolos);
        });
    }

    getIdsImagens() {
        return new Promise((resolve) => {
            const dataResult = {fotos:[], selos:[], simbolos:[], cores:[]};
            this.getAllProdutos().then((produtos) => {
                if (produtos.length > 0) {
                    const done = After(produtos.length, () => {
                        const qtdeImagens = dataResult.fotos.length + dataResult.cores.length + dataResult.selos.length + dataResult.simbolos.length;
                        resolve({quantidade: qtdeImagens, data: dataResult});
                    });
                    produtos.forEach(produto => {
                        this.getIdsFotos(produto).then((idsImagens) => {
                            dataResult.fotos = Uniq(dataResult.fotos.concat(idsImagens));
                            this.getIdsCores(produto).then((idsCores) => {
                                dataResult.cores = Uniq(dataResult.cores.concat(idsCores));
                                this.getIdsSelos(produto).then((idsSelos) => {
                                    dataResult.selos = Uniq(dataResult.selos.concat(idsSelos));
                                    this.getIdsSimbolos(produto).then((idsSimbolos) => {
                                        dataResult.simbolos = Uniq(dataResult.simbolos.concat(idsSimbolos));
                                        done();
                                    });
                                });
                            });
                        });
                    });
                } else {
                    resolve({quantidade: 0, data: null});
                }
            });
        });
    }

    getIdsCategoria() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                resolve(Uniq(FlattenDeep(produtos.map((produto) => {
                    return produto.cores.map((cor) => {
                        return cor.categorias;
                    });
                }))));
            });
        });
    }

    existeNovasImagens() {
        return new Promise((resolve) => {
            this.getIdsImagens().then((idsImagens) => {
                if (idsImagens.data) {
                    ImagemDB.getIdsNovasFotos(idsImagens.data.fotos).then((idsNovasFotos) => {
                        idsImagens.data.fotos = idsNovasFotos;
                        ImagemDB.getIdsNovasCores(idsImagens.data.cores).then((idsNovasCores) => {
                            idsImagens.data.cores = idsNovasCores;
                            ImagemDB.getIdsNovosSelos(idsImagens.data.selos).then((idsNovosSelos) => {
                                idsImagens.data.selos = idsNovosSelos;
                                ImagemDB.getIdsNovosSimbolos(idsImagens.data.simbolos).then((idsNovosSimbolos) => {
                                    idsImagens.data.simbolos = idsNovosSimbolos;
                                    idsImagens.quantidade = idsImagens.data.fotos.length + idsImagens.data.cores.length + idsImagens.data.selos.length + idsImagens.data.simbolos.length;
                                    resolve(idsImagens);
                                });
                            });
                        });
                    });
                } else {
                    resolve(idsImagens);
                }
            });
        });
    }

    removeImagensSemProduto() {
        return new Promise((resolve) => {
            this.getIdsImagens().then((idsImagens) => {
                if (idsImagens.data) {
                    ImagemDB.getIdsFotosSemProduto(idsImagens.data.fotos).then(() => {
                        ImagemDB.getIdsCoresSemProduto(idsImagens.data.cores).then(() => {
                            ImagemDB.getIdsSelosSemProduto(idsImagens.data.selos).then(() => {
                                ImagemDB.getIdsSimbolosSemProduto(idsImagens.data.simbolos).then(() => {
                                    resolve();
                                });
                            });
                        });
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    getProdutosAtivosFromEmbarques(embarques) {
        return new Promise((resolve) => {
            const arrayRemove = [];
            const done = After(embarques.length, () => {
                embarques = embarques.reduce((embarquesNew, embarque) => {
                    embarque.itens = embarque.itens.reduce((itens, item) => {
                        if (!arrayRemove.some((idProduto) => idProduto === item.idProduto)) itens.push(item);
                        return itens;
                    }, []);
                    embarquesNew.push(embarque);
                    return embarquesNew;
                }, []);
                resolve({embarques, menssagem: `Foram removidos ${arrayRemove.length} produtos, pois não estão mais disponiveis para venda!`});
            });
            embarques.forEach(embarque => {
                const done2 = After(embarque.itens.length, () => done());
                embarque.itens.forEach(item => {
                    this.getById(item.referencia).then((produto) => {
                        if (produto.existe) {
                            const cor = produto.result.cores.find((cor) => cor.idCor === item.idCor);
                            if (cor.ativo) done2();
                            else {
                                arrayRemove.push(item.idProduto);
                                done2();
                            }
                        } else {
                            arrayRemove.push(item.idProduto);
                            done2();
                        }
                    });
                });
            });
        });
    }

}

export default new produtoDB();