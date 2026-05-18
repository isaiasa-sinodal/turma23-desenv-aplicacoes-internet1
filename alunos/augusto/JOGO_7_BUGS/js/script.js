let totalTarefas = 0;

function adicionarTarefa() {
  const input = document.getElementById("tarefa");
  const lista = document.getElementById("listaTarefas");
  const mensagem = document.getElementById("mensagem");

  if (input.value === "") {
    mensagem.innerText = "Digite uma tarefa antes de adicionar.";
    return;
  }

  const item = document.createElement("li");

  item.textContent = input.value;

  item.addEventListener("click", function() {
    item.classList.toggle("concluido");
  });

  lista.appendChild(item);

  totalTarefas++;

  mensagem.innerText = "Tarefa adicionada com sucesso!";

  input.value = "";
}