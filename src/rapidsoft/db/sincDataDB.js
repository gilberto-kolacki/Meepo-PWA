/*=========================================================================================
  File Name: segmentoDB.js
  Description: Classe de banco log de sincronismos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB'

const sincDados =  [
    {
        _id:"1",
        type:"cliente",
        titulo: "Clientes",
        methodo: "sincCliente",
        percent: 0,
        parcial: 0,
        total: 0,
        tempoSincronizacao: 0,
        dataSincronizacao: null
    },
    {
        _id:"3",
        type:"parametros",
        titulo: "Parâmetros",
        methodo: "sincParametro",
        percent: 0,
        parcial: 0,
        total: 0,
        tempoSincronizacao: 0,
        dataSincronizacao: null
    },
    {
        _id:"9",
        type:"cidade",
        titulo: "Cidades",
        methodo: "sincCidade",
        percent: 0,
        parcial: 0,
        total: 0,
        tempoSincronizacao: 0,
        dataSincronizacao: null
    },
    {
        _id:"10",
        type:"produto",
        titulo: "Produtos",
        methodo: "sincProduto",
        percent: 0,
        parcial: 0,
        total: 0,
        tempoSincronizacao: 0,
        dataSincronizacao: null
    },
    {
        _id:"11",
        type:"imagem",
        titulo: "Imagens",
        methodo: "sincImagem",
        percent: 0,
        parcial: 0,
        total: 0,
        tempoSincronizacao: 0,
        dataSincronizacao: null
    },    
]

const createSincs = (localDB) => {
    localDB.bulkDocs(sincDados).then().catch((err) => {
        console.log(err);
    });
}

class sincDataDB extends BasicDB {

    constructor() {
        super("sinc_data");
        createSincs(this._localDB);
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            this._localDB.get(id).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    zerar(sincData) {
        sincData = _.clone(sincData);
        sincData.order = _.toNumber(sincData._id);
        sincData.parcial = 0;
        sincData.percent = 0;
        sincData.ativo = false;
        return sincData;
    }

    getAll() {        
        return new Promise((resolve) => {
            const sincDados = []
            this._getAll().then((sincs) => {
                const done = _.after(sincs.length, () => resolve(sincDados));
                sincs.forEach(sinc => {
                    sincDados.push(this.zerar(sinc));
                    done();
                });
            });
        });
    }

    jaTeveSincronizacao() {
        return new Promise((resolve) => {
            this.getAll().then((sincs) => {
                if(_.find(sincs, (sinc) => sinc.total > 0)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    finalizaSinc(sinc) {
        return new Promise((resolve) => {
            sinc.tempoSincronizacao = _.round((Date.now() - sinc.inicio) / 1000, 1);
            sinc.dataSincronizacao = Date.now();
            this._getById(sinc._id, true).then((resultSinc) => {
                if (resultSinc.existe) {
                    sinc._rev = resultSinc.result._rev;
                    this._salvar(sinc).then(() => {
                        resolve(sinc);
                    }).catch(() => {
                        resolve(sinc);
                    });
                } else {
                    resolve(sinc);
                }
            });
        });
    }

}

export default new sincDataDB();