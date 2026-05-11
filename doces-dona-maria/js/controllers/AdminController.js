// js/controllers/AdminController.js
// Controller: gerencia a área administrativa com CRUD completo

const AdminController = (() => {
  let doces = [];
  let modoEdicao = false;
  let idEditando = null;

  const SENHA_ADMIN = "maria123"; // Autenticação fictícia simples

  function init() {
    _verificarAutenticacao();
    _registrarEventos();
  }

  // --- Autenticação ---
  function _verificarAutenticacao() {
    const autenticado = sessionStorage.getItem("admin_auth") === "true";
    if (autenticado) {
      _mostrarPainel();
    } else {
      document.getElementById("tela-login").classList.remove("oculto");
      document.getElementById("painel-admin").classList.add("oculto");
    }
  }

  function tentarLogin() {
    const senhaInput = document.getElementById("senha-input");
    const erro = document.getElementById("erro-login");
    if (senhaInput.value === SENHA_ADMIN) {
      sessionStorage.setItem("admin_auth", "true");
      _mostrarPainel();
    } else {
      erro.textContent = "Senha incorreta. Tente novamente.";
      senhaInput.classList.add("shake");
      setTimeout(() => senhaInput.classList.remove("shake"), 500);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_auth");
    document.getElementById("tela-login").classList.remove("oculto");
    document.getElementById("painel-admin").classList.add("oculto");
    document.getElementById("senha-input").value = "";
    document.getElementById("erro-login").textContent = "";
  }

  function _mostrarPainel() {
    document.getElementById("tela-login").classList.add("oculto");
    document.getElementById("painel-admin").classList.remove("oculto");
    doces = StorageService.carregar();
    _renderizarLista();
    _atualizarEstatisticas();
  }

  // --- Eventos ---
  function _registrarEventos() {
    // Login com Enter
    const senhaInput = document.getElementById("senha-input");
    if (senhaInput) {
      senhaInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") tentarLogin();
      });
    }

    // Formulário de cadastro/edição
    const form = document.getElementById("form-doce");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        _salvarDoce();
      });
    }

    // Filtro de busca na lista admin
    const buscaAdmin = document.getElementById("busca-admin");
    if (buscaAdmin) {
      buscaAdmin.addEventListener("input", (e) => {
        _renderizarLista(e.target.value.toLowerCase());
      });
    }

    // Preview de imagem
    const inputImagem = document.getElementById("campo-imagem");
    if (inputImagem) {
      inputImagem.addEventListener("input", () => {
        const preview = document.getElementById("preview-imagem");
        preview.src = inputImagem.value || "https://images.unsplash.com/photo-1548365328-8c6ef28f7f51?w=400&q=80";
      });
    }
  }

  // --- CRUD ---
  function _salvarDoce() {
    const dados = _coletarDadosFormulario();
    const erros = Candy.validar(dados);

    if (erros.length > 0) {
      _mostrarErros(erros);
      return;
    }

    if (modoEdicao && idEditando) {
      // UPDATE
      const index = doces.findIndex(d => d.id === idEditando);
      if (index !== -1) {
        dados.id = idEditando;
        doces[index] = new Candy(dados);
        _mostrarToast("Doce atualizado com sucesso!");
      }
    } else {
      // CREATE
      const novoDoce = new Candy(dados);
      doces.push(novoDoce);
      _mostrarToast("Doce cadastrado com sucesso!");
    }

    StorageService.salvar(doces);
    _resetarFormulario();
    _renderizarLista();
    _atualizarEstatisticas();
  }

  function editarDoce(id) {
    const doce = doces.find(d => d.id === id);
    if (!doce) return;

    modoEdicao = true;
    idEditando = id;

    document.getElementById("campo-nome").value = doce.nome;
    document.getElementById("campo-descricao").value = doce.descricao;
    document.getElementById("campo-preco").value = doce.preco;
    document.getElementById("campo-imagem").value = doce.imagem;
    document.getElementById("campo-categoria").value = doce.categoria;
    document.getElementById("preview-imagem").src = doce.imagem;
    document.getElementById("titulo-form").textContent = "Editar Doce";
    document.getElementById("btn-salvar").textContent = "Salvar alterações";
    document.getElementById("btn-cancelar").classList.remove("oculto");

    // Scroll para o formulário
    document.getElementById("form-doce").scrollIntoView({ behavior: "smooth" });
  }

  function excluirDoce(id) {
    const doce = doces.find(d => d.id === id);
    if (!doce) return;

    if (!confirm(`Tem certeza que deseja excluir "${doce.nome}"?`)) return;

    doces = doces.filter(d => d.id !== id);
    StorageService.salvar(doces);
    _renderizarLista();
    _atualizarEstatisticas();
    _mostrarToast("Doce removido.");
  }

  function cancelarEdicao() {
    _resetarFormulario();
  }

  // --- Renderização da lista ---
  function _renderizarLista(busca = "") {
    const tbody = document.getElementById("lista-doces");
    if (!tbody) return;

    const filtrados = busca
      ? doces.filter(d => d.nome.toLowerCase().includes(busca) || d.categoria.toLowerCase().includes(busca))
      : doces;

    if (filtrados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="sem-dados">Nenhum doce encontrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtrados.map(doce => `
      <tr class="linha-doce">
        <td>
          <div class="item-nome">
            <img src="${doce.imagem}" alt="${doce.nome}"
              onerror="this.src='https://images.unsplash.com/photo-1548365328-8c6ef28f7f51?w=400&q=80'">
            <strong>${doce.nome}</strong>
          </div>
        </td>
        <td><span class="badge-categoria badge-${doce.categoria}">${doce.categoria}</span></td>
        <td class="preco-col">${doce.precoFormatado}</td>
        <td class="descricao-col">${doce.descricao.substring(0, 60)}...</td>
        <td class="acoes-col">
          <button class="btn-editar" onclick="AdminController.editarDoce('${doce.id}')">Editar</button>
          <button class="btn-excluir" onclick="AdminController.excluirDoce('${doce.id}')">Excluir</button>
        </td>
      </tr>
    `).join("");
  }

  // --- Estatísticas ---
  function _atualizarEstatisticas() {
    const total = doces.length;
    const categorias = new Set(doces.map(d => d.categoria)).size;
    const precoMedio = doces.length
      ? (doces.reduce((s, d) => s + d.preco, 0) / doces.length).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "R$ 0,00";

    const elTotal = document.getElementById("stat-total");
    const elCat = document.getElementById("stat-categorias");
    const elMedia = document.getElementById("stat-media");

    if (elTotal) elTotal.textContent = total;
    if (elCat) elCat.textContent = categorias;
    if (elMedia) elMedia.textContent = precoMedio;
  }

  // --- Importar / Exportar JSON ---
  function exportarJSON() {
    const json = StorageService.exportarJSON(doces);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "doces-dona-maria.json";
    a.click();
    URL.revokeObjectURL(url);
    _mostrarToast("JSON exportado com sucesso!");
  }

  function importarJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const importados = StorageService.importarJSON(ev.target.result);
          doces = importados;
          StorageService.salvar(doces);
          _renderizarLista();
          _atualizarEstatisticas();
          _mostrarToast(`${importados.length} doce(s) importado(s)!`);
        } catch (err) {
          alert("Erro ao importar: " + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function resetarDados() {
    if (!confirm("Isso vai apagar tudo e restaurar os dados originais. Continuar?")) return;
    StorageService.limpar();
    doces = StorageService.carregar();
    _renderizarLista();
    _atualizarEstatisticas();
    _mostrarToast("Dados restaurados!");
  }

  // --- Helpers ---
  function _coletarDadosFormulario() {
    return {
      nome: document.getElementById("campo-nome").value.trim(),
      descricao: document.getElementById("campo-descricao").value.trim(),
      preco: document.getElementById("campo-preco").value,
      imagem: document.getElementById("campo-imagem").value.trim(),
      categoria: document.getElementById("campo-categoria").value
    };
  }

  function _resetarFormulario() {
    document.getElementById("form-doce").reset();
    document.getElementById("preview-imagem").src = "https://images.unsplash.com/photo-1548365328-8c6ef28f7f51?w=400&q=80";
    document.getElementById("titulo-form").textContent = "Cadastrar Doce";
    document.getElementById("btn-salvar").textContent = "Cadastrar";
    document.getElementById("btn-cancelar").classList.add("oculto");
    document.getElementById("erros-form").innerHTML = "";
    modoEdicao = false;
    idEditando = null;
  }

  function _mostrarErros(erros) {
    const container = document.getElementById("erros-form");
    container.innerHTML = erros.map(e => `<li>${e}</li>`).join("");
  }

  function _mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add("visivel");
    setTimeout(() => toast.classList.remove("visivel"), 3000);
  }

  return {
    init,
    tentarLogin,
    logout,
    editarDoce,
    excluirDoce,
    cancelarEdicao,
    exportarJSON,
    importarJSON,
    resetarDados
  };
})();
