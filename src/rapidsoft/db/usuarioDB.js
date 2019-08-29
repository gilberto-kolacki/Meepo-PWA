import PouchDB from 'pouchdb';
import _ from 'lodash';
import store from '../../store/store'
import Config from '../../../public/config.json'

const dataBaselocal = "meepo_"+Config.empresa+"_usuario";
const localDB = new PouchDB(dataBaselocal, {auto_compaction: true});
let idUsuario = "1";

class usuarioDB {

    signIn(usuario) {
        return new Promise((resolve, reject) => {
            usuario._id = idUsuario;
            usuario.img = 'avatar-s-11.png';
            usuario.displayName = usuario.nome;
            localDB.put(_.cloneDeep(usuario)).then((result) => {
                usuario._id = result.id;
                resolve(usuario);
            }).catch((erro) => {
                reject(erro);
            });
        });
    }

    signOut() {
        return new Promise((resolve, reject) => {
            localDB.destroy().then((result) => {
                localStorage.removeItem('userInfo')
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                localStorage.removeItem('userRole');
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
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