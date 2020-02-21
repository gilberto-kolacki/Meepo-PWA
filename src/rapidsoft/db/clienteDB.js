/*=========================================================================================
  File Name: clienteDB.js
  Description: Classe de banco de cliente
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

// import PouchDB from 'pouchdb';
import BasicDB from './basicDB';
import _ from 'lodash';

const validarContatoDB = (contato) => {
    return new Promise((resolve, reject) => {
        let retorno = {
            mensagem : "Campo obrigatório!"
        };
        if (contato.nome == undefined || contato.nome === ""){
            retorno.campo = "nomeContato";
            reject(retorno);
        }
        else if (contato.cargo == undefined || contato.cargo === ""){
            retorno.campo = "cargo";
            reject(retorno);
        }
        else if (contato.celular == undefined || contato.celular === ""){
            retorno.campo = "celularContato";
            reject(retorno);
        } else {
            resolve(contato);
        }
    });
};

const validarEnderecoDB = (endereco, opcao) => {
        let retorno = {
            mensagem : "Campo obrigatório!"
        };
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
};

const validarObjetoDB = (cliente) => {
    return new Promise((resolve, reject) => {
        let retorno = {
            mensagem : "Campo obrigatório!"
        };
        // let validarEndereco = validarEnderecoDB(cliente.endereco, 1);
        if (cliente.cpfCnpj === undefined || cliente.cpfCnpj.length < 14 || cliente.cpfCnpj === "") {
            retorno.campo = "cpfCnpj";    
            reject(retorno);
        }
        else if (cliente.cpfCnpj && cliente.cpfCnpj.length > 14) {
            cliente.pessoaJuridica = true;
            if (cliente.razaoSocial === undefined || cliente.razaoSocial === "") {
                retorno.campo = "razaoSocial";
                reject(retorno);
            }
            else if (cliente.nomeFantasia === undefined || cliente.nomeFantasia === "") {
                retorno.campo = "fantasia";
                reject(retorno);
            }
            else if (cliente.dataFundacao === undefined || cliente.dataFundacao === "") {
                retorno.campo = "dataFundacao";
                reject(retorno);
            }
            else if (cliente.inscricaoEstadual === undefined || cliente.inscricaoEstadual === "") {
                retorno.campo = "inscricaoEstadual";
                reject(retorno);
            }
        } else {
            if (cliente.nome === undefined || cliente.nome === "") {
                retorno.campo = "nomeCliente";
                reject(retorno);
            }
            else if (cliente.dataAniversario === undefined || cliente.dataAniversario === "") {
                retorno.campo = "dataAniversario";
                reject(retorno);
            }
            // else if (cliente.registroGeral === undefined || cliente.registroGeral === "") {
            //     retorno.campo = "registroGeral";
            //     reject(retorno);
            // }
            cliente.pessoaJuridica = false;
            if (cliente.razaoSocial === undefined) {
                cliente.razaoSocial = cliente.nome;
            }
        }
        if (cliente.segmentos[0] === undefined && cliente.segmentos[1] === undefined) {
            reject({campo: "segmento", mensagem: "Campo obrigatório, informe ao menos 1 Segmento!"});
        }
        else if (cliente.emailNfe === undefined || (!(cliente.emailNfe.includes("@") && cliente.emailNfe.includes(".com"))) ) {
            retorno.campo = "emailNfe";
            reject(retorno);
        }
        else if (cliente.endereco.telefone === undefined || cliente.endereco.telefone === "") {
            retorno.campo = "enderecoTelefone";
            reject(retorno);
        }
        else if (cliente.endereco.cep === undefined || cliente.endereco.cep === "") {
            retorno.campo = "cepEndereco";
            reject(retorno);
        }
        else if (cliente.endereco.endereco === undefined || cliente.endereco.endereco === "") {
            retorno.campo = "endereco";
            reject(retorno);
        }
        else if (cliente.endereco.numero === undefined || cliente.endereco.numero === "") {
            retorno.campo = "numeroEndereco";
            reject(retorno);
        }
        else if (cliente.endereco.bairro === undefined || cliente.endereco.bairro === "") {
            retorno.campo = "bairro";
            reject(retorno);
        }
        else if (cliente.endereco.cidade === undefined || cliente.endereco.cidade === "") {
            retorno.campo = "cidade";
            reject(retorno);
        }
        else if (cliente.endereco.estado === undefined || cliente.endereco.estado === "") {
            retorno.campo = "estado";
            reject(retorno);
        }

        else if (cliente.grupoCliente === undefined) {
            retorno.campo = "grupoCliente";
            reject(retorno);
        }
        // else if (!_.isEmpty(validarEndereco)){
        //     reject(validarEndereco);
        // }
        else if (!(_.isArray(cliente.imagens) && cliente.imagens.length >= 1)){
            reject({mensagem: "É necessário adicicionar ao menos uma imagem!"});
        }
        else if (cliente.imagens.length > 5){
            reject({mensagem: "É necessário remover uma ou mais imagens(Máximo 5 imagens)"});
        }
        else if (!(_.isArray(cliente.contatos) && cliente.contatos.length >= 1)) {
            reject ({mensagem: "É necessário adicionar ao menos um contato!"});
        } else {
            resolve(cliente);
        }
        // else if (!(_.isArray(cliente.enderecos) && cliente.enderecos.length >= 1)) {
        //     reject ({mensagem: "É necessário adicionar ao menos um endereço!"});
        // }
    });
};

class clienteDB extends BasicDB {

    constructor() {
        super("cliente", true);
        this.indexes = ['endereco.idCidade', 'endereco.estado', 'cpfCnpj', 'nome'];
        this._createIndexes(this.indexes, 'search');
        this._createIndex('clienteErp');
        this._createIndex('alterado');
    }

    salvar(cliente) {
        return new Promise((resolve, reject) => {
            validarObjetoDB(cliente).then((resultCliente) => {
                resultCliente.id = resultCliente.cpfCnpj.replace(/[^a-z0-9]/gi, "");
                resultCliente.alterado = true;
                resultCliente.endereco.cep = resultCliente.endereco.cep.replace(/[^a-z0-9]/gi, "");
                if (resultCliente.nome == null) {
                    resultCliente.nome = resultCliente.nomeFantasia;
                }
                this._salvar(resultCliente).then((result) => {
                    resolve(result);
                }).catch((erro) => {
                    this._criarLogDB({url:'db/clienteDB',method:'salvar().validarObjetoDB',message: erro,error:'Failed Request'});
                    reject(erro);
                });
            }).catch((erro) => {
                this._criarLogDB({url:'db/clienteDB',method:'salvar',message: erro,error:'Failed Request'});
                reject(erro);
            });
        });
    }

    adicionarEnderecoSincronizado(endereco,idCliente) {
        return new Promise((resolve) => {
            this._getById(idCliente,true).then((clienteById) => {
                if (clienteById.existe) {
                    clienteById.value.enderecos.push(endereco);
                    clienteById.value.clienteAlterado = true;
                    this._salvar(clienteById.value).then(() => {
                        resolve();
                    });
                }
            });
        });
    }

    getExistClienteNome(contatosList, contatoSave) { 
        return _.find(contatosList, (contato) => contato.nome == contatoSave.nome);
    }

    removeContatoAntigo(contatosList, contatoSave, indexEdit) {
        if (this.getExistClienteNome(contatosList, contatoSave)){
            contatosList.splice(indexEdit, 1);
        }
        return contatosList;
    }

    setContatosList(contatosList, contatoSave, indexEdit) {
        return new Promise((resolve) => {
            contatosList = this.removeContatoAntigo(contatosList, contatoSave, indexEdit);
            contatosList.push({
                nome: contatoSave.nome,
                cargo: contatoSave.cargo,
                celular: contatoSave.celular,
                email: contatoSave.email,
                telefone: contatoSave.telefone,
            });
            resolve(contatosList);
        });
    }

    adicionarContatoSincronizado(contato,idCliente,indexEdit = null) {
        return new Promise((resolve) => {
            this._getById(idCliente,true).then((clienteById) => {
                if (clienteById.existe) {
                    this.setContatosList(clienteById.value.contatos, contato, indexEdit).then((contatos) => {
                        clienteById.value.contatos = contatos;
                    });
                    clienteById.value.clienteAlterado = true;
                    this._salvar(clienteById.value).then(() => {
                        resolve(clienteById.value.contatos);
                    });

                }
            });
        });
    }

    atualizaEnderecoEntrega(cliente) {
        return new Promise((resolve) => {
            this._getById(cliente._id,true).then((clienteById) => {
                if (clienteById.existe) {
                    clienteById.value.enderecos.map((endereco,index) => {
                        endereco['principal'] = cliente.enderecos[index].principal
                    });
                    clienteById.value.clienteAlterado = true; 
                    this._salvar(clienteById.value).then(() => {
                        resolve();
                    });
                }
            })
            
        });

    }

    salvarSinc(cliente) {
        return new Promise((resolve) => {
            cliente.id = cliente.cpfCnpj.replace(/[^a-z0-9]/gi, "");
            if (cliente.enderecos.length == 0 && cliente.endereco) {
                const enderecoEntrega = Object.assign({}, cliente.endereco);
                enderecoEntrega.endEntrega = true;
                cliente.enderecos.push(enderecoEntrega);
            }
            if (cliente.nome == null) {
                cliente.nome = (cliente.nomeFantasia ? cliente.nomeFantasia : cliente.razaoSocial).toUpperCase();
            }
            cliente.clienteErp = true;
            cliente.clienteAlterado = false;
            this._salvar(cliente).then(() => {
                resolve();
            }).catch((erro) => {
                this._criarLogDB({url:'db/clienteDB', method:'salvarSinc', message: erro, error:'Failed Request'});
                resolve();
            });
        });
    }
    listarConsulta() {
        return new Promise((resolve) => {
            this._getFindCondition({cpfCnpj : {$gte : null}}).then((clientes) => {
                clientes = clientes.map((cliente) => {
                    return {
                        id: cliente._id, 
                        cpfCnpj: cliente.cpfCnpj, 
                        nome: cliente.nome, 
                        cidade: cliente.endereco.cidade, 
                        estado: cliente.endereco.estado,
                        inadimplente: cliente.inadimplente,
                        ativo: cliente.ativo,
                        clienteErp: cliente.clienteErp
                    };
                });
                resolve(clientes);
            });
        });
    }

    listar() {
        return new Promise((resolve) => {
            this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                resolve(resultDocs.rows.map((cliente) => {
                    if (_.isUndefined(cliente.doc.endereco) || (_.isObject(cliente.doc.endereco) && _.isUndefined(cliente.doc.endereco.cep))) {
                        cliente.doc.endereco = {};
                        cliente.doc.endereco.cidade = "";
                        cliente.doc.endereco.estado = "";
                    }
                    return _.clone(cliente.doc);
                }));
            }).catch((err) => {
                this._criarLogDB({url:'db/clienteDB',method:'listar',message: err,error:'Failed Request'});
                resolve(err);
            });
        });
    }

    findById(idCliente) {
        return new Promise((resolve) => {
            this._localDB.get(idCliente).then((result) => {
                result.dataAniversario = new Date(Number(result.dataAniversario));
                result.dataFundacao = new Date(Number(result.dataFundacao));
                result.inscricaoEstadual = result.inscricaoEstadual == "" ? "ISENTO" : result.inscricaoEstadual;
                resolve(result);
            });
        });
    }

    deletar(idCliente) {
        
        return new Promise((resolve, reject) => {
            // this._localDB.remove(idCliente).then((result) => {
            //     resolve(result);
            // }).catch((err) => {
            //     this._criarLogDB({url:'db/clienteDB',method:'deletar',message: err,error:'Failed Request'});
            //     reject(err);
            // });
            this._deletar(idCliente).then((result) => {
                resolve(result);
            }).catch((err) => {
                this._criarLogDB({url:'db/clienteDB',method:'deletar',message: err,error:'Failed Request'});
                reject(err);
            });
        });
    }

    validarContato(contato) {
        return new Promise((resolve, reject) => {
            validarContatoDB(contato).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
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

    buscaClientesSinc() {
        return new Promise((resolve) => {
            if (this._localDB) {
                this._localDB.find({
                    selector: {
                        clienteAlterado: {$eq: true}
                    },
                }).then((result) => {
                    resolve(result.docs);
                });
            } else {
                resolve([]);
            }
        });
    }

    getClientesSearch(uf, idCidade, cnpjCpf, nome) {
        return new Promise((resolve) => {
            cnpjCpf = cnpjCpf ? cnpjCpf.replace(/[^a-z0-9]/gi, "") : null;
            nome = nome ? nome.toUpperCase() : nome;

            let selectorFilter = null;
            if (idCidade > 0 && cnpjCpf != null && nome != null) {
                selectorFilter = {'endereco.idCidade': {$eq: idCidade}, 'endereco.estado': {$eq: uf}, 'nome': {$regex: nome}, 'cpfCnpj': {$regex: cnpjCpf}};
            } else if (idCidade > 0 && cnpjCpf != null) {
                selectorFilter = {'endereco.idCidade': {$eq: idCidade}, 'endereco.estado': {$eq: uf}, 'cpfCnpj': {$regex : cnpjCpf}, 'nome': {$gte: nome}};
            } else if (idCidade > 0 && nome != null) {
                selectorFilter = {'endereco.idCidade': {$eq: idCidade}, 'endereco.estado': {$eq: uf}, 'cpfCnpj': {$gte: cnpjCpf}, 'nome': {$regex: nome}};            
            } else if (idCidade > 0) {
                selectorFilter = {'endereco.idCidade': {$eq: idCidade}, 'endereco.estado': {$eq: uf}};
            } else if (idCidade == 0 && cnpjCpf != null && nome != null) {
                selectorFilter = {'endereco.idCidade': {$gte: idCidade}, 'endereco.estado': {$eq: uf}, 'nome': {$regex: nome}, 'cpfCnpj': {$regex: cnpjCpf}};
            } else if (idCidade == 0 && cnpjCpf != null) {
                selectorFilter = {'endereco.idCidade': {$gte: idCidade}, 'endereco.estado': {$eq: uf}, 'cpfCnpj': {$regex : cnpjCpf}, 'nome': {$gte: nome}};
            } else if (idCidade == 0 && nome != null) {
                selectorFilter = {'endereco.idCidade': {$gte: idCidade}, 'endereco.estado': {$eq: uf}, 'cpfCnpj': {$gte: cnpjCpf}, 'nome': {$regex : nome}};
            } else {
                selectorFilter = {'endereco.idCidade': {$gte: idCidade}, 'endereco.estado': {$eq: uf}};
            }

            this._localDB.find({
                selector: selectorFilter,
                fields: ['id', 'cpfCnpj', 'nome', 'endereco', 'inadimplente', 'ativo'],
            }).then((result) => {
                resolve(result.docs);
            });
        });
    }

    getClientesPedidos(pedidos) {
        return new Promise((resolve) => {
            const newPedidos = [];
            const done = _.after(pedidos.length, () => resolve(newPedidos));
            pedidos.forEach(pedido => {
                this._getById(pedido.cliente.id).then((cliente) => {
                    pedido.cliente = cliente.value;
                    newPedidos.push(pedido);
                    done();
                });
            });
            
            resolve(newPedidos);
        });
    }

    _sincNuvem() {
        return new Promise((resolve) => {
            if (window.navigator.onLine && this._remoteDB) {
                this._sincToNuvem().then(() => {
                    this._sincFromNuvem().then(() => {
                        resolve();        
                    });
                });
            } else {
                resolve();
            }
        });
    }

    getCidadesComClientes(estado) {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {'endereco.estado': {$eq: estado}},
                fields: ['endereco'],
            }).then((result) => {
                const cidades = result.docs.map((cliente) => {return {idCidade: cliente.endereco.idCidade, nome: cliente.endereco.cidade.toUpperCase()};});
                resolve(_.uniqBy(cidades,'idCidade'));
            });
        });
    }

}

export default new clienteDB();