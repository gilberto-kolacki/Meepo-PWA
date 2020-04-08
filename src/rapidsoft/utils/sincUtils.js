import Round from 'lodash/round';
import Take from 'lodash/take';
import PullAll from 'lodash/pullAll';
import IsNil from 'lodash/isNil';
import ImagemService from '../service/imagemService';
import CidadeService from '../service/cidadeService';
import ImagemDB from '../db/imagemDB';
import ProdutoDB from '../db/produtoDB';
import CidadeDB from '../db/cidadeDB';
import SincDataDB from '../db/sincDataDB';

class sincUtils {

    atuaizaParcialSinc(sinc, imagensSalvas) {
        sinc.parcial = (sinc.parcial + imagensSalvas);
        sinc.percent = Round((sinc.parcial)/sinc.total * 100, 1);
    }

    openLoading(tela, sinc) {
        tela.$vs.loading({
            background: 'rgba(0, 0, 0, 0.03)',
            color: '#fff',
            container: "#button-with-loading-"+sinc.type,
            scale: 0.6
        });
    }

    closeLoading(tela, sinc, all = false) {
        tela.sincAtivo = false;
        sinc.erro = false;
        SincDataDB.finalizaSinc(sinc).then((sincResult) => {
            sinc.dataSincronizacao = sincResult.dataSincronizacao;
            sinc.tempoSincronizacao = sincResult.tempoSincronizacao;

            setTimeout(()=> {
                sinc.ativo = false;
                tela.$vs.loading.close("#button-with-loading-"+sinc.type+" > .con-vs-loading");
                if (sinc.percent >= 99) sinc.percent = 100;
                if (all) {
                    if (sinc.type == "pedido") tela.$vs.loading.close();
                } else {
                    if (sinc.type != "produto") tela.$vs.loading.close();
                }
            }, 1000);
        });
    }

    downloadImagensFromData(sinc, data) {
        return new Promise((resolve) => {
            const quantidadeSinc = 20;
            const idsFotos = Take(data.fotos, quantidadeSinc);
            
            ImagemService.sincImagemFoto(idsFotos).then((resultFotos) => {
                ImagemDB.salvarFotos(resultFotos).then((fotosSalvas) => {
                    data.fotos = PullAll(data.fotos, idsFotos);
                    this.atuaizaParcialSinc(sinc, fotosSalvas);

                    const idsCores = Take(data.cores, quantidadeSinc);
                    ImagemService.sincImagemCor(idsCores).then((resultCores) => {
                        ImagemDB.salvarCores(resultCores).then((coresSalvas) => {
                            data.cores = PullAll(data.cores, idsCores);
                            this.atuaizaParcialSinc(sinc, coresSalvas);

                            const idsSelos = Take(data.selos, quantidadeSinc);
                            ImagemService.sincImagemSelo(idsSelos).then((resultSelos) => {
                                ImagemDB.salvarSelos(resultSelos).then((selosSalvos) => {
                                    data.selos = PullAll(data.selos, idsSelos);
                                    this.atuaizaParcialSinc(sinc, selosSalvos);

                                    const idsSimbolos = Take(data.simbolos, quantidadeSinc);
                                    ImagemService.sincImagemSimbolo(idsSimbolos).then((resultSimbolos) => {
                                        ImagemDB.salvarSimbolos(resultSimbolos).then((simbolosSalvos) => {
                                            data.simbolos = PullAll(data.simbolos, idsSimbolos);
                                            this.atuaizaParcialSinc(sinc, simbolosSalvos);

                                            if (fotosSalvas > 0 || coresSalvas > 0 || selosSalvos > 0 || simbolosSalvos > 0) {
                                                this.downloadImagensFromData(sinc, data).then(() => resolve());
                                            } else {
                                                resolve();
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    downloadCidadesFromData(sinc) {
        return new Promise((resolve) => {
            const siglasEstados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
            sinc.total = siglasEstados.length;
            const siglaEstado = siglasEstados[sinc.parcial];
            if(IsNil(siglaEstado)) {
                resolve();
            } else {
                CidadeService.sincCidade(siglaEstado).then((estado) => {
                    CidadeDB.salvar(estado).then(() => {
                        this.atuaizaParcialSinc(sinc, 1);
                        this.downloadCidadesFromData(sinc).then(() => resolve());
                    });
                }).catch((error) => {
                    console.log(error);
                }); 
            }
        });
    }

    verificaProdutosSemImagens() {
        return new Promise((resolve) => {
            ProdutoDB.existeNovasImagens().then((result) => {
                resolve(result);
            });
        }); 
    }

    removeImagensSemProduto() {
        return new Promise((resolve) => {
            ProdutoDB.removeImagensSemProduto().then(() => {
                resolve();
            });
        }); 
    }
    
        
}

export default new sincUtils();