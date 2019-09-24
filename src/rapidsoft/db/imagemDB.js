import Axios from 'axios'
import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';
import Config from '../../../public/config.json'

let fotoDB = null;
let corDB = null;
let seloDB = null;
let simboloDB = null;

const downloadImg = (url) => {
    Axios({
        method: 'get', 
        url: url, 
        responseType: 'arraybuffer', 
        headers: {
            // 'Authorization': Config.authorization,
            // "Sec-Fetch-Mode": "navigate",             
        },
    }).then((response) => {
        console.log(response);
        
        // const url = window.URL.createObjectURL(new Blob([response.data]));

        // console.log(url);
        

    }).catch((error) => console.log(error));
};

const createDB = () => {
    BasicDB.createDBLocalBasic("foto").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            fotoDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    });
    BasicDB.createDBLocalBasic("cor").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            corDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
    BasicDB.createDBLocalBasic("selo").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            seloDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
    BasicDB.createDBLocalBasic("simbolo").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            simboloDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

class imagemDB {

    salvarFoto(foto) {
        return new Promise((resolve, reject) => {
            // console.log(foto);

            _.defer(() => downloadImg(foto.url));
            
            resolve();
        //     fotoDB.get(foto.referencia).then((result) => {
        //         produto._id = result._id;
        //         produto._rev = result._rev;
        //         localDB.put(produto).then(() => {
        //             resolve();
        //         });
        //     }).catch((error) => {
        //         if (error.status === 404) {
        //             produto._id = produto.referencia;
        //             localDB.put(produto).then(() => {
        //                 resolve();
        //             });
        //         } else {
        //             reject(error);
        //         }
        //     });
        });
    }

}

export default new imagemDB();