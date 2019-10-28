/*=========================================================================================
  File Name: usuarioDB.js
  Description: Classe de banco de Produtos
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import _ from 'lodash';
import store from '../../store/store'
import BasicDB from './basicDB'
import SegmentoDB from './segmentoDB'

let idUsuario = "1";
let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("usuario").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class usuarioDB {

    signIn(usuario) {
        return new Promise((resolve, reject) => {
            SegmentoDB.salva(usuario.segmento).then(() => {
                usuario._id = idUsuario;
                usuario.img = usuario.img || 'user.png';
                usuario.displayName = usuario.nome;
                delete usuario["segmento"];
                localDB.put(_.cloneDeep(usuario)).then((result) => {
                    usuario._id = result.id;
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
                localDB.destroy().then(() => {
                    localStorage.removeItem('userInfo')
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiry');
                    localStorage.removeItem('userRole');
                    resolve(createDB());
                }).catch((err) => {
                    reject(err);
                });
            })
        });
    }

    onAuthStateChanged() {
        return new Promise((resolve, reject) => {
            localDB.get(idUsuario).then((user) => {
                store.dispatch('updateUserActive', user);
                resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }

}
export default new usuarioDB();