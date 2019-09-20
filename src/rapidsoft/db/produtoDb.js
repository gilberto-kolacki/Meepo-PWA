import PouchDB from 'pouchdb'

let dataBase = new PouchDB('meepo-produto')

const produtos = [
    {
        referencia: "44577",
        referenciB: "44578",
        tipo: 1,
        nome: 'BIQUINI BEACH OXYGEN',        
        imagem: '44577_EX1819_1.png',
        categoria: {codigo: 1, nome: 'Biquini'}, 
        preco: 189.90,
        video: 'lklklk',
        cores: [
            {
                codigo: 'EX1819',
                nome: 'EX1819',
                ativo: true,
                imagens: ['1', '2', '3'],
                tamanhos: [
                    {codigo: 'P/S', ativo: true},
                    {codigo: 'M/M', ativo: true},
                    {codigo: 'G/L', ativo: true}
                ],
            },
            {
                codigo: 'EX1818',
                nome: 'EX1818',
                ativo: true,
                imagens: ['1', '2'],
                tamanhos: [
                    {codigo: 'P/S', ativo: true},
                    {codigo: 'M/M', ativo: true},
                    {codigo: 'G/L', ativo: false}
                ],
            },
            {
                codigo: 'EX1815',
                nome: 'EX1815',
                ativo: true,
                imagens: ['1', '2'],
                tamanhos: [
                    {codigo: 'P/S', ativo: true},
                    {codigo: 'M/M', ativo: false},
                    {codigo: 'G/L', ativo: true}
                ],
            },
        ],
    },
    {
        referencia: "43288",
        referenciaA: "43288",
        referenciaB: "43289",
        tipo: 2,
        nome: 'Top Reversible Floral View',        
        imagem: '43288_EX1860_1.png',
        categoria: {codigo: 4, nome: 'Top'},
        preco: 199.90,
        cores: [
            {
                codigo: 'EX1860',
                nome: 'EX1860',
                imagens: ['1', '2', '3'],
                tamanhos: ['P/S', 'M/M', 'G/L'],
            }
        ]
    },
    {
        referencia: "43360",
        tipo: 1,
        nome: 'Regata Strappy Rush',        
        imagem: '43360_0AZ131_1.png',
        categoria: {codigo: 3, nome: 'Regata'},
        preco: 119.90,
        cores: [
            {
                codigo: '0AZ131',
                nome: '0AZ131',
                imagens: ['1', '2', '3', '4'],
                tamanhos: ['XPP','PP', 'P', 'M', 'G', 'GG', 'XGG', 'XXG', 'XXX', 'XXXX', 'XXXXX'],
            },
            {
                codigo: '0AZ132',
                nome: '0AZ132',
                imagens: ['1'],
                tamanhos: ['XPP','PP', 'M', 'G', 'GG', 'XGG', 'XXG', 'XXX', 'XXXX', 'XXXXX'],
            },
            {
                codigo: '0AZ132',
                nome: '0AZ132',
                imagens: ['1'],
                tamanhos: ['XPP','PP', 'P', 'M', 'G', 'GG', 'XGG', 'XXG', 'XXX'],
            }
        ]
    }
];

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
    },

    getProdutos: () => {
        return produtos;
    },

    getCategorias: () => {
        let categorias = [{codigo: 0, nome: 'Todos'}];
        for (let index = 0; index < produtos.length; index++) {
            const categoria = produtos[index].categoria;
            categoria.check = true;
            categorias.push(categoria)
        }
        return categorias;
    }

}

export default produtoDB