import EventEmitter from 'events';
import router from '@/router'
import usuarioDB from '../db/usuarioDB'

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
        usuarioDB.signOut().then(() => {
            this.emit(loginEvent, { loggedIn: false });
            router.go(0);
            callback();
        });
    }

    isAuthenticated() {
      if(new Date(Date.now()) < new Date(parseInt(localStorage.getItem(tokenExpiryKey))) && localStorage.getItem(localStorageKey) != "") {
        return true;
      } else {
        return false;
      }
    }
}

export default new AuthService();
