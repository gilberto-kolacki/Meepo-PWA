import Config from '../../../public/config.json'

const createDBLocal = (dataBaseName, representante) => {
    return "meepo_"+Config.empresa+"_rep"+representante.codigo+"_"+dataBaseName;
}

const createDBLocalBasic = (dataBaseName) => {
    return "meepo_"+Config.empresa+"_"+dataBaseName;
}

const createDBRemote = (dataBaselocal) => {
    return Config.endereco_couchdb+dataBaselocal;
}

class basicDB {

    createDBLocal(dataBaseName) {
        return new Promise((resolve) => {
            const representante = JSON.parse(localStorage.getItem('userInfo'));
            if (representante) {
                resolve(createDBLocal(dataBaseName, representante));
            } else {
                resolve(null);
            }
        });
    }

    createDBLocalBasic(dataBaseName) {
        return new Promise((resolve) => {
            resolve(createDBLocalBasic(dataBaseName));
        });
    }

    createDBRemote(dataBaselocal) {
        return new Promise((resolve) => {
            if (dataBaselocal) {
                resolve(createDBRemote(dataBaselocal));
            } else {
                resolve();
            }
        });
    }

}

export default new basicDB();