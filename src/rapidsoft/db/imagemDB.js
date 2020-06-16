/*=========================================================================================
  File Name: imagemDB.js
  Description: Classe de banco responsavel pelas imagens
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import Difference from 'lodash/difference';
import IsArray from 'lodash/isArray';
import ImagemFotoDB from './imagemFotoDB';
import ImagemCorDB from './imagemCorDB';
import ImagemSeloDB from './imagemSeloDB';
import ImagemSimboloDB from './imagemSimboloDB';
import Compress from 'compress.js';

class imagemDB {

    getImagemCor(id) {
        return new Promise((resolve) => {
            ImagemCorDB._getById(id).then((cor) => {
                if (cor.existe) resolve(cor.value);
                else resolve(null);
            });
        });
    }

    // size: 4, // the max size in MB, defaults to 2MB
    // quality: .75, // the quality of the image, max is 1,
    // maxWidth: 1920, // the max width of the output image, defaults to 1920px
    // maxHeight: 1920, // the max height of the output image, defaults to 1920px
    // resize: true, // defaults to true, set false if you do not want to resize the image width and height
    compress(imagens, width=null, height=null, quality=null, size=null) {
        return new Promise((resolve) => {
            const coresSave = imagens.filter((imagem) => imagem.base64.split(',')[1].length > 0);
            if (IsArray(coresSave) && coresSave.length > 0) {
                const compress = new Compress();

                const done = After(coresSave.length, () => resolve(coresSave));
                coresSave.forEach(imagem => {
                    const base64 = imagem.base64.split(',');
                    const type = base64[0].split(';')[0].split(':')[1];
                    fetch(imagem.base64).then(res => res.blob()).then(blob => {
                        const file = new File([blob], imagem.id,{ type: type });

                        const config = {};
                        if (width) config.width = width;
                        if (height) config.height = height;
                        if (quality) config.quality = quality;
                        if (size) config.size = size;

                        compress.compress([file], config).then((results) => {
                            imagem.base64 = results[0].prefix + results[0].data;
                            done();
                        });
                    });
                });
            } else {
                resolve([]);
            }
        });
    }

    salvarFotos(fotos) {
        return new Promise((resolve) => {
            this.compress(fotos, null, null, 0.8, null).then((fotosCompress) => {
                if (fotosCompress.length > 0) {
                    ImagemFotoDB.salvarFotos(fotosCompress).then((fotosSalvas) => {
                        resolve(fotosSalvas);
                    });
                } else {
                    resolve(0);
                }
            });
        });
    }

    /* salvarFotos(fotos) {
        return ImagemFotoDB.salvarFotos(fotos);
    } */

    salvarCores(cores) {
        return ImagemCorDB.salvarCores(cores);
    }

    salvarSelos(selos) {
        return ImagemSeloDB.salvarSelos(selos);
    }

    salvarSimbolos(simbolos) {
        return ImagemSimboloDB.salvarSimbolos(simbolos);
    }       

    limparBase() {
        return new Promise((resolve) => {
            ImagemFotoDB._limparBase().then(() => {
                ImagemCorDB._limparBase().then(() => {
                    ImagemSeloDB._limparBase().then(() => {
                        ImagemSimboloDB._limparBase().then(() => {
                            resolve();
                        });
                    });
                });
            });
        });
    }

    getCorById(cor) {
        return new Promise((resolve) => {
            if (cor && cor.idCor && cor.idCor > 0) {
                ImagemCorDB._getById(cor.idCor).then((corProduto) => {
                    if(corProduto.existe) {
                        resolve(corProduto.value.base64);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });
    }

    getFotoById(idFoto) {
        return new Promise((resolve) => {
            if (idFoto > 0) {
                ImagemFotoDB._getById(idFoto).then((fotoProduto) => {
                    if(fotoProduto.existe) {
                        resolve(fotoProduto.value.base64);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });
    }

    getFotosByCores(cores) {
        return new Promise((resolve) => {
            cores.map((cor) => {
                this.getCorById(cor).then((resultImagemCor) => {
                    cor.imagemCor = resultImagemCor;
                    cor.imagens.map((imagem) => {
                        this.getFotoById(imagem.id).then((imagemCor) => {
                            imagem.imagemCor = imagemCor;
                        });
                    });
                });
            });
            resolve(cores);
        });
    }

    existFoto(idsFoto) {
        return new Promise((resolve) => {
            ImagemFotoDB._getIds().then((idsFotoDB) => {
                const idsFotoNew = [];
                const done = After(idsFoto.length, () => resolve(idsFotoNew));
                idsFoto.forEach(idFoto => {
                    if (!ImagemFotoDB._exists(idsFotoDB, idFoto)) idsFotoNew.push(idFoto);
                    done();
                });
            });
        });
    }

    getSelos() {
        return new Promise((resolve) => {
            resolve([]);
        });
    }

    getSimbolos() {
        return new Promise((resolve) => {
            resolve([]);
        });
    }


    getFotosProduto(cor) {
        return new Promise((resolve) => {
            if (cor.imagens && cor.imagens.length > 0) {
                const done = After(cor.imagens.length, () => resolve(cor.imagens));
                cor.imagens.forEach(imagem => {
                    ImagemFotoDB._getById(imagem.id).then((fotoProduto) => {
                        if(fotoProduto.existe) {
                            imagem.base64 = fotoProduto.value.base64;
                        }
                        done();
                    });
                });
            } else {
                resolve(cor.imagens);
            }
        });
    }

    getFotoPrincipal(produto) {
        return new Promise((resolve) => {
            if (produto.cores[0].imagens.length > 0 && IsArray(produto.cores[0].imagens)) {
                this.getFotoPrincipalCor(produto.cores[0]).then((fotoPrincipal) => {
                    resolve(fotoPrincipal);
                });
            } else {
                resolve(null);
            }
        });
    }

    getFotoPrincipalCor(produtoCor) {
        return new Promise((resolve) => {
            ImagemFotoDB._getById(produtoCor.imagens[0].id).then((fotoProduto) => {
                if(fotoProduto.existe) {
                    resolve(fotoProduto.value.base64);
                } else {
                    resolve(null);
                }
            });
        });
    }

    getIdsNovasFotos(Ids) {
        return new Promise((resolve) => {
            ImagemFotoDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.map((row) => row.id);
                const idsNovasFotos = Difference(Ids, idsBanco);
                resolve(idsNovasFotos);
            });
        });
    }

    getIdsNovasCores(Ids) {
        return new Promise((resolve) => {
            ImagemCorDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.map((row) => row.id);
                const idsNovos = Difference(Ids, idsBanco);
                resolve(idsNovos);
            });
        });
    }

    getIdsNovosSelos(Ids) {
        return new Promise((resolve) => {
            ImagemSeloDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.map((row) => row.id);
                const idsNovos = Difference(Ids, idsBanco);
                resolve(idsNovos);
            });
        });
    }

    getIdsNovosSimbolos(Ids) {
        return new Promise((resolve) => {
            ImagemSimboloDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.map((row) => row.id);
                const idsNovos = Difference(Ids, idsBanco);
                resolve(idsNovos);
            });
        });
    }

    deletarImagens(dataBase, idsOld) {
        return new Promise((resolve) => {
            if (idsOld.length > 0) {
                const done = After(idsOld.length, () => resolve());
                idsOld.forEach(idRemove => {
                    dataBase._deletar(idRemove).then(() => done());
                });
            } else {
                resolve();
            }
        });
    }
    
    getIdsFotosSemProduto(Ids) {
        return new Promise((resolve) => {
            ImagemFotoDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.filter((row) => !row.id.includes("_design")).map((row) => row.id);
                const idsOld = Difference(idsBanco, Ids);
                this.deletarImagens(ImagemFotoDB, idsOld).then(() => {
                    resolve();
                });
            });
        });
    }

    getIdsCoresSemProduto(Ids) {
        return new Promise((resolve) => {
            ImagemCorDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.filter((row) => !row.id.includes("_design")).map((row) => row.id);
                const idsOld = Difference(idsBanco, Ids);
                this.deletarImagens(ImagemCorDB, idsOld).then(() => {
                    resolve();
                });
            });
        });
    }

    getIdsSelosSemProduto(Ids) {
        return new Promise((resolve) => {
            ImagemSeloDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.filter((row) => !row.id.includes("_design")).map((row) => row.id);
                const idsOld = Difference(idsBanco, Ids);
                this.deletarImagens(ImagemCorDB, idsOld).then(() => {
                    resolve();
                });
            });
        });
    }

    getIdsSimbolosSemProduto(Ids) {
        return new Promise((resolve) => {
            ImagemSimboloDB._localDB.allDocs({include_docs: false}).then((resultDocs) => {
                const idsBanco = resultDocs.rows.filter((row) => !row.id.includes("_design")).map((row) => row.id);
                const idsOld = Difference(idsBanco, Ids);
                this.deletarImagens(ImagemCorDB, idsOld).then(() => {
                    resolve();
                });
            });
        });
    }

}

export default new imagemDB();