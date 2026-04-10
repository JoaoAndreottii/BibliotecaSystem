# 📚 Biblioteca — Sistema de Gestão de Livros

**Desenvolvido por: João Otávio Zuliani Andreotti**  
Sistema web CRUD completo para gestão de acervo de livros, utilizando React, Node.js/Express e MySQL.

---

## 🛠 Tecnologias

| Camada      | Tecnologia                   |
|-------------|------------------------------|
| Frontend    | React 18 + React Router DOM  |
| Backend     | Node.js + Express            |
| Banco       | MySQL                        |
| HTTP Client | Axios                        |

---

## 🚀 Como rodar o projeto

### 1. Banco de dados

1. Abra o MySQL Workbench (ou outro cliente MySQL)
2. Execute o arquivo `banco_de_dados.sql` — ele criará o banco `biblioteca_db` e inserirá dados iniciais
3. Se necessário, ajuste usuário/senha no arquivo `backend/db.js`

### 2. Backend

```bash
cd backend
npm install
npm start
```

O servidor iniciará em **http://localhost:3001**

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

A aplicação abrirá em **http://localhost:3000**

---

## 📋 Funcionalidades

- ✅ Listagem de livros com paginação (10 por página)
- ✅ Pesquisa por título ou autor em tempo real
- ✅ Cadastro de novos livros com validação
- ✅ Edição de livros existentes
- ✅ Exclusão com confirmação via modal
- ✅ Visualização detalhada de cada livro
- ✅ Tratamento de erros com mensagens ao usuário (toast)
- ✅ Interface responsiva

---

## 🗄 Estrutura do banco

**Tabela: `livros`**

| Campo           | Tipo         | Descrição                    |
|-----------------|--------------|------------------------------|
| id              | INT (PK)     | Identificador único           |
| titulo          | VARCHAR(255) | Título do livro               |
| autor           | VARCHAR(255) | Nome do autor                 |
| isbn            | VARCHAR(20)  | ISBN único                    |
| genero          | VARCHAR(100) | Gênero literário              |
| ano_publicacao  | INT          | Ano de publicação             |
| paginas         | INT          | Número de páginas (opcional)  |
| sinopse         | TEXT         | Sinopse da obra (opcional)    |
| criado_em       | DATETIME     | Data de cadastro              |

---

## 📁 Estrutura de pastas

```
projeto-crud/
├── backend/
│   ├── server.js       # Servidor Express + endpoints REST
│   ├── db.js           # Conexão MySQL
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Listagem.js   # Tela principal com grid + paginação
│       │   ├── Formulario.js # Cadastro e edição
│       │   └── Detalhes.js   # Visualização detalhada
│       ├── services/
│       │   └── api.js        # Chamadas HTTP com Axios
│       ├── App.js
│       └── index.js
└── banco_de_dados.sql
```
