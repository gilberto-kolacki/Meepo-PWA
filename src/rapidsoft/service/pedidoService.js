import { http } from './serviceConfig';

class pedidoService {

    sincPedido(pedidos) {
        return new Promise((resolve, reject) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/pedido', {token: token, data: pedidos}).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
export default new pedidoService();