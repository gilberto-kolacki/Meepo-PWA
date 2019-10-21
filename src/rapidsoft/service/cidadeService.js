import { http } from './serviceConfig'

class cidadeService {

    sincCidade(estado) {
        return new Promise((resolve, reject) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/cidade', {token: token, estados: [estado], cep: 1}).then((result) => {
                resolve(result.data[0]);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
export default new cidadeService();