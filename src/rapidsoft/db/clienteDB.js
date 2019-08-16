import PouchDB from 'pouchdb'

let dataBase = new PouchDB('meepo-cliente')
let type = "cliente";

const clienteDB = {

    // salvar: (cliente) => {
    //     cliente.type = type;
    //     cliente._id = cliente.cpfCnpj.replace(/[^a-z0-9]/gi, "");
    //     return new Promise((resolve, reject) => {
    //         dataBase.put(cliente).then((result) => {
    //             resolve(result);
    //         }).catch((erro) => {
    //             reject(erro);
    //         });
    //     }); 
    // },

    validarObjetoDB: (cliente) => {
        
        console.log(cliente);
        
    }

};

clienteDB.salvar = (cliente) => {
    cliente.type = type;
    cliente._id = cliente.cpfCnpj.replace(/[^a-z0-9]/gi, "");
    return new Promise((resolve, reject) => {
        clienteDB.validarObjetoDB((cliente) => {

            dataBase.put(cliente).then((result) => {
                resolve(result);
            }).catch((erro) => {
                reject(erro);
            });
        })
    }); 
};

export default clienteDB
