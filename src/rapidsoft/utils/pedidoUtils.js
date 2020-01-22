import _ from "lodash";
import Storage from '../utils/storage';

const validarPedido = (pedido) => {
    return new Promise((resolve, reject) => {
        try {
            if (_.isNil(pedido.cliente) || pedido.cliente === ""){
                throw { campo: "nomeCliente", label: "Cliente" };
            }
            else if (_.isNil(pedido.emailNfe) || pedido.emailNfe === ""){
                throw { campo: "emailNfe", label: "E-mail Nfe" };
            }
            else if (_.isNil(pedido.grupoCliente) || pedido.grupoCliente === ""){
                throw { campo: "grupoCliente", label: "Grupo de Cliente" };
            } 
            else if (_.isNil(pedido.endEntrega) || pedido.endEntrega === ""){
                throw { campo: "endEntrega", label: "Endereço de entrega" };
            } 
            
            resolve(pedido);
        } catch (exception) {
            exception.mensagem = "Campo "+ exception.label +" obrigatório!";
            reject(exception);
        }
    });
};

const validarItens = (pedidos) => {
    return new Promise((resolve, reject) => {
        try {
            const done = _.after(pedidos.length, () => resolve());
            pedidos.forEach(pedido => {

                console.log(pedido);
                
                if (_.isNil(pedido.formaPagamento) || pedido.formaPagamento === ""){
                    throw { campo: "formaPgto", label: "Forma de pagamento" };
                } else {
                    if (pedido.formaPagamento.condicoes.length > 0 &&  (_.isNil(pedido.condicaoPagamento) || pedido.condicaoPagamento == "")) {
                        throw { campo: "condicaoPgto", label: "Condição de pagamento" };
                    }
                }
                
                done();
            });

        } catch (exception) {
            exception.mensagem = "Campo "+ exception.label +" obrigatório!";
            reject(exception);
        }
    });
};

class pedidoUtils {

    newCarrinho() {
        return {
            id: 0,
            grupoCliente: null,
            cliente: {
                cpfCnpj: null,
                nome: null,
            },
            valorTotal: 0,
            itens: [],            
        };
    }

    newPedido() {
        return new Promise((resolve) => {
            const pedido = {};
            pedido.endEntrega = null;
            pedido.observacao = null;
            pedido.desconto1 = 0;
            pedido.desconto2 = 0;
            pedido.desconto3 = 0;
            resolve(pedido);
        });
    }

    gerarPedidosPorEmbarques(pedido, embarques) {
        return new Promise((resolve) => {
            const pedidosNew = [];
            const itens = Storage.getCarrinhoItens();
            const done = _.after(embarques.length, () => resolve(pedidosNew));
            embarques.forEach(embarque => {
                const newPedido = _.cloneDeep(pedido);
                newPedido.embarque = _.cloneDeep(embarque);
                newPedido.itens = _.cloneDeep(itens.filter((item) => item.embarque.id == embarque.id ));
                newPedido.itens = newPedido.itens.map((item) => {
                    delete item.embarque;
                    return item;
                });
                pedidosNew.push(newPedido);
                done();
            });
        });
    }

    concluirGeracaoPedidos(view, carrinho = false) {        
        Storage.deleteCarrinho();
        Storage.deleteGrupoCarrinho();
        Storage.deleteClienteCarrinho();
        if (carrinho) {
            view.$router.push({ name: 'orcamentoConsulta'});
        } else {
            view.$router.push({ name: 'pedidoConsulta'});
        }
    }

    validarPedido(pedido, itens) {
        return new Promise((resolve, reject) => {
            validarPedido(pedido).then(() => {
                validarItens(itens).then(() => {
                    resolve();
                }).catch((err) => {                
                    reject(err);
                });
            }).catch((err) => {                
                reject(err);
            });
        });
    }    
        
}

export default new pedidoUtils();