import PouchDB from 'pouchdb';
import BasicDB from './basicDB'
import _ from 'lodash';

let localDB = null;

const createDB = () => {
    BasicDB.createDBLocalBasic("produto").then((dataBaseLocal) => {
        if (dataBaseLocal) {
            localDB = new PouchDB(dataBaseLocal, {revs_limit: 0, auto_compaction: true});
        }
    })
};

createDB();

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
                    {codigo: 'P', ativo: true},
                    {codigo: 'M', ativo: true},
                    {codigo: 'G', ativo: true}
                ],
            },
            {
                codigo: 'EX1818',
                nome: 'EX1818',
                ativo: true,
                imagens: ['1', '2'],
                tamanhos: [
                    {codigo: 'P', ativo: true},
                    {codigo: 'M', ativo: true},
                    {codigo: 'G', ativo: false}
                ],
            },
            {
                codigo: 'EX1815',
                nome: 'EX1815',
                ativo: true,
                imagens: ['1', '2'],
                tamanhos: [
                    {codigo: 'P', ativo: true},
                    {codigo: 'M', ativo: false},
                    {codigo: 'G', ativo: true}
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

class produtoDB {

    listar() {
 
    }

    getProdutos() {
        return produtos;
    }

    getCategorias() {
        let categorias = [{codigo: 0, nome: 'Todos'}];
        for (let index = 0; index < produtos.length; index++) {
            const categoria = produtos[index].categoria;
            categoria.check = true;
            categorias.push(categoria)
        }
        return categorias;
    }

    salvar(produto) {
        return new Promise((resolve, reject) => {
            localDB.get(produto.referencia).then((result) => {
                produto._id = result._id;
                produto._rev = result._rev;
                localDB.put(produto).then(() => {
                    resolve();
                });
            }).catch((error) => {
                if (error.status === 404) {
                    produto._id = produto.referencia;
                    localDB.put(produto).then(() => {
                        resolve();
                    });
                } else {
                    reject(error);
                }
            });
        });
    }

    salvarLista(produtos) {
        return new Promise((resolve, reject) => {
            produtos.forEach(produto => {
                this.salvar(produto).then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            });            
        });
    }

}

export default new produtoDB();