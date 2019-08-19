import PouchDB from 'pouchdb'

let dataBase = new PouchDB('meepo-cliente')
let type = "cliente";

const validarObjetoDB = (cliente) => {
    return new Promise((resolve, reject) => {
        if (cliente.cpfCnpj === undefined || cliente.cpfCnpj.length < 14) {
            reject({campo: "cpfCnpj", mensagem: "Campo obrigatório!"});
        }
        if (cliente.nome === undefined) {
            reject({campo: "nomeCliente", mensagem: "Campo obrigatório!"});
        }
        if (cliente.pessoaJuridica) {
            if (cliente.razaoSocial === undefined) {
                reject({campo: "razaoSocial", mensagem: "Campo obrigatório!"});
            }
            if (cliente.dataFundacao === undefined) {
                reject({campo: "dataFundacao", mensagem: "Campo obrigatório!"});
            }
            if (cliente.inscricaoEstadual === undefined) {
                reject({campo: "inscricaoEstadual", mensagem: "Campo obrigatório!"});
            }
        } else {
            if (cliente.razaoSocial === undefined) {
                cliente.razaoSocial = cliente.nome;
            }
            if (cliente.dataAniversario === undefined) {
                reject({campo: "dataAniversario", mensagem: "Campo obrigatório!"});
            }
            if (cliente.registroGeral === undefined) {
                reject({campo: "registroGeral", mensagem: "Campo obrigatório!"});
            }
        }
       
        if (cliente.segmentos === undefined && cliente.segmentos.length >= 1) {
            reject({campo: "segmento", mensagem: "Campo obrigatório, informe ao menos 1 Segmento!"});
        }
        if (cliente.emailNfe === undefined && !(cliente.emailNfe.includes("@") && cliente.emailNfe.includes(".com"))) {
            reject({campo: "emailNfe", mensagem: "Campo obrigatório!"});
        }
        // if (cliente.nome === undefined) {
        //     reject({campo: "nomeCliente", mensagem: "Campo obrigatório!"});
        // }
        // if (cliente.nome === undefined) {
        //     reject({campo: "nomeCliente", mensagem: "Campo obrigatório!"});
        // }
        // if (cliente.nome === undefined) {
        //     reject({campo: "nomeCliente", mensagem: "Campo obrigatório!"});
        // }
        resolve(cliente);
    });
}

class clienteDB {

    salvar(cliente) {
        return new Promise((resolve, reject) => {
            validarObjetoDB(cliente).then((result) => {
                result.type = type;
                result._id = result.cpfCnpj.replace(/[^a-z0-9]/gi, "");
        
                dataBase.put(cliente).then((result) => {
                    resolve(result);
                }).catch((erro) => {
                    reject(erro);
                });
            }).catch((erro) => {
                reject(erro)
            });
        });
    }

    listar() {
        return new Promise((resolve, reject) => {
            let clientes = []
            dataBase.allDocs({include_docs: true, attachments: true}).then((result) => {
                for (let index = 0; index < result.rows.length; index++) {
                    clientes.push(result.rows[index].doc)
                }
                resolve(clientes);
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

    findById(idCliente) {
        return new Promise((resolve, reject) => {
            dataBase.get(idCliente).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

}

export default new clienteDB();
