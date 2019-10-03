import { http } from './serviceConfig'

class imagemService {

    sincImagemFoto(idsFotos) {
        return new Promise((resolve) => {
            if(idsFotos.length > 0) {
                let token = JSON.parse(localStorage.getItem('token'));
                http.post('/imagem', {token: token, data: {fotos: idsFotos, selos: Array(0), simbolos: Array(0), cores: Array(0)}}).then((result) => {
                    resolve(result.data.fotos);
                }).catch(() => resolve([]));
            } else {
                resolve([]);
            }
        });
    }

    sincImagemCor(idsCor) {
        return new Promise((resolve) => {
            if(idsCor.length > 0) {
                let token = JSON.parse(localStorage.getItem('token'));
                http.post('/imagem', {token: token, data: {cores: idsCor, fotos: Array(0), selos: Array(0), simbolos: Array(0)}}).then((result) => {
                    resolve(result.data.cores);
                }).catch(() => resolve([]));
            } else {
                resolve([]);
            }
        });
    }

    sincImagemSelo(idsSelo) {
        return new Promise((resolve) => {
            if(idsSelo.length > 0) {
                let token = JSON.parse(localStorage.getItem('token'));
                http.post('/imagem', {token: token, data: {selos: idsSelo, fotos: Array(0), simbolos: Array(0), cores: Array(0)}}).then((result) => {
                    resolve(result.data.selos);
                }).catch(() => resolve([]));
            } else {
                resolve([]);
            }
        });
    }

    sincImagemSimbolo(idsSimbolo) {
        return new Promise((resolve) => {
            if(idsSimbolo.length > 0) {
                let token = JSON.parse(localStorage.getItem('token'));
                http.post('/imagem', {token: token, data: {simbolos: idsSimbolo, fotos: Array(0), selos: Array(0), cores: Array(0)}}).then((result) => {
                    resolve(result.data.simbolos);
                }).catch(() => resolve([]));
            } else {
                resolve([]);
            }
        });
    }

}
export default new imagemService();