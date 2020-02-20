/*=========================================================================================
  File Name: usuarioDB.js
  Description: Classe de banco de Produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import store from '../../store/store';
import SegmentoDB from './segmentoDB';

class usuarioDB {

    signIn(usuario) {
        return new Promise((resolve) => {
            SegmentoDB.salva(usuario.segmento).then(() => {
                usuario.img = usuario.img || 'user.png';
                usuario.displayName = usuario.nome;
                delete usuario.segmento;
                store.dispatch('updateUserActive', usuario);
                resolve(usuario);
            });
        });
    }

    signOut() {
        return new Promise((resolve) => {
            this.limparBase().then(() => {
                resolve();
            });
        });
    }

    limparBase() {
        return new Promise((resolve) => {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('userRole');
            resolve();
        });
    }

}
export default new usuarioDB();
