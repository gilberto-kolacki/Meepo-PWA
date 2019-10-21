import Axios from 'axios'
import Config from '../../../public/config.json'


export const http = Axios.create({
    baseURL: Config.endereco_api,
    timeout: 100000,
    headers: {
        'Authorization': Config.authorization,
		'Content-Type': 'application/json',
        // 'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4',
    }
});

export default http