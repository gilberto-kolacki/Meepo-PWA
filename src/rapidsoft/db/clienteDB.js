import PouchDB from 'pouchdb';
import _ from 'lodash';

let dataBase = new PouchDB('meepo-cliente')
const validarEnderecoDB = (endereco) => {
    let retorno = {
        mensagem : "Campo obrigatório!"
    }
    if (endereco.cep === undefined || endereco.cep === "") {
        retorno.campo = "cepEndereco"
        return retorno;
    }
    if (endereco.endereco === undefined || endereco.endereco === "") {
        retorno.campo = "endereco"
        return retorno;
    }
    if (endereco.numero === undefined || endereco.numero === "") {
        retorno.campo = "numeroEndereco"
        return retorno;
    }
    if(endereco.bairro === undefined || endereco.bairro === ""){
        retorno.campo = "bairro"
        return retorno;
    }
    if(endereco.cidade === undefined || endereco.cidade === ""){
        retorno.campo = "cidade"
        return retorno;
    }
    if(endereco.estado === undefined || endereco.estado === ""){
        retorno.campo = "estado"
        return retorno
    }
    if(endereco.telefone === undefined || endereco.telefone === ""){
        retorno.campo = "enderecoTelefone"
        return retorno;
    }
    return true;
}
const validarContatoDB = (contato) => {
    let retorno = {
        mensagem : "Campo obrigatório!"
    }
    return new Promise((resolve, reject) => {
        if (contato.nome === undefined || contato.nome === ""){
            retorno.campo = "nomeContato"
            reject(retorno);
        }
        if (contato.funcao === undefined || contato.funcao === ""){
            retorno.campo = "funcao"
            reject(retorno);
        }
        if (contato.telefone === undefined || contato.telefone === ""){
            retorno.campo = "telefoneContato"
            reject(retorno);
        }
        if (contato.celular === undefined || contato.celular === ""){
            retorno.campo = "celularContato"
            reject(retorno);
        }
        if (contato.email === undefined || contato.email === ""){
            retorno.campo = "emailContato"
            reject(retorno);
        }
        resolve(contato);
    });
}

const validarObjetoDB = (cliente) => {
    return new Promise((resolve, reject) => {
        console.log(cliente);
        let retorno = {
            mensagem : "Campo obrigatório!"
        }
        if (cliente.cpfCnpj === undefined || cliente.cpfCnpj.length < 14 || cliente.cpfCnpj === "") {
            retorno.campo = "cpfCnpj"
            reject(retorno);
        }
        if (cliente.nome === undefined || cliente.nome === "") {
            reject({campo: "nomeCliente", mensagem: "Campo obrigatório!"});
        }
        if(cliente.emailNfe === undefined || cliente.emailNfe === "") {
            reject({campo: "emailNfe", mensagem: "Campo obrigatório!"})
        }
        if (cliente.pessoaJuridica) {
            if (cliente.razaoSocial === undefined || cliente.razaoSocial === "") {
                reject({campo: "razaoSocial", mensagem: "Campo obrigatório!"});
            }
            if (cliente.dataFundacao === undefined || cliente.dataFundacao === "") {
                reject({campo: "dataFundacao", mensagem: "Campo obrigatório!"});
            }
            if (cliente.inscricaoEstadual === undefined || cliente.inscricaoEstadual === "") {
                reject({campo: "inscricaoEstadual", mensagem: "Campo obrigatório!"});
            }
        } else {
            if (cliente.razaoSocial === undefined) {
                cliente.razaoSocial = cliente.nome;
            }
            if (cliente.dataAniversario === undefined || cliente.dataAniversario === "") {
                reject({campo: "dataAniversario", mensagem: "Campo obrigatório!"});
            }
            if (cliente.registroGeral === undefined || cliente.registroGeral === "") {
                reject({campo: "registroGeral", mensagem: "Campo obrigatório!"});
            }
        }
        if (cliente.segmentos === undefined && cliente.segmentos.length >= 1) {
            reject({campo: "segmento", mensagem: "Campo obrigatório, informe ao menos 1 Segmento!"});
        }
        if (cliente.emailNfe === undefined && !(cliente.emailNfe.includes("@") && cliente.emailNfe.includes(".com")) || cliente.emailNfe === "") {
            reject({campo: "emailNfe", mensagem: "Campo obrigatório!"});
        }
         if(cliente.grupoCliente === undefined){
            reject({campo: "grupoCliente", mensagem: "Campo obrigatório!"})
        }
        let validarEndereco = validarEnderecoDB(cliente.endereco);
        if(!_.isEmpty(validarEndereco)){
            reject(validarEndereco);
        }
        if (!(_.isArray(cliente.contatos) && cliente.contatos.length >= 1)) {
            reject({mensagem: "É Nescessário adicionar ao menos um contato!"});
        }
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
                    let cliente = _.cloneDeep(result.rows[index].doc);

                    if (_.isUndefined(cliente.endereco) || (_.isObject(cliente.endereco) && _.isUndefined(cliente.endereco.cep))) {
                        cliente.endereco = {};
                        cliente.endereco.cidade = "";
                        cliente.endereco.estado = "";
                    }
                    clientes.push(cliente)
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

    deletar(idCliente) {
        return new Promise((resolve, reject) => {
            dataBase.remove(idCliente).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

    validarContato(contato) {
        return new Promise((resolve, reject) => {
            validarContatoDB(contato).then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            })
        });
    }

}

export default new clienteDB();
