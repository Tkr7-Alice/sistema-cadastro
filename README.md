# Sistema de Cadastro

Um sistema completo para gerenciamento de cadastros, dividido entre uma área pública (para usuários realizarem e consultarem seus cadastros) e uma área administrativa (para análise, aprovação e gestão dos dados).

O projeto é construído com um backend robusto em **Python (Flask)** e um frontend moderno em **React (Vite)**.

---

## 🚀 Funcionalidades

### Área Pública
* **Realizar Cadastro:** Formulário intuitivo com validação de nome e telefone (máscara dinâmica e verificação de DDDs válidos do Brasil).
* **Consultar Status:** Acompanhamento em tempo real do status do cadastro (Aguardando, Aprovado ou Não Aprovado) utilizando nome e telefone.

### Área Administrativa (Admin)
* **Autenticação Segura:** Login protegido via JWT (JSON Web Tokens).
* **Painel de Gestão (Dashboard):** Listagem completa de todos os cadastros com filtros rápidos por status.
* **Análise de Cadastros:** Aprovação ou reprovação de cadastros pendentes com um clique.
* **Edição e Exclusão:** Atualização de dados cadastrais (nome e telefone) e exclusão segura de registros.
* **Criação de Admins:** Ferramenta via CLI (linha de comando) para criar novos usuários administradores de forma segura.

---

## 🛠️ Tecnologias Utilizadas

### Backend
* **Python 3.12+**
* **Flask** (Framework Web)
* **SQLAlchemy & Alembic** (ORM e Migrações de Banco de Dados)
* **Flask-JWT-Extended** (Autenticação JWT)
* **PostgreSQL** (Banco de Dados)

### Frontend
* **React 19**
* **Vite** (Bundler e Dev Server)
* **React Router DOM** (Roteamento client-side)
* **Axios** (Comunicação com a API)
* **Lucide React** (Ícones modernos)
* **CSS Nativo** (Estilização responsiva com foco em UX/UI)

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Python 3.12+](https://www.python.org/downloads/)
* [Node.js 18+](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

---

## 📦 Como Instalar e Rodar o Projeto

### 1. Configuração do Banco de Dados
Crie um banco de dados no PostgreSQL (por exemplo, `sistema_cadastro`).

### 2. Backend (API)
Abra um terminal e navegue até a pasta `backend`:

```bash
cd backend
```

Crie e ative um ambiente virtual (recomendado):
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
```

Instale as dependências:
```bash
pip install -r requirements.txt
```

Configure as variáveis de ambiente:
1. Copie o arquivo `.env.example` para `.env`
2. Atualize a variável `DATABASE_URL` com as credenciais do seu PostgreSQL.
3. Gere uma chave segura para o `JWT_SECRET`.

Execute as migrações para criar as tabelas no banco de dados:
```bash
# Para a estrutura base (admin)
flask db upgrade

# Para a tabela de pessoas
alembic upgrade head
```

Crie o seu primeiro usuário administrador:
```bash
flask admin criar
```
*(Siga as instruções na tela para definir e-mail e senha)*

Inicie o servidor de desenvolvimento:
```bash
python run.py
```
*A API estará rodando em: http://127.0.0.1:5000*

---

### 3. Frontend (Interface Web)
Abra um novo terminal e navegue até a pasta `frontend`:

```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

Verifique se o arquivo `.env` possui a URL correta da API:
```env
VITE_API_URL=http://127.0.0.1:5000
```

Inicie o servidor de desenvolvimento do frontend:
```bash
npm run dev
```
*A aplicação estará rodando em: http://localhost:5173*

---

## 🔒 Acesso ao Sistema

* **Área Pública:** Acesse `http://localhost:5173`
* **Área Admin:** Acesse `http://localhost:5173/login` e utilize as credenciais de administrador criadas no passo do Backend.

---

## 📝 Scripts de Build (Para Produção)

Para preparar o frontend para produção, execute:
```bash
npm run build
```
Isso gerará os arquivos estáticos otimizados na pasta `dist/`, prontos para serem servidos por Nginx, Apache ou serviços como Vercel/Netlify.
