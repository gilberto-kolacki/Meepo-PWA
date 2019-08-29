import _ from 'lodash'
import { http } from './serviceConfig'

class usuarioService {

    signInWithUser(login, password) {
        return http.post('/login', {login: login, password: password});
    }

    setPersistence() {
        // return new Promise((resolve) => {

        // });
    }

}
export default new usuarioService();