import Storage from './storage'

class utilMask {

    getCurrency = (moeda) => ({
        'R$': { locale: 'pt-BR', formato: {minimumFractionDigits: 2} },
        '$': { locale: 'en-US', formato: {minimumFractionDigits: 2} },
    } [moeda] || {locale: 'pt-BR', formato: {minimumFractionDigits: 2}});

    getCurrencySifrao = (moeda) => ({
        'R$': { locale: 'pt-BR', formato: {style: 'currency', currency: 'BRL'} },
        '$': { locale: 'en-US', formato: {style: 'currency', currency: 'USD'} },
    } [moeda] || {locale: 'pt-BR', formato: {style: 'currency', currency: 'BRL'}});


    getMoney(value, sifrao = false) {        
        let mask = null;
        if (sifrao) mask = this.getCurrencySifrao(Storage.getGrupoCarrinho().moeda);
        else mask = this.getCurrency(Storage.getGrupoCarrinho().moeda);
        return value.toLocaleString(mask.locale, mask.formato);
    }
    
}

export default new utilMask();