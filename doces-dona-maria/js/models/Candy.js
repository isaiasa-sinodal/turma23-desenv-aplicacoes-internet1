// js/models/Candy.js
// Model: define a estrutura de um doce e valida os dados

class Candy {
  constructor({ id, nome, descricao, preco, imagem, categoria }) {
    this.id = id || Candy.gerarId();
    this.nome = nome;
    this.descricao = descricao;
    this.preco = parseFloat(preco);
    this.imagem = imagem || "https://images.unsplash.com/photo-1548365328-8c6ef28f7f51?w=400&q=80";
    this.categoria = categoria;
    this.criadoEm = new Date().toISOString();
  }

  static gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  static validar(dados) {
    const erros = [];
    if (!dados.nome || dados.nome.trim().length < 2) erros.push("Nome deve ter pelo menos 2 caracteres.");
    if (!dados.descricao || dados.descricao.trim().length < 10) erros.push("Descrição deve ter pelo menos 10 caracteres.");
    if (!dados.preco || isNaN(parseFloat(dados.preco)) || parseFloat(dados.preco) <= 0) erros.push("Preço deve ser um número positivo.");
    if (!dados.categoria) erros.push("Selecione uma categoria.");
    return erros;
  }

  // Serializa para JSON
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      imagem: this.imagem,
      categoria: this.categoria,
      criadoEm: this.criadoEm
    };
  }

  // Reconstrói a partir de JSON
  static fromJSON(json) {
    const c = new Candy(json);
    c.criadoEm = json.criadoEm || new Date().toISOString();
    return c;
  }

  get precoFormatado() {
    return this.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
}
