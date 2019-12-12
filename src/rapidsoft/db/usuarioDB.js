/*=========================================================================================
  File Name: usuarioDB.js
  Description: Classe de banco de Produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import _ from 'lodash';
import store from '../../store/store'
import BasicDB from './basicDB'
import SegmentoDB from './segmentoDB'
import Auth from "../../rapidsoft/auth/authService";

let idUsuario = "1";
const nameDB = "usuario"

class usuarioDB extends BasicDB {

    constructor() {
        super(nameDB);
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
                }).catch((erro) => {
                    reject(erro);
                });
            })
        });
    }

    signOut() {
        return new Promise((resolve, reject) => {
            SegmentoDB.limparBase().then(() => {
                this._localDB.destroy().then(() => {
                    localStorage.removeItem('userInfo')
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiry');
                    localStorage.removeItem('userRole');
                    resolve(new usuarioDB());
                }).catch((err) => {
                    reject(err);
                });
            })
        });
    }

    onAuthStateChanged() {
        return new Promise((resolve, reject) => {
            this._localDB.get(idUsuario).then((user) => {
                store.dispatch('updateUserActive', user);
                resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    isAuthenticated() {
      return new Promise((resolve) => {
        if(Auth.isAuthenticated()) {
          console.log('entrou')
          resolve('/');
        } else {
          resolve({authenticated: false, path: '/login'});
        }
      });
    }

    limparBase() {
        return new Promise((resolve) => {
            SegmentoDB._limparBase().then(() => {
                this._limparBase().then(() => {
                    resolve();
                }).catch((err) => {
                    resolve(err);
                });
            });
        });
    }

}
export default new usuarioDB();
