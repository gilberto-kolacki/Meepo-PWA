import _ from 'lodash'
import { http } from './serviceConfig'

class produtoService {

    sincProduto() {
        let token = JSON.parse(localStorage.getItem('token'));
        return http.post('/produto', {token: token});
    }

    sincImagem() {
        let token = JSON.parse(localStorage.getItem('token'));
        return http.post('/imagem', {token: token});
    }

}
export default new produtoService();