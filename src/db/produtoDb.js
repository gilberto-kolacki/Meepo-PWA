import PouchDB from 'pouchdb'

let dataBase = new PouchDB('meepo-produto')

let produtoDB = {

    get: (produto)=> {
        return new Promise((resolve) => {
            dataBase.get(produto._id).then((doc) => {
                resolve(doc)
            });
        });
    },

    listar:() => {
        return new Promise((resolve, reject) => {
            let produtos = []
            dataBase.allDocs({include_docs: true, attachments: true}).then((result) => {
                for (let index = 0; index < result.rows.length; index++) {
                    produtos.push(result.rows[index].doc)
                }
                resolve(produtos);
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    },
    salvar:(produto) => {
        produto.type = "produto";
        return new Promise((resolve, reject) => {
            dataBase.put(produto).then((result) => {
                resolve(result)
            }).catch((erro) => {
                reject(erro);
            });
        }); 
    },

    salvarLista: (listaProdutos) => {
        let retorno = [];
        return new Promise((resolve) => {

            let index = 0;
            listaProdutos.forEach(produto => {

                console.log(produto);
                
                index++;
                produtoDB.salvar(produto).then((result) => {
                    retorno.push(result);
                }).catch((erro) => {
                    if (erro.name === 'conflict') {
                        produtoDB.get(produto._id).then((result) => {
                            produto._rev = result._rev
                            produtoDB.salvar(produto)
                        })
                    }
                });

                if (index == listaProdutos.length) {
                    resolve(retorno);
                }
            });
        });    
    }

}

export default produtoDB