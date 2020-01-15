/*=========================================================================================
  File Name: periodoDB.js
  Description: Classe de banco de Periodos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import BasicDB from './basicDB';

class periodoDB extends BasicDB {

    constructor() {
        super("periodo");
    }

    salvarSinc(periodos) {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                if(periodos.length > 0) {
                    const done = _.after(periodos.length, () => resolve());
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
            const idsPeriodos = embarques.map((embarque) =>  embarque.periodos);

            console.log("idsPeriodos", idsPeriodos);
            

            resolve(embarques);
        });
    }

}

export default new periodoDB();