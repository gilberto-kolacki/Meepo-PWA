import { http } from './serviceConfig'

class clienteService {

    sincCliente(clientes) {
        return new Promise((resolve, reject) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/cliente', {token: token, data: clientes}).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    sincGrupoCliente() {
        return new Promise((resolve, reject) => {
            let token = JSON.parse(localStorage.getItem('token'));
            http.post('/grupoCliente', {token: token}).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
export default new clienteService();