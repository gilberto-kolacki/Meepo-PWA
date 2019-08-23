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
    if (endereco.bairro === undefined || endereco.bairro === ""){
        retorno.campo = "bairro"
        return retorno;
    }
    if (endereco.cidade === undefined || endereco.cidade === ""){
        retorno.campo = "cidade"
        return retorno;
    }
    if (endereco.estado === undefined || endereco.estado === ""){
        retorno.campo = "estado"
        return retorno
    }
    if (endereco.telefone === undefined || endereco.telefone === ""){
        retorno.campo = "enderecoTelefone"
        return retorno;
    }
    return true;
}
const validarContatoDB = (contato) => {
    return new Promise((resolve, reject) => {
        let retorno = {
            mensagem : "Campo obrigatório!"
        }
        if (contato.nome === undefined || contato.nome === ""){
            retorno.campo = "nomeContato"
            reject(retorno);
        }
        else if (contato.funcao === undefined || contato.funcao === ""){
            retorno.campo = "funcao"
            reject(retorno);
        }
        else if (contato.telefone === undefined || contato.telefone === ""){
            retorno.campo = "telefoneContato"
            reject(retorno);
        }
        else if (contato.celular === undefined || contato.celular === ""){
            retorno.campo = "celularContato"
            reject(retorno);
        }
        else if (contato.email === undefined || contato.email === ""){
            retorno.campo = "emailContato"
            reject(retorno);
        }
        resolve(contato);
    });
}

const validarEnderecoEDB = (entrega) => {
    return new Promise((resolve, reject) => {
        let retorno = {
            mensagem : "Campo obrigatório!"
        }
        if (entrega.cep === undefined || entrega.cep === ""){
            retorno.campo = "cadCepEndereco"
            reject(retorno);
        }
        else if (entrega.endereco === undefined || entrega.endereco === ""){
            retorno.campo = "cadEndereco"
            reject(retorno);
        }
        else if (entrega.numero === undefined || entrega.numero === ""){
            retorno.campo = "cadNumeroEndereco"
            reject(retorno);
        }
        else if (entrega.bairro === undefined || entrega.bairro === ""){
            retorno.campo = "cadBairro"
            reject(retorno);
        }
        else if (entrega.cidade === undefined || entrega.cidade === ""){
            retorno.campo = "cadCidade"
            reject(retorno);
        }
        else if (entrega.estado === undefined || entrega.estado === ""){
            retorno.campo = "cadEstado"
            reject(retorno);
        }
        else if (entrega.telefone === undefined || entrega.telefone === ""){
            retorno.campo = "cadEnderecoTelefone"
            reject(retorno);
        }
        resolve(entrega);
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
        else if (cliente.nome === undefined || cliente.nome === "") {
            retorno.campo = "nomeCliente"
            reject(retorno);
        }
        else if (cliente.pessoaJuridica === true) {
            if (cliente.razaoSocial === undefined || cliente.razaoSocial === "") {
                retorno.campo = "razaoSocial"
                reject(retorno);
                        }
            else if (cliente.dataFundacao === undefined || cliente.dataFundacao === "") {
                retorno.campo = "dataFundacao"
                reject(retorno);
            }
            else if (cliente.inscricaoEstadual === undefined || cliente.inscricaoEstadual === "") {
                retorno.campo = "inscricaoEstadual"
                reject(retorno);
            }
        } else {
            if (cliente.razaoSocial === undefined) {
                cliente.razaoSocial = cliente.nome;
            }
            if (cliente.dataAniversario === undefined || cliente.dataAniversario === "") {
                retorno.campo = "dataAniversario"
                reject(retorno);
            }
            else if (cliente.registroGeral === undefined || cliente.registroGeral === "") {
                retorno.campo = "registroGeral"
                reject(retorno);
            }
        }
        if (cliente.segmentos[0].ativo === false && cliente.segmentos[1].ativo === false) {
            //retorno.camp = "segmento"
            //reject(retorno);
            document.getElementById("segmento").focus();
            reject({campo: "segmento", mensagem: "Campo obrigatório, informe ao menos 1 Segmento!"});
        }
        else if (cliente.emailNfe === undefined || (!(cliente.emailNfe.includes("@") && cliente.emailNfe.includes(".com"))) ){
            retorno.campo = "emailNfe"
            reject(retorno);
        }
        else if (cliente.grupoCliente === undefined){
            retorno.campo = "grupoCliente"
            //reject({campo: "grupoCliente", mensagem: "Campo obrigatório!"})
            reject(retorno);
        }
        let validarEndereco = validarEnderecoDB(cliente.endereco);
        if (!_.isEmpty(validarEndereco)){
            reject(validarEndereco);
        }
        if (!(_.isArray(cliente.contatos) && cliente.contatos.length >= 1)) {
            reject ({mensagem: "É necessário adicionar ao menos um contato!"});
        }
        resolve(cliente);
    });
}

class clienteDB {

    salvar(cliente) {
        return new Promise((resolve, reject) => {
            validarObjetoDB(cliente).then((result) => {
                result._id = result.cpfCnpj.replace(/[^a-z0-9]/gi, "");
                dataBase.put(cliente).then((result) => {
                    resolve(result);
                }).catch((erro) => {
                    console.log(erro);
                    
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
                reject(err);
            });
        });
    }

    findById(idCliente) {
        return new Promise((resolve, reject) => {
            dataBase.get(idCliente).then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
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

    validarEndereco(endereco) {
        return new Promise((resolve, reject) => {
            validarEnderecoEDB(endereco).then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            })
        });
    }

}

export default new clienteDB();
