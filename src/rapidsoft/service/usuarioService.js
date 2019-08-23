import _ from 'lodash'
import { http } from './serviceConfig'

class usuarioSync {

    signInWithUser(email, password) {
        return http.post('/login', {email: email, password: password});
    }

    setPersistence() {
        // return new Promise((resolve) => {

        // });
    }

}
export default new usuarioSync();