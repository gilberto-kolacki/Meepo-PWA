/*=========================================================================================
  File Name: clienteDB.js
  Description: Classe de banco de cliente
  ----------------------------------------------------------------------------------------
  Author: Giba
==========================================================================================*/

// import PouchDB from 'pouchdb';
import BasicRemoteDB from './basicRemoteDB';
import After from 'lodash/after';
import UniqBy from 'lodash/uniqBy';
import IsArray from 'lodash/isArray';
import IsNil from 'lodash/isNil';
import IsObject from 'lodash/isObject';
import Clone from 'lodash/clone';

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
            else if (cliente.dataFundacao === undefined || (!cliente.clienteErp && cliente.dataFundacao === "")) {
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
            else if (cliente.dataAniversario === undefined || (!cliente.clienteErp && cliente.dataAniversario === "")) {
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
        if (!cliente.clienteErp && cliente.segmentos[0] === undefined && cliente.segmentos[1] === undefined) {
            reject({campo: "segmento", mensagem: "Campo obrigatório, informe ao menos 1 Segmento!"});
        }
        else if (cliente.emailNfe === undefined || (!cliente.clienteErp && !(cliente.emailNfe.includes("@") && cliente.emailNfe.includes(".com"))) ) {
            retorno.campo = "emailNfe";
            reject(retorno);
        }
        else if (cliente.endereco.telefone === undefined || (!cliente.clienteErp && cliente.endereco.telefone === "")) {
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
        else if (!cliente.clienteErp && !(IsArray(cliente.imagens) && cliente.imagens.length >= 1)){
            reject({mensagem: "É necessário adicicionar ao menos uma imagem!"});
        }
        else if (cliente.imagens && cliente.imagens.length > 5){
            reject({mensagem: "É necessário remover uma ou mais imagens(Máximo 5 imagens)"});
        }
        else if (!cliente.clienteErp && !(IsArray(cliente.contatos) && cliente.contatos.length >= 1)) {
            reject ({mensagem: "É necessário adicionar ao menos um contato!"});
        } else {
            resolve(cliente);
        }
    });
};

class clienteDB extends BasicRemoteDB {

    constructor() {
        super("cliente");
        this.indexes = ['endereco.idCidade', 'endereco.estado', 'cpfCnpj', 'nome'];
        this._createIndexes(this.indexes, 'search');
        this._createIndex('clienteErp');        
        this._createIndex('endereco.estado');
    }

