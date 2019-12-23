import _ from 'lodash'
import ImagemService from '../service/imagemService';
import CidadeService from '../service/cidadeService';
import ImagemDB from '../db/imagemDB';
import CidadeDB from '../db/cidadeDB';
import SincDataDB from '../db/sincDataDB';

class sincUtils {

    atuaizaParcialSinc(sinc, imagensSalvas) {
        sinc.parcial = (sinc.parcial + imagensSalvas);
        sinc.percent = _.round((sinc.parcial)/sinc.total * 100, 1);
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
                tela.$vs.loading.close("#button-with-loading-"+sinc.type+" > .con-vs-loading");
                if (all) {
                    if (sinc.type == "imagem") tela.$vs.loading.close();
                } else {
                    tela.$vs.loading.close();
                }
                if (sinc.percent >= 99) sinc.percent = 100;
                sinc.ativo = false;
            }, 1000);
        });
    }

    downloadImagensFromData(sinc, data) {
        return new Promise((resolve) => {
            const quantidadeSinc = 50;
            const idsFotos = _.take(data.fotos, quantidadeSinc);
            
            ImagemService.sincImagemFoto(idsFotos).then((resultFotos) => {
                ImagemDB.salvarFotos(resultFotos).then((fotosSalvas) => {
                    data.fotos = _.pullAll(data.fotos, idsFotos);
                    this.atuaizaParcialSinc(sinc, fotosSalvas);

                    const idsCores = _.take(data.cores, quantidadeSinc);
                    ImagemService.sincImagemCor(idsCores).then((resultCores) => {
                        ImagemDB.salvarCores(resultCores).then((coresSalvas) => {
                            data.cores = _.pullAll(data.cores, idsCores);
                            this.atuaizaParcialSinc(sinc, coresSalvas);

                            const idsSelos = _.take(data.selos, quantidadeSinc);
                            ImagemService.sincImagemSelo(idsSelos).then((resultSelos) => {
                                ImagemDB.salvarSelos(resultSelos).then((selosSalvos) => {
                                    data.selos = _.pullAll(data.selos, idsSelos);
                                    this.atuaizaParcialSinc(sinc, selosSalvos);

                                    const idsSimbolos = _.take(data.simbolos, quantidadeSinc);
                                    ImagemService.sincImagemSimbolo(idsSimbolos).then((resultSimbolos) => {
                                        ImagemDB.salvarSimbolos(resultSimbolos).then((simbolosSalvos) => {
                                            data.simbolos = _.pullAll(data.simbolos, idsSimbolos);
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
            if(_.isNil(siglaEstado)) {
                resolve();
            } else {
                CidadeService.sincCidade(siglaEstado).then((estado) => {
                    CidadeDB.salvar(estado).then(() => {
                        this.atuaizaParcialSinc(sinc, 1);
                        this.downloadCidadesFromData(sinc).then(() => resolve());
                    })
                }).catch((error) => {
                    console.log(error);
                }); 
            }
        });
    }
    
        
}

export default new sincUtils();