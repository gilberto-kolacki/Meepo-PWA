/*=========================================================================================
  File Name: usuarioDB.js
  Description: Classe de banco de Produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import store from '../../store/store';
import BasicDB from './basicDB';
import SegmentoDB from './segmentoDB';
import Auth from "../../rapidsoft/auth/authService";

const idUsuario = "1";

class usuarioDB extends BasicDB {

    constructor() {
        super("usuario");
    }

    signIn(usuario) {
        return new Promise((resolve, reject) => {
            SegmentoDB.salva(usuario.segmento).then(() => {
                usuario._id = idUsuario;
                usuario.img = usuario.img || 'user.png';
                usuario.displayName = usuario.nome;
                delete usuario["segmento"];
                this._salvar(usuario).then((user) => {
                    usuario._id = user.id;
                    resolve(usuario);
                }).catch((err) => {
                    this._criarLogDB({url:'db/usuarioDB',method:'signIn',message: err,error:'Failed Request'});
                    reject(err);
                });
            });
        });
    }

    signOut() {
        return new Promise((resolve, reject) => {
            this.limparBase().then(() => {
                resolve();
            }).catch((err) => {
                this._criarLogDB({url:'db/usuarioDB',method:'signOut',message: err,error:'Failed Request'});
                reject(err);
            });
        });
    }

    onAuthStateChanged() {
        return new Promise((resolve, reject) => {
            this._localDB.get(idUsuario).then((user) => {
                store.dispatch('updateUserActive', user);
                resolve(user);
            }).catch((err) => {
                this._criarLogDB({url:'db/usuarioDB',method:'onAuthStateChanged',message: err,error:'Failed Request'});
                reject(err);
            });
        });
    }

    isAuthenticated() {
      return new Promise((resolve) => {
            if(Auth.isAuthenticated()) {
                resolve('/');
            } else {
                resolve({authenticated: false, path: '/login'});
            }
        });
    }

    limparBase() {
        return new Promise((resolve) => {
            this._limparBase().then(() => {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                localStorage.removeItem('userRole');
                resolve();
            }).catch((err) => {
                this._criarLogDB({url:'db/usuarioDB',method:'limparBase',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

}
export default new usuarioDB();
