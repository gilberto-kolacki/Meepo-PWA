import Axios from 'axios'

let api = 'https://5d546d7536ad770014ccd7bf.mockapi.io'

export const http = Axios.create({
    baseURL: api,
    timeout: 1000,
});

export default http