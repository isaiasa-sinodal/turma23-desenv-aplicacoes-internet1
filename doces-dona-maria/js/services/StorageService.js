// js/services/StorageService.js
// Service: responsável por toda persistência de dados (localStorage + JSON)

const StorageService = (() => {
  const CHAVE = "doces_dona_maria";

  // Carrega todos os doces do localStorage. Se vazio, usa os dados iniciais.
  function carregar() {
    const raw = localStorage.getItem(CHAVE);
    if (raw) {
      try {
        // parse do JSON armazenado
        const parsed = JSON.parse(raw);
        return parsed.map(item => Candy.fromJSON(item));
      } catch (e) {
        console.error("Erro ao parsear dados:", e);
        return _carregarDadosIniciais();
      }
    }
    return _carregarDadosIniciais();
  }

  // Salva a lista de doces no localStorage como JSON
  function salvar(doces) {
    const json = JSON.stringify(doces.map(d => d.toJSON()), null, 2);
    localStorage.setItem(CHAVE, json);
  }

  // Exporta os doces como string JSON (para download)
  function exportarJSON(doces) {
    return JSON.stringify(doces.map(d => d.toJSON()), null, 2);
  }

  // Importa doces a partir de uma string JSON externa
  function importarJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) throw new Error("JSON inválido: esperado um array.");
    return parsed.map(item => Candy.fromJSON(item));
  }

  function _carregarDadosIniciais() {
    const doces = INITIAL_DATA.map(item => Candy.fromJSON(item));
    salvar(doces);
    return doces;
  }

  function limpar() {
    localStorage.removeItem(CHAVE);
  }

  return { carregar, salvar, exportarJSON, importarJSON, limpar };
})();
