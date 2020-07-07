import EventEmitter from 'events';
import router from '@/router';
import UsuarioDB from '../db/usuarioDB';
import store from '../../store/store';

const localStorageKey = 'token';
const tokenExpiryKey = 'tokenExpiry';
const loginEvent = 'loginEvent';

class AuthService extends EventEmitter {

    renewTokens() {
        // reject can be used as parameter in promise for using reject
        return new Promise((resolve, reject) => {
            if (localStorage.getItem(localStorageKey) === "") {
                reject("Not logged in");
            }
        });
    }

    logOut(callback) {
        UsuarioDB.signOut().then(() => {
            this.emit(loginEvent, { loggedIn: false });
            router.go(0);
            callback();
        });
    }

    isAuthenticated() {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const dataExpiracaoToken = new Date(parseInt(localStorage.getItem(tokenExpiryKey)));
        const token = localStorage.getItem(localStorageKey);
        if(user && new Date(Date.now()) < dataExpiracaoToken && token != "") {
            store.dispatch('updateUserActive', user);
            
            return true;
        } else {
            return false;
        }
    }
}

export default new AuthService();
