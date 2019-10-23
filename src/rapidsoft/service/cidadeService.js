import { http } from './serviceConfig'
import _ from 'lodash';

class cidadeService {

    sincCidade(estado) {
        return new Promise((resolve, reject) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/cidade', {token: token, estados: [estado], cep: 0}).then((result) => {
                resolve(result.data[0]);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    buscaEndereco(cep) {
        return new Promise((resolve, reject) => {
            cep = _.toString(cep.replace(/[^a-z0-9]/gi, ""))
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/cep', {token: token, cepIni: cep, cepFim: cep}).then((result) => {
                resolve(result.data[0]);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
export default new cidadeService();