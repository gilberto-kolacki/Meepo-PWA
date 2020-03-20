import _ from "lodash";
import Storage from '../utils/storage';
import UtilMask from '../../rapidsoft/utils/utilMask';

const validarPedido = (pedidos) => {
    return new Promise((resolve, reject) => {
        try {
            const done = _.after(pedidos.length, () => resolve());
            pedidos.forEach(pedido => {
                const idsCategorias = pedido.itens.reduce((idsCategorias, item) => idsCategorias.concat(item.categorias), []);

                let valorMinimo = _.orderBy(pedido.grupoCliente.valorMinimo, ['val'], ['desc']).find((valor) => {
                    return idsCategorias.some((categoria) => {
                        return categoria == valor.id;
                    });
                });

                valorMinimo = valorMinimo ? valorMinimo.val : 0;
                
                if (_.isNil(pedido.cliente) || _.isNil(pedido.cliente.cpfCnpj)){
                    throw { campo: "nomeCliente", label: "Cliente" };
                }
                else if (_.isNil(pedido.condicaoPagamento)) {
                    throw { campo: "condicaoPgto", label: "Condição de Pagamento" };
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
                else if (_.isNil(pedido.formaPagamento) || pedido.formaPagamento === ""){
                    throw { campo: "formaPgto", label: "Forma de pagamento" };
                }
                else if (pedido.formaPagamento != 5 && (_.isNil(pedido.condicaoPagamento) || pedido.condicaoPagamento === "")){
                    throw { campo: "formaPgto", label: "Condição de pagamento" };
                }
                else if (_.isNil(pedido.dataEmbarque) || pedido.dataEmbarque === ""){
                    throw { campo: "dataEmbarque", warning: "Selecione a Data do Embarque" };
                }
                else if (_.isNil(pedido.totalLiquido) || valorMinimo > pedido.totalLiquido){
                    throw { campo: "totalLiquido", warning: "O pedido "+pedido.nome+" não ultrapassou o valor minimo de "+ UtilMask.getMoney(valorMinimo, true)+"!"};
                }

                done();
            });
        } catch (exception) {
            if (exception.warning) {
                exception.mensagem = exception.warning;    
            } else {
                exception.mensagem = "Campo "+ exception.label +" obrigatório!";
            }
            reject(exception);
        }
    });
};


class pedidoUtils {

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

    calcularDesconto(desconto, valor) {
        return _.round(valor - ((Number(desconto)/100) * valor), 2);
    }

    getItemTamanho(itensPedido) {
        return itensPedido.reduce((itens, item) => {
            const itemTamenho = item.tamanhos.map((tamanho) => {
                const itemTamanho = {};
                itemTamanho.sku = tamanho.sku;
                itemTamanho.referencia = item.referencia;
                itemTamanho.cor = item.nomeCor;
                itemTamanho.categorias = item.categorias.concat(item.segmento);
                itemTamanho.tamanho = tamanho.codigo;
                itemTamanho.quantidade = tamanho.quantidade;
                itemTamanho.precoCusto = item.precoCusto;
                return itemTamanho;
            });
            return itens.concat(itemTamenho);
        }, []);
    }

    gerarPedidosPorEmbarques(pedido) {
        return new Promise((resolve) => {
            const pedidos = pedido.listEmbarques.map((item) => {
                const newPedido = {};
                newPedido.status = 20;
                newPedido.cliente = pedido.cliente;
                newPedido.grupoCliente = pedido.grupoCliente;
                newPedido.endEntrega = pedido.endEntrega ? pedido.endEntrega.endereco : null;
                newPedido.desconto1 = Number(pedido.desconto1);
                newPedido.desconto2 = Number(pedido.desconto2);
                newPedido.desconto3 = Number(pedido.desconto3);
                newPedido.emailNfe = pedido.emailNfe;
                newPedido.nome = item.nome;
                newPedido.pedidoParcial = item.pedidoParcial;
                newPedido.antecipacaoPedido = item.antecipacaoPedido;
                newPedido.brinde = item.brinde;
                newPedido.copiaEmail = item.copiaEmail;
                newPedido.formaPagamento = item.formaPagamento.id;
                newPedido.condicaoPagamento = item.condicaoPagamento ? item.condicaoPagamento.id : null;
                newPedido.quantidade = item.quantidade;
                newPedido.dataEmbarque = item.dataEmbarque;
                newPedido.totalBruto = item.totalBruto;
                newPedido.totalLiquido = this.calcularDesconto(newPedido.desconto3, this.calcularDesconto(newPedido.desconto2, this.calcularDesconto(newPedido.desconto1, item.totalBruto)));
                newPedido.observacao = (pedido.observacao ? pedido.observacao : "")+""+(item.observacao ? item.observacao : "");
                newPedido.embarque = item.id;
                newPedido.segmento = item.idSegmento;
                newPedido.itens = this.getItemTamanho(item.itensPedido);
                newPedido.pedidoParcial = item.pedidoParcial;
                newPedido.copiaEmail = item.copiaEmail;
                newPedido.antecipacaoPedido = item.antecipacaoPedido;
                return newPedido;
            });
            resolve(pedidos);
        });
    }

    getQuantidadeOrcamento(embarques) {
        return embarques.reduce((total, embarque) => {
            return total + embarque.quantidade;
        }, 0);
    }

    getValorOrcamento(embarques) {
        return _.round(embarques.reduce((total, embarque) => {
            return total + embarque.totalBruto;
        }, 0), 2);
    }

    gerarOrcamento(pedido) {
        return new Promise((resolve) => {
            const orcamento = {};
            orcamento.dataOrcamento = new Date().getTime();
            orcamento.cliente = pedido.cliente;
            orcamento.grupoCliente = pedido.grupoCliente;
            orcamento.desconto1 = Number(pedido.desconto1);
            orcamento.desconto2 = Number(pedido.desconto2);
            orcamento.desconto3 = Number(pedido.desconto3);
            orcamento.observacao = pedido.observacao;
            orcamento.endEntrega = pedido.endEntrega.endereco;
            orcamento.emailNfe = pedido.emailNfe;
            orcamento.embarques = pedido.listEmbarques.map((embarque) => {
                const newEmbarque = {};
                newEmbarque.id = embarque.id;
                newEmbarque.nome = embarque.nome;
                newEmbarque.quantidade = embarque.quantidade;
                newEmbarque.totalBruto = embarque.totalBruto;
                newEmbarque.dataEmbarque = embarque.dataEmbarque;
                newEmbarque.brinde = embarque.brinde;
                newEmbarque.pedidoParcial = embarque.pedidoParcial;
                newEmbarque.antecipacaoPedido = embarque.antecipacaoPedido;
                newEmbarque.copiaEmail = embarque.copiaEmail;
                newEmbarque.formaPagamento = embarque.formaPagamento.id;
                newEmbarque.condicaoPagamento = embarque.condicaoPagamento ? embarque.condicaoPagamento.id : null;
                newEmbarque.itens = embarque.itensPedido;
                return newEmbarque;
            });
            orcamento.quantidade = this.getQuantidadeOrcamento(orcamento.embarques);
            orcamento.totalBruto = this.getValorOrcamento(orcamento.embarques);
            orcamento.totalLiquido = this.calcularDesconto(orcamento.desconto3, this.calcularDesconto(orcamento.desconto2, this.calcularDesconto(orcamento.desconto1, orcamento.totalBruto)));
            resolve(orcamento);
        });
    }

    concluirGeracaoPedidos(view, itens, carrinho = false) {        
        if (Storage.existeCarrinho()) {
            view.$router.push({ name: 'carrinho'});
        } else {
            if (carrinho) {
                view.$router.push({ name: 'orcamentoConsulta'});
            } else {
                view.$router.push({ name: 'pedidoConsulta'});
            }
        }
    }

    validarPedido(pedidos) {
        return new Promise((resolve, reject) => {
            validarPedido(pedidos).then(() => {
                resolve(pedidos);
            }).catch((err) => {                
                reject(err);
            });
        });
    }

    getCondicoesPagamentoEmbarqueCatalogo(condicoes, dataEmbarque) {
        if (condicoes && condicoes.length > 0) {
            return condicoes.reduce((condicoes, condicao) => {
                const mes = new Date(dataEmbarque).getMonth()+1;
                if (condicao.meses == null || condicao.meses.catalogo.includes(mes)) {
                    condicoes.push(condicao);
                }
                return condicoes;
            }, []);
        } else {
            return [];
        }
    }
        
}

export default new pedidoUtils();