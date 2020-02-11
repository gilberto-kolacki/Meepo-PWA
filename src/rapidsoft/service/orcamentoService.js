import { http } from './serviceConfig';

class orcamentoService {

    sincOrcamento(orcamentos) {
        return new Promise((resolve, reject) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/orcamento', {token: token, data: orcamentos}).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
export default new orcamentoService();