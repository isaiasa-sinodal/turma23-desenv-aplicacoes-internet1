// js/controllers/CatalogController.js
// Controller: gerencia a lógica da página pública de catálogo

const CatalogController = (() => {
  let todosOsDoces = [];
  let filtroCategoria = "todos";
  let termoBusca = "";
  let carrinho = [];
  let enderecoCheckout = "";

  const WHATSAPP_NUMERO = "5551995154309";

  function init() {
    _initLGPD();
    _initDarkMode();
    todosOsDoces = StorageService.carregar();
    _renderizarCategorias();
    _renderizarCatalogo();
    _registrarEventos();
    _initCarrinho();
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

    // Toggle Dark Mode
    const btnDark = document.getElementById("btn-dark-mode");
    if (btnDark) {
      btnDark.addEventListener("click", _toggleDarkMode);
    }
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
          <button class="btn-whatsapp" onclick="CatalogController.adicionarAoCarrinho('${doce.id}')" title="Adicionar doce ao carrinho">
            🛒 Adicionar ao Carrinho
          </button>
        </div>
      </div>
    `;
    return card;
  }

  function pedirWhatsApp(nome, preco) {
    // Aviso LGPD antes de redirecionar para fora da aplicação
    if (confirm("Aviso de Privacidade: Você será redirecionado para o WhatsApp. A loja terá acesso ao seu número de telefone. Deseja continuar?")) {
      const mensagem = encodeURIComponent(`Olá, Dona Maria! Gostaria de pedir: *${nome}* (${preco}). Poderia me dar mais informações?`);
      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, "_blank");
    }
  }

  // --- Carrinho, Consumo de API (ViaCEP) e Checkout ---
  function _initCarrinho() {
    const btnAbrir = document.getElementById("btn-carrinho");
    const modal = document.getElementById("modal-carrinho");
    const btnFechar = document.getElementById("btn-fechar-carrinho");
    const btnBuscaCep = document.getElementById("btn-buscar-cep");
    const btnFinalizar = document.getElementById("btn-finalizar-pedido");

    if(btnAbrir) btnAbrir.addEventListener("click", () => modal.classList.remove("oculto"));
    if(btnFechar) btnFechar.addEventListener("click", () => modal.classList.add("oculto"));
    if(btnBuscaCep) btnBuscaCep.addEventListener("click", _buscarCep);
    if(btnFinalizar) btnFinalizar.addEventListener("click", _finalizarPedido);
  }

  function adicionarAoCarrinho(id) {
    const doce = todosOsDoces.find(d => d.id === id);
    if(doce) {
      carrinho.push(doce);
      _atualizarCarrinho();
      // Feedback simples
      const contador = document.getElementById("carrinho-contador");
      contador.style.transform = "scale(1.5)";
      setTimeout(() => contador.style.transform = "scale(1)", 200);
    }
  }

  function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    _atualizarCarrinho();
  }

  function _atualizarCarrinho() {
    const contador = document.getElementById("carrinho-contador");
    const lista = document.getElementById("carrinho-itens");
    const labelTotal = document.getElementById("carrinho-total-valor");

    if(contador) contador.textContent = carrinho.length;

    if(lista) {
      lista.innerHTML = "";
      if(carrinho.length === 0) {
        lista.innerHTML = "<p style='text-align:center;color:#6B3517'>O carrinho está vazio.</p>";
      }
      let total = 0;
      carrinho.forEach((item, i) => {
        total += item.preco;
        lista.innerHTML += `
          <div class="carrinho-item">
            <div class="carrinho-item-info">
              <strong>${item.nome}</strong>
              <span>${item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
            <button class="btn-remover-item" onclick="CatalogController.removerDoCarrinho(${i})">Remover</button>
          </div>
        `;
      });
      if(labelTotal) labelTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
  }

  async function _buscarCep() {
    const input = document.getElementById("cep-entrega");
    const label = document.getElementById("endereco-entrega");
    const inputNumero = document.getElementById("numero-entrega");
    const cep = input.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      label.textContent = "CEP inválido. Digite 8 números.";
      label.style.color = "#C0392B";
      if(inputNumero) inputNumero.style.display = "none";
      return;
    }

    label.textContent = "Buscando endereço... ⏳";
    label.style.color = "inherit";
    if(inputNumero) inputNumero.style.display = "none";

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        label.textContent = "CEP não encontrado 😢";
        enderecoCheckout = "";
      } else {
        enderecoCheckout = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
        label.textContent = `🚚 Entrega em: ${enderecoCheckout}`;
        if(inputNumero) {
          inputNumero.style.display = "block";
          inputNumero.focus();
        }
      }
    } catch (err) {
      label.textContent = "Erro ao buscar CEP.";
      console.error(err);
    }
  }

  function _finalizarPedido() {
    if(carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    let itensTexto = carrinho.map(item => `- ${item.nome}`).join("%0A");
    let totalTexto = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    let mensagem = `Olá, Dona Maria! Gostaria de fazer o seguinte pedido:%0A%0A${itensTexto}%0A%0A*Total:* ${totalTexto}`;
    if(enderecoCheckout) {
      const inputNumero = document.getElementById("numero-entrega");
      let numeroCompl = inputNumero && inputNumero.value.trim() !== "" ? inputNumero.value.trim() : "Sem número";
      mensagem += `%0A%0A*Endereço de entrega:*%0A${enderecoCheckout}, ${numeroCompl}`;
    }

    if (confirm("Você será redirecionado para o WhatsApp para enviar o pedido à loja. Continuar?")) {
       window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, "_blank");
       carrinho = []; // Esvazia o carrinho
       _atualizarCarrinho();
       document.getElementById("modal-carrinho").classList.add("oculto");
       
       // Limpa os campos de endereço para a próxima compra
       document.getElementById("cep-entrega").value = "";
       document.getElementById("endereco-entrega").textContent = "";
       const inputNumero = document.getElementById("numero-entrega");
       if(inputNumero) {
         inputNumero.value = "";
         inputNumero.style.display = "none";
       }
       enderecoCheckout = "";
    }
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

  // --- Dark Mode ---
  function _initDarkMode() {
    const isDark = localStorage.getItem("tema_escuro") === "true";
    if (isDark) {
      document.body.classList.add("dark-mode");
      _atualizarIconeDark(true);
    }
  }

  function _toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("tema_escuro", isDark);
    _atualizarIconeDark(isDark);
  }

  function _atualizarIconeDark(isDark) {
    const btn = document.getElementById("btn-dark-mode");
    if (btn) btn.textContent = isDark ? "☀️" : "🌙";
  }

  // --- LGPD ---
  function _initLGPD() {
    if (!localStorage.getItem("lgpd_consent")) {
      const banner = document.createElement("div");
      banner.id = "lgpd-banner";
      banner.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; width: 100%; background: #3D1C02; color: #FFF8F0; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 10000; box-shadow: 0 -2px 10px rgba(0,0,0,0.4); flex-wrap: wrap; gap: 10px; font-family: 'DM Sans', sans-serif;">
          <p style="margin: 0; font-size: 0.9rem; flex: 1; min-width: 250px; line-height: 1.4;">
            <strong>Aviso de Privacidade:</strong> Utilizamos o armazenamento local do seu navegador apenas para salvar preferências do sistema para o site funcionar corretamente. Nenhum dado pessoal é rastreado ou coletado.
          </p>
          <button id="lgpd-btn-catalog" style="background: #C9784A; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: 0.2s;">
            Entendi
          </button>
        </div>
      `;
      document.body.appendChild(banner);
      document.getElementById("lgpd-btn-catalog").addEventListener("click", () => {
        localStorage.setItem("lgpd_consent", "true");
        banner.remove();
      });
    }
  }

  function revogarLGPD() {
    if (confirm("Deseja revogar seu consentimento de privacidade? Suas preferências salvas serão perdidas.")) {
      localStorage.removeItem("lgpd_consent");
      localStorage.removeItem("tema_escuro");
      location.reload();
    }
  }

  return {
    init,
    pedirWhatsApp,
    revogarLGPD,
    // Expõe métodos usados externamente no HTML:
    adicionarAoCarrinho,
    removerDoCarrinho
  };
})();
