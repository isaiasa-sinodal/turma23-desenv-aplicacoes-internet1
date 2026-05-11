const formDoce = document.getElementById('form-doce');
const tabelaDoces = document.getElementById('tabela-doces');
const inputId = document.getElementById('doce-id'); 

document.addEventListener('DOMContentLoaded', () => {
    atualizarTabela();
});

// Criar ou Atualizar (Create / Update)
formDoce.addEventListener('submit', function(event) {
    event.preventDefault();

    const idAtual = inputId.value;
    const doces = StorageService.carregar();

    const dadosDoce = {
        
        id: idAtual ? idAtual : Date.now().toString(), 
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        imagem: document.getElementById('imagem').value,
        categoria: document.getElementById('categoria').value
    };

    if (idAtual) {
        
        const index = doces.findIndex(d => d.id === idAtual);
        if (index !== -1) {
            doces[index] = dadosDoce;
        }
    } else {
        // Cadastro Novo
        doces.push(dadosDoce);
    }

    
    StorageService.salvar(doces);

    // Limpeza do formulário e interface
    formDoce.reset();
    inputId.value = '';
    atualizarTabela();
    
    alert(idAtual ? 'Doce atualizado com sucesso!' : 'Novo doce cadastrado!');
});

function atualizarTabela() {
    const doces = StorageService.carregar();
    tabelaDoces.innerHTML = '';

    doces.forEach(doce => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${doce.nome}</td>
            <td>${doce.categoria}</td>
            <td>R$ ${Number(doce.preco).toFixed(2)}</td>
            <td>
                <button onclick="prepararEdicao('${doce.id}')" class="btn" style="background-color: #3498db; width: auto; padding: 5px 10px;">Editar</button>
                <button onclick="removerDoce('${doce.id}')" class="btn-danger" style="width: auto;">Excluir</button>
            </td>
        `;
        
        tabelaDoces.appendChild(tr);
    });
}

function prepararEdicao(id) {
    const doces = StorageService.carregar();
    const doceEncontrado = doces.find(d => d.id === id);

    if (doceEncontrado) {
        // Preenche o formulário com os dados existentes
        inputId.value = doceEncontrado.id;
        document.getElementById('nome').value = doceEncontrado.nome;
        document.getElementById('descricao').value = doceEncontrado.descricao;
        document.getElementById('preco').value = doceEncontrado.preco;
        document.getElementById('imagem').value = doceEncontrado.imagem;
        document.getElementById('categoria').value = doceEncontrado.categoria;
        
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Exclusão (Delete)
function removerDoce(id) {
    if(confirm('Deseja realmente apagar este produto do catálogo?')) {
        let doces = StorageService.carregar();
    
        doces = doces.filter(doce => doce.id !== id);
        
        StorageService.salvar(doces);
        atualizarTabela();
    }
}