    salvar(cliente) {
        return new Promise((resolve, reject) => {
            try {
                validarObjetoDB(cliente).then((resultCliente) => {
                    resultCliente.alterado = true;
                    this._salvar(resultCliente).then((result) => {
                        resultCliente.id=result.id;
                        resultCliente._rev=result._rev;
                        resolve(resultCliente);
                    }).catch((error) => {
                        this._criarLogDB({url:'db/clienteDB',method:'salvar',message: error,error:'Failed Request'});
                        reject(error);
                    });
                }).catch((error) => {
                    this._criarLogDB({url:'db/clienteDB',method:'salvar',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch(error) {
                this._criarLogDB({url:'db/clienteDB',method:'salvar',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    salvarSinc(cliente) {
        return new Promise((resolve, reject) => {
            try {
                cliente.id = cliente.cpfCnpj.replace(/[^a-z0-9]/gi, "");
                
                if ((!cliente.enderecos || cliente.enderecos === null) && cliente.endereco && cliente.endereco !== null) {
                    const enderecoEntrega = Object.assign({}, cliente.endereco);
                    enderecoEntrega.endEntrega = true;
                    cliente.enderecos = [];
                    cliente.enderecos.push(enderecoEntrega);
                }

                if (cliente.nome == null) {
                    cliente.nome = (cliente.razaoSocial ? cliente.razaoSocial : cliente.nomeCliente).toUpperCase();
                }
                
                cliente.clienteErp = true;
                cliente.alterado = false;

                cliente.enderecos.map((endereco) => {
                    endereco.enderecoErp = true;
                    return endereco;
                });

                cliente.contatos.map((contato) => {
                    contato.contatoErp = true;
                    return contato;
                });

                validarObjetoDB(cliente).then(() => {
                    this._salvar(cliente).then(() => {
                        resolve();
                    }).catch((error) => {
                        this._criarLogDB({url:'db/clienteDB',method:'salvarSinc',message: 'Erro ao integrar o cliente '+cliente.cpfCnpj,error:error});
                        resolve();
                    });
                }).catch((error) => {
                    this._criarLogDB({url:'db/clienteDB',method:'salvarSinc',message: 'Erro ao integrar o cliente '+cliente.cpfCnpj,error:error});
                    resolve();
                });
            } catch (error) {
                this._criarLogDB({url:'db/clienteDB',method:'salvarSinc',message: 'Erro ao integrar o cliente '+cliente.cpfCnpj,error:error});
                reject(error);
            }
            
        });
    }
    
    listarConsulta() {
        return new Promise((resolve, reject) => {
            try {
                this._getFindCondition({cpfCnpj : {$ne : null}}).then((clientes) => {
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
                }).catch((error) => {
                    this._criarLogDB({url:'db/clienteDB',method:'listarConsulta',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/clienteDB',method:'listarConsulta',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    listar() {
        return new Promise((resolve, reject) => {
            try {
                this._localDB.allDocs({include_docs: true}).then((resultDocs) => {
                    resolve(resultDocs.rows.map((cliente) => {
                        if (IsNil(cliente.doc.endereco) || (IsObject(cliente.doc.endereco) && IsNil(cliente.doc.endereco.cep))) {
                            cliente.doc.endereco = {};
                            cliente.doc.endereco.cidade = "";
                            cliente.doc.endereco.estado = "";
                        }
                        return Clone(cliente.doc);
                    }));
                }).catch((error) => {
                    this._criarLogDB({url:'db/clienteDB',method:'listar',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/clienteDB',method:'listar',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    findById(idCliente) {
        return new Promise((resolve, reject) => {
            try {
                this._getById(idCliente,true).then((result) => {
                    if (result.existe) {
                        const cliente = result.value;
                        cliente.inscricaoEstadual = cliente.inscricaoEstadual == "" ? "ISENTO" : cliente.inscricaoEstadual;
                        resolve(cliente);
                    } else {
                        resolve(null);
                    }
                }).catch((error) => {
                    this._criarLogDB({url:'db/clienteDB',method:'findById',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/clienteDB',method:'findById',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    deletar(idCliente) {
        return new Promise((resolve, reject) => {
            try {
                this._deletar(idCliente).then((result) => {
                    resolve(result);
                    // TODO (Luiz): Removido para testar a aplicação sem sincronizar base local com a nuvem
                    /* this._remoteDB.get(idCliente).then((objectRemote) => {
                        this._remoteDB.remove(objectRemote).then(() => {
                            resolve(result);
                        });
                    }); */
                }).catch((error) => {
                    this._criarLogDB({url:'db/clienteDB',method:'deletar',message: error,error:'Failed Request'});
                    reject(error);
                });
            } catch (error) {
                this._criarLogDB({url:'db/clienteDB',method:'deletar',message: error,error:'Failed Request'});
                reject(error);
            }
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
            try {
                let validarEndereco = validarEnderecoDB(endereco);
                if (validarEndereco.mensagem === undefined) {
                    resolve(validarEndereco);
                } else {
                    throw validarEndereco;
                }
            } catch (error) {
                this._criarLogDB({url:'db/clienteDB',method:'validarEndereco',message: error,error:'Failed Request'});
                reject(error);
            }
        });
    }

    buscaClientesSinc() {
        return new Promise((resolve) => {
            if (this._localDB) {
                this._localDB.find({
                    selector: {
                        alterado: {$eq: true}
                    },
                }).then((result) => {
                    const clientesSinc = result.docs.map((cliente) => {
                        delete cliente.alterado;
                        return cliente;
                    });
                    resolve(clientesSinc);
                });
            } else {
                resolve([]);
            }
        });
    }

    getClientesSearch(uf, idCidade, cnpjCpf, nome) {
        return new Promise((resolve, reject) => {
            try {
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
                    selectorFilter = {'endereco.estado': {$eq: uf}, 'nome': {$regex: nome}, 'cpfCnpj': {$regex: cnpjCpf}};
                } else if (idCidade == 0 && cnpjCpf != null) {
                    selectorFilter = {'endereco.estado': {$eq: uf}, 'cpfCnpj': {$regex : cnpjCpf}, 'nome': {$gte: nome}};
                } else if (idCidade == 0 && nome != null) {
                    selectorFilter = {'endereco.estado': {$eq: uf}, 'cpfCnpj': {$gte: cnpjCpf}, 'nome': {$regex : nome}};
                } else {
                    selectorFilter = {'endereco.estado': {$eq: uf}};
                }

                this._localDB.find({
                    selector: selectorFilter,
                    fields: ['id', 'cpfCnpj', 'nome', 'endereco', 'inadimplente', 'ativo'],
                }).then((result) => {
                    const clientes = result.docs.map((cliente) => {
                        return { 
                            id: cliente.id, 
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
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    getClientesPedidos(pedidos) {
        return new Promise((resolve) => {
            const newPedidos = [];
            if (pedidos && pedidos.length > 0) {
                const done = After(pedidos.length, () => resolve(newPedidos));
                pedidos.forEach(pedido => {
                    this._getById(pedido.cliente.id).then((cliente) => {
                        if (cliente.existe) {
                            pedido.cliente = cliente.value;
                        }
                        newPedidos.push(pedido);
                        done();
                    });
                });
            } else {
                resolve(newPedidos);
            }
        });
    }
   
    getEstadosComClientes() {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {'endereco.estado': {$gt: 0}},
                fields: ['endereco.estado'],
            }).then((result) => {
                resolve(UniqBy(result.docs,'endereco.estado'));
            });
        });
    }

    getCidadesComClientes(estado) {
        return new Promise((resolve) => {
            this._localDB.find({
                selector: {'endereco.estado': {$eq: estado}},
                fields: ['endereco'],
            }).then((result) => {
                const cidades = result.docs.map((cliente) => {return {idCidade: cliente.endereco.idCidade, nome: cliente.endereco.cidade.toUpperCase()};});
                resolve(UniqBy(cidades,'idCidade'));
            });  
        });
    }

    getCouchDB() {
        return new Promise((resolve) => {
            this._sincFromNuvem().then(() => {
                resolve();
            });
        });
    }

}

export default new clienteDB();