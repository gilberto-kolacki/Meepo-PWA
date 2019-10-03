import { http } from './serviceConfig'

class produtoService {

    sincProduto() {
        return new Promise((resolve) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/produto', {token: token}).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                console.log(error);
                resolve([]);
            });
        });
    }

}
export default new produtoService();