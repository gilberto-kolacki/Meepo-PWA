/*=========================================================================================
  File Name: imagemDB.js
  Description: Classe de banco responsavel pelas imagens
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import ImagemFotoDB from './imagemFotoDB';
import ImagemCorDB from './imagemCorDB';
import ImagemSeloDB from './imagemSeloDB';
import ImagemSimboloDB from './imagemSimboloDB';

class imagemDB {

    getImagemCor(id) {
        return new Promise((resolve) => {
            ImagemCorDB._getById(id).then((cor) => {
                if (cor.existe) resolve(cor.value);
                else resolve(null);
            });
        });
    }

    salvarFotos(fotos) {
        return ImagemFotoDB.salvarFotos(fotos);
    }

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

    existFoto(idsFoto) {
        return new Promise((resolve) => {
            ImagemFotoDB._getIds().then((idsFotoDB) => {
                const idsFotoNew = [];
                const done = _.after(idsFoto.length, () => resolve(idsFotoNew));
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
                cor.imagens.forEach(imagem => {
                    ImagemFotoDB._getById(imagem.id).then((fotoProduto) => {
                        if(fotoProduto.existe) {
                            imagem.base64 = fotoProduto.value.base64;
                            if(_.last(cor.imagens) === imagem) {
                                resolve(cor.imagens);
                            }
                        } else {
                            imagem.base64 = null;
                            if(_.last(cor.imagens) === imagem) {
                                resolve(cor.imagens);
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
            if (_.isObject(produto.cores[0]) && produto.cores[0].imagens.length > 0 && _.isArray(produto.cores[0].imagens)) {
                ImagemFotoDB._getById(_.orderBy(produto.cores[0].imagens, ['seq'])[0].id).then((fotoProduto) => {
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

}

export default new imagemDB();