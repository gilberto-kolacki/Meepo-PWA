import { http } from './serviceConfig'

class produtoService {

    sincProduto() {
        return new Promise((resolve, reject) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/produto', {token: token}).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
export default new produtoService();