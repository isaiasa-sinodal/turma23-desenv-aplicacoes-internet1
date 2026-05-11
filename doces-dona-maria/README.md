# Doces da Dona Maria

Sistema frontend para divulgação e gerenciamento de doces artesanais.

---

## Estrutura de pastas

```
doces-dona-maria/
├── index.html              → Catálogo público (área do usuário final)
├── admin.html              → Painel administrativo (área do editor)
├── css/
│   ├── style.css           → Estilos da página pública
│   └── admin.css           → Estilos do painel administrativo
├── js/
│   ├── data/
│   │   └── initialData.js  → Dados iniciais em JSON (8 doces de exemplo)
│   ├── models/
│   │   └── Candy.js        → Model: define estrutura, validação e serialização de um doce
│   ├── services/
│   │   └── StorageService.js → Service: leitura/escrita no localStorage, parse/serialização JSON
│   └── controllers/
│       ├── CatalogController.js → Controller: lógica da página pública
│       └── AdminController.js   → Controller: lógica do CRUD administrativo
└── README.md
```

---

## Padrão de organização

O projeto utiliza uma separação de responsabilidades inspirada no padrão **MVC simplificado**:

| Camada       | Arquivo                 | Responsabilidade                                      |
|--------------|-------------------------|-------------------------------------------------------|
| **Model**    | `Candy.js`              | Estrutura de dados, validação e serialização (JSON)   |
| **Service**  | `StorageService.js`     | Persistência: lê e escreve no localStorage como JSON  |
| **Controller** | `CatalogController.js` | Lógica do catálogo público (filtro, busca, renderização) |
| **Controller** | `AdminController.js`  | Lógica do CRUD: criar, editar, excluir, listar        |
| **View**     | HTML + CSS              | Apresentação ao usuário                               |
| **Data**     | `initialData.js`        | JSON com os dados iniciais pré-carregados             |

---

## Como executar

O projeto é 100% frontend estático — **não precisa de servidor**.

1. Baixe ou clone a pasta do projeto
2. Abra `index.html` no navegador para ver o catálogo público
3. Acesse `admin.html` para entrar no painel administrativo
   - Senha padrão: **maria123**

> Para que as imagens externas (Unsplash) carregem, é necessário conexão com internet.

---

## Funcionalidades implementadas

### Página pública (`index.html`)
- Catálogo com grade responsiva de cards de doces
- Busca em tempo real por nome e descrição
- Filtros por categoria (dinâmicos, gerados a partir dos dados)
- **Carrinho de Compras** flutuante com contador em tempo real
- **Checkout fictício** (modal) para revisar o pedido e visualizar o valor total
- **Consumo de API Externa (ViaCEP)** utilizando `fetch` para busca e preenchimento automático do endereço de entrega
- Envio do resumo do pedido completo (itens, total e endereço) formatado diretamente para o **WhatsApp**
- Botão **"Entrar em contato"** no hero e na seção "Sobre"

### Painel administrativo (`admin.html`)
- **Autenticação fictícia** via `sessionStorage`
- **Dashboard** com total de doces, categorias e preço médio
- **Cadastrar** novos doces com preview de imagem em tempo real
- **Editar** doces existentes (popula o formulário e salva alterações)
- **Excluir** com confirmação
- **Filtro/busca** na tabela de doces
- **Exportar JSON** — baixa todos os doces como arquivo `.json`
- **Importar JSON** — carrega doces de um arquivo `.json` externo
- **Resetar dados** — restaura os 8 doces iniciais

---

## Uso de JSON

O JSON é utilizado em três momentos distintos:

1. **`initialData.js`** — Array JSON com os 8 doces de exemplo que são carregados na primeira visita
2. **`StorageService`** — Ao salvar, serializa (`JSON.stringify`) o array de objetos `Candy`; ao carregar, faz parse (`JSON.parse`) e reconstrói as instâncias com `Candy.fromJSON()`
3. **Exportar/Importar** — Permite baixar e reusar o dataset como arquivo `.json` real

---

## Responsividade

O layout se adapta a três breakpoints:

| Dispositivo | Breakpoint   | Comportamento                                       |
|-------------|--------------|-----------------------------------------------------|
| Desktop     | > 768px      | Grid 4 colunas, nav completa, layout lado a lado    |
| Tablet      | ≤ 768px      | Grid 2-3 colunas, nav oculta                        |
| Mobile      | ≤ 480px      | Grid 1 coluna, CTAs empilhadas, tabela simplificada |

---

## Decisões de design

- **Paleta**: tons de chocolate, caramelo e creme — remetem à identidade visual de uma confeitaria artesanal
- **Tipografia**: Playfair Display (display/serif) + DM Sans (corpo) — combinação entre elegância e legibilidade
- **Animações CSS**: cards surgem com `animation-delay` escalonado para dar sensação de carregamento progressivo
- **Sem dependências externas** (frameworks JS ou CSS) — tudo em HTML, CSS e JavaScript puro

---

## Limitações conhecidas

- A autenticação é fictícia (apenas `sessionStorage`) — não há segurança real
- As imagens são URLs externas do Unsplash; em produção, deveriam ser hospedadas localmente
- O número de WhatsApp é um placeholder — deve ser trocado pelo real em `CatalogController.js`
