let totalTarefas = 0;

function adicionarTarefa() {
  const input = document.getElementById("tarefa");
  const lista = document.getElementById("listaTarefas");
  const mensagem = document.getElementById("mensagem");

  if (input.value.trim() === "") {
    mensagem.style.color = "red";
    mensagem.innerText = "Digite uma tarefa antes de adicionar.";
    return;
  }

  const item = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox-tarefa");

  const texto = document.createElement("span");
  texto.innerText = input.value;

  item.appendChild(checkbox);
  item.appendChild(texto);

  checkbox.addEventListener("change", function() {
    item.classList.toggle("concluido", checkbox.checked);
  });

  lista.appendChild(item);

  totalTarefas++;

  mensagem.style.color = "green";
  mensagem.innerText = "Tarefa adicionada com sucesso!";

  input.value = "";
}