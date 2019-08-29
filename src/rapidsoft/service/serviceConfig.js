import Axios from 'axios'
import Config from '../../../public/config.json'


export const http = Axios.create({
    baseURL: Config.endereco_api,
    timeout: 10000,
    headers: {
		'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': Config.authorization,
    }
});

export default http