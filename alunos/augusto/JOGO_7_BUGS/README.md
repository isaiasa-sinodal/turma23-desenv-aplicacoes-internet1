Os 7 erros:

1) ID do input diferente entre HTML e JS
o html usa id="tarefa" e oj procura "tarefas"

2) Uso errado de = dentro do if
foi usado:
if (input.value = "") 
quando deveria ser comparação (===)

3) classList escrito errado
foi escrito:
classlist

4) variavel nomeada errado
foi criada como:
totalTraefas
mas depois usada como:
totalTarefa

5) uso errado de == para limpar o input
foi usado:
input.value == "";

6) falta do ; no css
faltou ponto e virgula no seguinte código:
cursor: pointer

7) innerHTML foi usado inadequadamente
foi usado:
item.innerHTML = input.value;
o ideal é textContent