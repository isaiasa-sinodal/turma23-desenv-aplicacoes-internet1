document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo('todos');
});

function filtrarDoces(categoria, botao) {
    
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    botao.classList.add('active');

    renderizarCatalogo(categoria);
}

function renderizarCatalogo(categoriaFiltro) {
    const todosDoces = StorageService.carregar();
    const container = document.getElementById('catalogo-container');
    container.innerHTML = '';

    // Lógica de Filtro
    const docesFiltrados = categoriaFiltro === 'todos' 
        ? todosDoces 
        : todosDoces.filter(d => d.categoria === categoriaFiltro);

    if (docesFiltrados.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;">
            <p>Ainda não temos doces nesta categoria. 🧁</p>
        </div>`;
        return;
    }

    docesFiltrados.forEach(doce => {
        const mensagem = encodeURIComponent(`Olá Dona Maria! Vi o "${doce.nome}" no site e fiquei com água na boca. Como faço para pedir?`);
        const linkWpp = `https://wa.me/5551997281528?text=${mensagem}`;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${doce.imagem}" alt="${doce.nome}" onerror="this.src='https://via.placeholder.com/300x200?text=Doce+Sem+Foto'">
            <div class="card-body">
                <span class="card-category">${doce.categoria}</span>
                <h3>${doce.nome}</h3>
                <p style="color: #666; font-size: 0.9rem; margin: 10px 0;">${doce.descricao}</p>
                <div class="card-price">R$ ${Number(doce.preco).toFixed(2)}</div>
                <a href="${linkWpp}" target="_blank" class="btn-wpp">
                    Pedir no WhatsApp
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}