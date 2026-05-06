// js/controllers/CatalogController.js
// Controller: gerencia a lógica da página pública de catálogo

const CatalogController = (() => {
  let todosOsDoces = [];
  let filtroCategoria = "todos";
  let termoBusca = "";

  const WHATSAPP_NUMERO = "5551995154309";

  function init() {
    todosOsDoces = StorageService.carregar();
    _renderizarCategorias();
    _renderizarCatalogo();
    _registrarEventos();
  }

  function _registrarEventos() {
    // Busca
    const inputBusca = document.getElementById("busca");
    if (inputBusca) {
      inputBusca.addEventListener("input", (e) => {
        termoBusca = e.target.value.toLowerCase();
        _renderizarCatalogo();
      });
    }

    // Filtros de categoria
    document.querySelectorAll(".filtro-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");
        filtroCategoria = btn.dataset.categoria;
        _renderizarCatalogo();
      });
    });
  }

  function _filtrarDoces() {
    return todosOsDoces.filter(doce => {
      const matchCategoria = filtroCategoria === "todos" || doce.categoria === filtroCategoria;
      const matchBusca = !termoBusca ||
        doce.nome.toLowerCase().includes(termoBusca) ||
        doce.descricao.toLowerCase().includes(termoBusca);
      return matchCategoria && matchBusca;
    });
  }

  function _renderizarCategorias() {
    const categorias = [...new Set(todosOsDoces.map(d => d.categoria))];
    const container = document.getElementById("filtros");
    if (!container) return;

    // O botão "Todos" é estático no HTML; adiciona os dinâmicos
    categorias.forEach(cat => {
      if (!container.querySelector(`[data-categoria="${cat}"]`)) {
        const btn = document.createElement("button");
        btn.className = "filtro-btn";
        btn.dataset.categoria = cat;
        btn.textContent = _nomearCategoria(cat);
        container.appendChild(btn);
      }
    });
  }

  function _renderizarCatalogo() {
    const grid = document.getElementById("catalogo-grid");
    if (!grid) return;

    const docesFiltrados = _filtrarDoces();
    grid.innerHTML = "";

    if (docesFiltrados.length === 0) {
      grid.innerHTML = `<div class="sem-resultados">
        <span>🍬</span>
        <p>Nenhum doce encontrado. Tente outra busca!</p>
      </div>`;
      return;
    }

    docesFiltrados.forEach((doce, i) => {
      const card = _criarCard(doce, i);
      grid.appendChild(card);
    });
  }

  function _criarCard(doce, index) {
    const card = document.createElement("div");
    card.className = "card-doce";
    card.style.animationDelay = `${index * 0.07}s`;

    card.innerHTML = `
      <div class="card-imagem">
        <img src="${doce.imagem}" alt="${doce.nome}" loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1548365328-8c6ef28f7f51?w=400&q=80'">
        <span class="card-categoria">${_nomearCategoria(doce.categoria)}</span>
      </div>
      <div class="card-corpo">
        <h3 class="card-nome">${doce.nome}</h3>
        <p class="card-descricao">${doce.descricao}</p>
        <div class="card-rodape">
          <span class="card-preco">${doce.precoFormatado}</span>
          <button class="btn-whatsapp" onclick="CatalogController.pedirWhatsApp('${doce.nome}', '${doce.precoFormatado}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.855L0 24l6.335-1.658A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.003-1.367l-.36-.214-3.76.984.999-3.66-.235-.374A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182c5.426 0 9.818 4.392 9.818 9.818 0 5.426-4.392 9.818-9.818 9.818z"/>
            </svg>
            Pedir pelo WhatsApp
          </button>
        </div>
      </div>
    `;
    return card;
  }

  function pedirWhatsApp(nome, preco) {
    const mensagem = encodeURIComponent(`Olá, Dona Maria! 🍬 Gostaria de pedir: *${nome}* (${preco}). Poderia me dar mais informações?`);
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, "_blank");
  }

  function _nomearCategoria(cat) {
    const nomes = {
      brigadeiros: "Brigadeiros",
      bolos: "Bolos",
      tortas: "Tortas",
      trufas: "Trufas",
      docinhos: "Docinhos",
      outros: "Outros"
    };
    return nomes[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  return { init, pedirWhatsApp };
})();
