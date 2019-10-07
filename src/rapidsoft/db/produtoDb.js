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

const produtos = [
    {
        referencia: "44577",
        referenciB: "44578",
        tipo: 1,
        nome: 'BIQUINI BEACH OXYGEN',        
        imagem: '44577_EX1819_1.png',
        categoria: {codigo: 1, nome: 'Biquini'}, 
        preco: 189.90,
        video: 'lklklk',
        cores: [
            {
                codigo: 'EX1819',
                nome: 'EX1819',
                ativo: true,
                imagens: ['1', '2', '3'],
                tamanhos: [
                    {codigo: 'P', ativo: true},
                    {codigo: 'M', ativo: true},
                    {codigo: 'G', ativo: true}
                ],
            },
            {
                codigo: 'EX1818',
                nome: 'EX1818',
                ativo: true,
                imagens: ['1', '2'],
                tamanhos: [
                    {codigo: 'P', ativo: true},
                    {codigo: 'M', ativo: true},
                    {codigo: 'G', ativo: false}
                ],
            },
            {
                codigo: 'EX1815',
                nome: 'EX1815',
                ativo: true,
                imagens: ['1', '2'],
                tamanhos: [
                    {codigo: 'P', ativo: true},
                    {codigo: 'M', ativo: false},
                    {codigo: 'G', ativo: true}
                ],
            },
        ],
    },
    {
        referencia: "43288",
        referenciaA: "43288",
        referenciaB: "43289",
        tipo: 2,
        nome: 'Top Reversible Floral View',        
        imagem: '43288_EX1860_1.png',
        categoria: {codigo: 4, nome: 'Top'},
        preco: 199.90,
        cores: [
            {
                codigo: 'EX1860',
                nome: 'EX1860',
                imagens: ['1', '2', '3'],
                tamanhos: ['P/S', 'M/M', 'G/L'],
            }
        ]
    },
    {
        referencia: "43360",
        tipo: 1,
        nome: 'Regata Strappy Rush',        
        imagem: '43360_0AZ131_1.png',
        categoria: {codigo: 3, nome: 'Regata'},
        preco: 119.90,
        cores: [
            {
                codigo: '0AZ131',
                nome: '0AZ131',
                imagens: ['1', '2', '3', '4'],
                tamanhos: ['XPP','PP', 'P', 'M', 'G', 'GG', 'XGG', 'XXG', 'XXX', 'XXXX', 'XXXXX'],
            },
            {
                codigo: '0AZ132',
                nome: '0AZ132',
                imagens: ['1'],
                tamanhos: ['XPP','PP', 'M', 'G', 'GG', 'XGG', 'XXG', 'XXX', 'XXXX', 'XXXXX'],
            },
            {
                codigo: '0AZ132',
                nome: '0AZ132',
                imagens: ['1'],
                tamanhos: ['XPP','PP', 'P', 'M', 'G', 'GG', 'XGG', 'XXG', 'XXX'],
            }
        ]
    }
];

class produtoDB {

    listar() {
        return new Promise((resolve, reject) => {
            let produtos = []
            localDB.allDocs({include_docs: true}).then((result) => {
                for (let index = 0; index < result.rows.length; index++) {
                    produtos.push(_.cloneDeep(result.rows[index].doc));
                    if (index+1 == result.rows.length) {
                        resolve(produtos);
                    }
                }
            }).catch((erro) => {
                console.log(erro);
                reject(erro);
            });
        });
    }

    getAllProdutos() {
        return new Promise((resolve) => {
            let produtos = []
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resultDocs.rows.forEach(row => {
                    if (row.doc['referencia']) {
                        let produto = _.clone(row.doc);
                        delete produto['_rev'];
                        produtos.push(produto)
                        if (_.last(resultDocs.rows) === row) resolve(produtos);
                    } else {
                        if (_.last(resultDocs.rows) === row) resolve(produtos);
                    }
                });
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    getProdutosCatalogo() {
        return new Promise((resolve) => {
            this.getAllProdutos().then((produtos) => {
                // produtos = _.take(produtos, 10);
                resolve(produtos);
                // produtos.forEach(produto => {
                //     this.getImagensProduto(produto).then((result) => {
                //         produto = result;
                //         if (_.last(produtos) === produto) resolve(produtos);
                //     })
                // });
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

    getCategorias() {
        let categorias = [{codigo: 0, nome: 'Todos'}];
        for (let index = 0; index < produtos.length; index++) {
            const categoria = produtos[index].categoria;
            categoria.check = true;
            categorias.push(categoria)
        }
        return categorias;
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
            let idsImagens = []
            this.getAllProdutos().then((produtos) => {
                produtos.forEach(produto => {
                    let cores = _.clone(produto['cores']);
                    cores.forEach(cor => {
                        cor.imagens.forEach(imagem => {
                            if(cor != undefined && cor.imagens) idsImagens.push(imagem.id);
                            if ((_.last(produtos) === produto) && (_.last(cores) === cor) && (_.last(cor.imagens) === imagem)) resolve(idsImagens);
                        });
                        if ((_.last(produtos) === produto) && (_.last(cores) === cor)) resolve(idsImagens);
                    });
                    if (_.last(produtos) === produto) resolve(idsImagens);
                });
            })
        });
    }

    getIdsCores() {
        return new Promise((resolve) => {
            let idsCores = []
            this.getAllProdutos().then((produtos) => {
                produtos.forEach(produto => {
                    let cores = _.clone(produto['cores']);
                    cores.forEach(cor => {
                        if(cor != undefined && cor.idCor) idsCores.push(cor.idCor);
                        if ((_.last(produtos) === produto) && (_.last(cores) === cor)) resolve(idsCores);
                    });
                    if (_.last(produtos) === produto) resolve(idsCores);
                });
            })
        });
    }

    getIdsSelos() {
        return new Promise((resolve) => {
            let idsSelos = []
            this.getAllProdutos().then((produtos) => {
                produtos.forEach(produto => {
                    let cores = _.clone(produto['cores']);
                    cores.forEach(cor => {
                        if(cor != undefined && _.isArray(cor.selos)) idsSelos = _.concat(idsSelos, cor.selos);
                        if ((_.last(produtos) === produto) && (_.last(cores) === cor)) resolve(idsSelos);
                    });
                    if (_.last(produtos) === produto) resolve(idsSelos);
                });
            })
        });
    }

    getIdsSimbolos() {
        return new Promise((resolve) => {
            let idsSimbolos = []
            this.getAllProdutos().then((produtos) => {
                produtos.forEach(produto => {
                    let cores = _.clone(produto['cores']);
                    cores.forEach(cor => {
                        if(cor != undefined && _.isArray(cor.simbolos)) idsSimbolos = _.concat(idsSimbolos, cor.simbolos);
                        if ((_.last(produtos) === produto) && (_.last(cores) === cor)) resolve(idsSimbolos);
                    });
                    if (_.last(produtos) === produto) resolve(idsSimbolos);
                });
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