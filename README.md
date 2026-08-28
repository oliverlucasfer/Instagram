# Instagram — Mini-app de Login/Cadastro/Feed

Clone moderno e responsivo do Instagram construído com **HTML, CSS e JavaScript puro** (ES Modules, sem framework nem build). Fluxo completo: **cadastrar → logar → ver feed**, com dados persistidos localmente.

## Funcionalidades

- **Autenticação local** — cadastro e login validados contra usuários salvos em `localStorage`; senhas com salt + SHA-256 (`crypto.subtle`), nunca em texto puro.
- **Feed simulado** — stories, posts com fotos (picsum.photos, com fallback offline), curtir/salvar com animação, tudo persistido por usuário.
- **Hash router** (`#/login`, `#/signup`, `#/feed`) — navegação real entre telas com guards de sessão e deep-linking.
- **Modo escuro** — alternável por botão, com persistência e respeito a `prefers-color-scheme`.
- **i18n (PT-BR / EN)** — seletor no rodapé; todas as telas e mensagens dinâmicas traduzidas.
- **Acessibilidade** — HTML semântico, toasts e erros com `aria-live`, foco gerenciado entre views, `aria-pressed` em curtir/salvar.
- **UX** — medidor de força de senha, aviso de Caps Lock, spinner no botão, skeleton shimmer nas imagens, toasts de feedback.

## Como usar

> O projeto usa ES Modules e **precisa ser servido por HTTP** (não abre com duplo clique no `index.html`).

```bash
# Servidor incluído (Node, sem dependências)
node server.js          # http://localhost:8080 (ou configure PORT=xxxx)
```

## Conta de demonstração

| Usuário | Senha   |
| ------- | ------- |
| `demo`  | `demo123` |

(ou use `demo@instagram.com` como identificador). A conta é criada automaticamente na primeira execução. Você também pode cadastrar a sua em **Cadastre-se**.

## Estrutura

```
.
├── index.html        # Shell com as 3 views (login, signup, feed) + toasts
├── style.css         # CSS moderno (variáveis, temas, feed, toasts, responsivo)
├── js/
│   ├── main.js       # Bootstrap: tema, i18n, rotas
│   ├── i18n.js       # Dicionários PT-BR/EN + helper t()
│   ├── store.js      # Usuários, sessão, likes (localStorage + SHA-256)
│   ├── ui.js         # Toasts, loading, erros de campo, caps-lock
│   ├── router.js     # Hash router com guards
│   └── views/        # login.js, signup.js, feed.js
├── server.js         # Servidor estático simples (obrigatório)
├── img/              # Logos e botões de download
└── README.md
```

## Observações

Projeto de demonstração/estudo: **nenhum dado sai do navegador** (sem backend); o "banco de usuários" vive no `localStorage` do seu browser. Limpar os dados do site reseta contas, sessão e curtidas.
