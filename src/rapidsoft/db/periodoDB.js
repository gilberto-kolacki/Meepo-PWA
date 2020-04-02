/*=========================================================================================
  File Name: periodoDB.js
  Description: Classe de banco de Periodos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import After from 'lodash/after';
import Uniq from 'lodash/uniq';
import FlattenDeep from 'lodash/flattenDeep';
import BasicDB from './basicDB';

class periodoDB extends BasicDB {

    constructor() {
        super("periodo");
    }

    salvarSinc(periodos) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(periodos.length > 0) {
                    const done = After(periodos.length, () => resolve());
                    periodos.forEach(periodo => {
                        this._salvar(periodo).then(() => done()).catch(() => done());
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    getPeriodosToEmbarque(embarques) {
        return new Promise((resolve) => {
            const idsPeriodos = Uniq(FlattenDeep(embarques.map((embarque) =>  embarque.periodos)));
            const dataAtual = new Date().getTime();
            this._getFindCondition({id : {$in : idsPeriodos}}).then((periodos) => {
                const done = After(embarques.length, () => resolve(embarques));
                embarques.forEach(embarque => {
                    embarque.periodos = periodos.filter((periodo) => this._exists(embarque.periodos, periodo.id));
                    const periodoInicio = embarque.periodos.find((periodo) => periodo.dataPedidoInicio <= dataAtual && periodo.dataPedidoFim >= dataAtual);
                    if (periodoInicio) {
                        embarque.periodos = embarque.periodos.filter((periodo) => periodo.dataPedidoInicio >= periodoInicio.dataPedidoInicio && periodo.dataPedidoFim >= periodoInicio.dataPedidoFim);
                        embarque.dataEmbarque = embarque.periodos[0].dataEmbarqueInicio;
                        const idsPeriodosEmbarque = embarque.periodos.map((periodo) =>  periodo.id);
                        this._getFindCondition({$and : [{id : {$in : idsPeriodos}}, {id : {$nin : idsPeriodosEmbarque}}]}).then((periodosExcecao) => {
                            embarque.periodosExcecao = periodosExcecao.length > 0 ? periodosExcecao : null;
                            done();
                        });
                    } else {
                        embarque.periodos = null;
                        embarque.periodosExcecao = null;
                        done();
                    }
                });
            });
        });
    }

}

export default new periodoDB();