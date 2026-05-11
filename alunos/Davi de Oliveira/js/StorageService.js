const StorageService = {
    CHAVE: 'doces_dona_maria_db',

    // Carrega os dados 
    carregar: function() {
        const dadosJson = localStorage.getItem(this.CHAVE);
        if (dadosJson) {
            return JSON.parse(dadosJson);
        }
        return [];
    },

    // Salva os dados 
    salvar: function(listaDeDoces) {
        const dadosJson = JSON.stringify(listaDeDoces);
        localStorage.setItem(this.CHAVE, dadosJson);
    }
};