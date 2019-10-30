/*=========================================================================================
  File Name: clienteDB.js
  Description: Classe de banco de cliente
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;
let remoteDB = null;

const createDB = () => {
    BasicDB.createDBLocal("cliente").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 1, auto_compaction: true});
            BasicDB.createDBRemote(dataBaseLocal).then((dataBaseRemote) => {
                remoteDB = new PouchDB(dataBaseRemote, {ajax: {cache: false, timeout: 10000 }});
            })
        }
    })
};

createDB();

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

const validarEnderecoDB = (endereco, opcao) => {
        let retorno = {
            mensagem : "Campo obrigatório!"
        }
        if (endereco.cep === undefined || endereco.cep === ""){
            retorno.campo = opcao == 1 ? "cepEndereco" : "cadCepEndereco";
            return retorno;
        }
        else if (endereco.endereco === undefined || endereco.endereco === ""){
            retorno.campo = opcao == 1 ? "endereco" : "cadEndereco";
            return retorno;
        }
        else if (endereco.numero === undefined || endereco.numero === ""){
            retorno.campo = opcao == 1 ? "numeroEndereco" : "cadNumeroEndereco";
            return retorno;
        }
        else if (endereco.bairro === undefined || endereco.bairro === ""){
            retorno.campo = opcao == 1 ? "bairro" : "cadBairro";
            return retorno;
        }
        else if (endereco.cidade === undefined || endereco.cidade === ""){
            retorno.campo = opcao == 1 ? "cidade" : "cadCidade";
            return retorno;
        }
        else if (endereco.estado === undefined || endereco.estado === ""){
            retorno.campo = opcao == 1 ? "estado" : "cadEstado";
            return retorno;
        }
        else if (endereco.telefone === undefined || endereco.telefone === ""){
            retorno.campo = opcao == 1 ? "enderecoTelefone" : "cadEnderecoTelefone";
            return retorno;
        } else {
            return endereco;
        }
}

const validarObjetoDB = (cliente) => {
    return new Promise((resolve, reject) => {
        let retorno = {
            mensagem : "Campo obrigatório!"
        }
        let validarEndereco = validarEnderecoDB(cliente.endereco, 1);
        if (cliente.cpfCnpj === undefined || cliente.cpfCnpj.length < 14 || cliente.cpfCnpj === "") {
            retorno.campo = "cpfCnpj"            
            reject(retorno);
        }
        else if (cliente.cpfCnpj && cliente.cpfCnpj.length > 14) {
            cliente.pessoaJuridica = true;
            if (cliente.razaoSocial === undefined || cliente.razaoSocial === "") {
                retorno.campo = "razaoSocial"
                reject(retorno);
            }
            else if (cliente.fantasia === undefined || cliente.fantasia === "") {
                retorno.campo = "fantasia"
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
            if (cliente.nome === undefined || cliente.nome === "") {
                retorno.campo = "nomeCliente"
                reject(retorno);
            }
            else if (cliente.dataAniversario === undefined || cliente.dataAniversario === "") {
                retorno.campo = "dataAniversario"
                reject(retorno);
            }
            else if (cliente.registroGeral === undefined || cliente.registroGeral === "") {
                retorno.campo = "registroGeral"
                reject(retorno);
            }
            cliente.pessoaJuridica = false;
            if (cliente.razaoSocial === undefined) {
                cliente.razaoSocial = cliente.nome;
            }
        }
        if (cliente.segmentos[0].ativo === false && cliente.segmentos[1].ativo === false) {
            reject({campo: "segmento", mensagem: "Campo obrigatório, informe ao menos 1 Segmento!"});
        }
        else if (cliente.emailNfe === undefined || (!(cliente.emailNfe.includes("@") && cliente.emailNfe.includes(".com"))) ) {
            retorno.campo = "emailNfe"
            reject(retorno);
        }
        else if (cliente.endereco.telefone === undefined || cliente.endereco.telefone === "") {
            retorno.campo = "enderecoTelefone"
            reject(retorno);
        }
        else if (cliente.endereco.cep === undefined || cliente.endereco.cep === "") {
            retorno.campo = "cepEndereco"
            reject(retorno);
        }
        else if (cliente.endereco.endereco === undefined || cliente.endereco.endereco === "") {
            retorno.campo = "endereco"
            reject(retorno);
        }
        else if (cliente.endereco.numero === undefined || cliente.endereco.numero === "") {
            retorno.campo = "numeroEndereco"
            reject(retorno);
        }
        else if (cliente.endereco.bairro === undefined || cliente.endereco.bairro === "") {
            retorno.campo = "bairro"
            reject(retorno);
        }
        else if (cliente.endereco.cidade === undefined || cliente.endereco.cidade === "") {
            retorno.campo = "cidade"
            reject(retorno);
        }
        else if (cliente.endereco.estado === undefined || cliente.endereco.estado === "") {
            retorno.campo = "estado"
            reject(retorno);
        }
        else if (cliente.grupoCliente === undefined) {
            retorno.campo = "grupoCliente"
            reject(retorno);
        }
        
        // else if (!_.isEmpty(validarEndereco)){
        //     reject(validarEndereco);
        // }
        else if (!(_.isArray(cliente.imagens) && cliente.imagens.length >= 1)){
            reject({mensagem: "É necessário adicicionar ao menos uma imagem!"})
        }
        else if (cliente.imagens.length > 5){
            reject({mensagem: "É necessário remover uma ou mais imagens(Máximo 5 imagens)"})
        }
        else if (!(_.isArray(cliente.contatos) && cliente.contatos.length >= 1)) {
            reject ({mensagem: "É necessário adicionar ao menos um contato!"});
        }
        else if (!(_.isArray(cliente.enderecos) && cliente.enderecos.length >= 1)) {
                reject ({mensagem: "É necessário adicionar ao menos um endereço!"});
        } else {
            resolve(cliente);
        }
    });
}

class clienteDB {

    salvar(cliente) {
        return new Promise((resolve, reject) => {
            validarObjetoDB(cliente).then((resultCliente) => {
                resultCliente._id = resultCliente.cpfCnpj.replace(/[^a-z0-9]/gi, "");
                localDB.put(resultCliente).then((result) => {
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

    salvarSinc(cliente) {
        return new Promise((resolve) => {
            cliente._id = cliente.cpfCnpj;
            cliente.clienteErp = true
            localDB.put(cliente).then(() => {
                resolve();
            });
        });
    }
    listar() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((cliente) => {
                    if (_.isUndefined(cliente.doc.endereco) || (_.isObject(cliente.doc.endereco) && _.isUndefined(cliente.doc.endereco.cep))) {
                        cliente.doc.endereco = {};
                        cliente.doc.endereco.cidade = "";
                        cliente.doc.endereco.estado = "";
                    }
                    return _.clone(cliente.doc);
                }))
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

    findById(idCliente) {
        return new Promise((resolve, reject) => {
            localDB.get(idCliente).then((result) => {
                result.dataAniversario = new Date(_.toNumber(result.dataAniversario));
                result.dataFundacao = new Date(_.toNumber(result.dataFundacao));
                result.inscricaoEstadual = result.inscricaoEstadual == "" ? "ISENTO" : result.inscricaoEstadual;
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    deletar(idCliente) {
        return new Promise((resolve, reject) => {
            localDB.remove(idCliente).then((result) => {
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
            let validarEndereco = validarEnderecoDB(endereco);
            if (validarEndereco.mensagem === undefined) {
                resolve(validarEndereco);
            } else {
                reject(validarEndereco);
            }
        });
    }

    sincNuvem() {
        return new Promise((resolve) => {
            if (localDB && remoteDB) {
                resolve();
                // localDB.sync(remoteDB).then((result) => {
                //     resolve(result);
                // }).catch((err) => {
                //     console.log(err);
                // })
            }
        });
    }

    createDB(user) {
        return new Promise((resolve) => {
            resolve(createDB(user));
        });
    }

    limparBase() {
        return new Promise((resolve) => {
            localDB.destroy().then(() => {
                createDB();
                resolve();
            }).catch((err) => {
                resolve(err);
            });
        });
    }

    buscaClientesSinc() {
        return new Promise((resolve) => {
            localDB.allDocs({include_docs: true}).then((resultDocs) => {
                const clientes = _.filter(resultDocs.rows, (cliente) => {
                    return cliente.doc.clienteErp === false
                });
                resolve(clientes.map((cliente) => {                    
                    return _.cloneDeep(cliente.doc);
                }))
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        });
    }

}

export default new clienteDB();
