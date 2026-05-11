Dona Maria Doces

1. Sobre o Projeto
Este projeto foi desenvolvido como uma aplicação Frontend para a "Dona Maria Doces". O sistema permite o gerenciamento completo de produtos (CRUD) por parte da proprietária e oferece uma vitrine interativa para os clientes, com integração para pedidos via WhatsApp.

2. Estrutura e Organização de Pastas
A aplicação foi organizada de forma modular, separando a lógica de dados da interface do usuário:

/ (Raiz): Contém os arquivos HTML (index.html e admin.html) e o arquivo de estilos (style.css).

/js: Pasta contendo a inteligência do sistema:

StorageService.js: Responsável pela persistência de dados.

CatalogoController.js: Responsável pela exibição e filtros na área do cliente.

AdminController.js: Responsável pelas operações de gerenciamento na área do editor.

3. Padrão de Organização (MVC Simplificado)
Utilizei um padrão baseado em MVC (Model-View-Controller) simplificado para manter o código limpo:

View (HTML/CSS): Cuida apenas da apresentação visual.

Controller (JS): Gerencia a manipulação do DOM e a lógica de eventos.

Service/Model (StorageService): Isola a lógica de manipulação de dados, garantindo que o restante da aplicação não precise saber como os dados são salvos.

4. Uso de JSON e Persistência
O projeto utiliza obrigatoriamente JSON para a persistência simulada.

Serialização: No cadastro/edição, o Array de objetos é transformado em String JSON via JSON.stringify() para ser salvo no LocalStorage.

Parse: Na leitura, a String recuperada do navegador é convertida de volta para Objeto JavaScript via JSON.parse(), permitindo a manipulação dos dados (filtros, listagem e cálculos).

5. Decisões Técnicas e Funcionamento
Identificadores Únicos: Cada doce recebe um ID gerado através de Date.now().toString(), essencial para garantir que a função de edição e exclusão altere o produto correto no Array.

Responsividade: O layout foi construído com CSS Grid dinâmico (minmax), permitindo que o catálogo se adapte a celulares e desktops sem quebras visuais.

UX de Filtros: A aplicação conta com botões de filtro por categoria que atualizam o DOM em tempo real, melhorando a navegação do usuário.

Integração WhatsApp: Utilizei a função encodeURIComponent para formatar as mensagens de pedido, garantindo que o link de contato seja gerado corretamente com o nome do produto selecionado.

6. Como Executar a Aplicação
Para que o LocalStorage funcione corretamente e o navegador não bloqueie os scripts por segurança (erro de política de origem única em protocolos file://), siga estes passos:

Abra a pasta do projeto no VS Code.

Utilize a extensão Live Server.

Clique em "Go Live" ou abra o index.html através do servidor local (http://127.0.0.1:5500).