import { http } from './serviceConfig'

class parametroService {

    sincGrupoCliente() {
        return new Promise((resolve, reject) => {
            const token = JSON.parse(localStorage.getItem('token'));
            http.post('/parametro', {token: token}).then((result) => {
                resolve(result.data.grupoCliente);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    sincParametro() {
        return new Promise((resolve, reject) => {
            const token = JSON.parse(localStorage.getItem('token'));
            http.post('/parametro', {token: token}).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
export default new parametroService();