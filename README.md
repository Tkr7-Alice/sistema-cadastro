# Cadastro Digital

Aplicação web Full Stack desenvolvida para gerenciamento de cadastros, com área pública para usuários realizarem e consultarem registros e área administrativa protegida para análise e gerenciamento das informações.

O projeto utiliza uma arquitetura separando responsabilidades entre interface, API, regras de negócio e persistência de dados. O frontend é desenvolvido com React e TypeScript, enquanto o backend utiliza Python com Flask e PostgreSQL como banco de dados.

---

## 📋 Descrição

O **Cadastro Digital** foi desenvolvido para centralizar o processo de cadastro e acompanhamento de registros em uma aplicação web.

A aplicação possui dois ambientes principais:

- **Área pública:** realização de novos cadastros e consulta do status de um cadastro existente.
- **Área administrativa:** acesso autenticado para gerenciamento, análise e atualização dos cadastros.

A comunicação entre as duas camadas ocorre por meio de uma **API REST**, permitindo manter a interface e o processamento do sistema separados.

---

## 🔎 Visão geral

O fluxo principal da aplicação pode ser representado da seguinte forma:

    Usuário
       │
       ▼
    Frontend
    React + TypeScript
       │
       │ HTTP / REST API
       ▼
    Backend
    Python + Flask
       │
       ├── Routes
       ├── Schemas
       ├── Services
       ├── Repositories
       └── Models
       │
       ▼
    PostgreSQL

Na área administrativa, o acesso é protegido por autenticação baseada em JWT.

---

## ✨ Principais funcionalidades

### Área pública

- Realização de cadastro.
- Validação de nome.
- Validação de telefone.
- Máscara para telefone.
- Validação de DDD brasileiro.
- Consulta do status de um cadastro.
- Exibição do status do cadastro:
  - Aguardando
  - Aprovado
  - Não aprovado
- Interface responsiva.

### Área administrativa

- Login administrativo.
- Autenticação utilizando JWT.
- Visualização dos cadastros.
- Pesquisa e consulta de registros.
- Filtros por status.
- Visualização detalhada de cadastro.
- Edição de dados cadastrais.
- Exclusão de registros.
- Aprovação de cadastros.
- Reprovação de cadastros.
- Dashboard administrativo.
- Criação de administradores através de CLI.
- Interface responsiva para diferentes tamanhos de tela.

---

## 🌐 Área pública

A área pública é destinada aos usuários que precisam realizar ou consultar um cadastro.

### Cadastro

O formulário realiza validações dos dados antes do envio para a API, incluindo:

- Nome.
- Telefone.
- Formatação do telefone através de máscara.
- Verificação de DDD brasileiro.

Após o preenchimento, os dados são enviados ao backend para processamento e persistência no banco de dados.

### Consulta

O usuário pode consultar o status do cadastro utilizando os dados solicitados pela aplicação.

O sistema informa o estado atual do registro, permitindo acompanhar se ele está aguardando análise, aprovado ou não aprovado.

---

## 🔐 Área administrativa

A área administrativa é protegida por autenticação.

Após realizar o login, o administrador possui acesso às ferramentas de gerenciamento dos cadastros.

Entre as operações disponíveis estão:

- Listagem dos registros.
- Pesquisa.
- Consulta detalhada.
- Edição.
- Exclusão.
- Aprovação.
- Reprovação.
- Filtros por status.

A aplicação também possui uma estrutura de dashboard administrativo para apresentação das informações relacionadas aos cadastros e aos registros do sistema.

---

## 🏗️ Arquitetura da aplicação

O projeto utiliza uma separação de responsabilidades entre as principais camadas do backend.

### Routes

Responsáveis por receber as requisições HTTP e disponibilizar os endpoints da API.

As rotas também fazem a ligação entre as requisições recebidas e as demais camadas da aplicação.

### Schemas

Responsáveis pela validação e estruturação dos dados utilizados pela aplicação.

Essa camada ajuda a controlar os dados recebidos e enviados pela API.

### Services

Concentram regras de negócio e operações que não devem ficar diretamente nas rotas.

A utilização dessa camada mantém os endpoints mais organizados e facilita a manutenção do código.

### Repositories

Responsáveis pela interação relacionada à persistência dos dados.

A separação dessa responsabilidade evita concentrar operações de banco diretamente nas rotas.

### Models

Representam as entidades utilizadas pelo sistema e sua estrutura de persistência através do SQLAlchemy.

### Database / Core / Utils

- **Database:** configuração e acesso à camada de banco de dados.
- **Core:** configurações centrais da aplicação.
- **Utils:** funções auxiliares utilizadas pelo sistema.

Essa organização permite manter responsabilidades separadas e facilita futuras alterações e manutenção do projeto.

---

## 📁 Estrutura de diretórios

A estrutura principal do projeto está organizada entre frontend e backend:

    sistema-cadastro/
    │
    ├── backend/
    │   ├── app/
    │   │   ├── core/
    │   │   ├── db/
    │   │   ├── models/
    │   │   ├── repositories/
    │   │   ├── routes/
    │   │   ├── schemas/
    │   │   ├── services/
    │   │   └── utils/
    │   │
    │   ├── alembic/
    │   ├── migrations/
    │   ├── .env
    │   ├── .env.example
    │   ├── alembic.ini
    │   ├── requirements.txt
    │   └── run.py
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── ...
    │   ├── package.json
    │   └── ...
    │
    └── README.md

A estrutura interna pode evoluir durante o desenvolvimento, mas a separação entre frontend e backend permanece como parte central da organização do projeto.

---

## 🛠️ Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Frontend | React, TypeScript, Vite |
| Roteamento | React Router |
| Comunicação | Axios / API REST |
| Interface | CSS |
| Ícones | Lucide React |
| Backend | Python, Flask |
| ORM | SQLAlchemy |
| Migrações | Flask-Migrate / Alembic |
| Autenticação | JWT |
| Banco de dados | PostgreSQL |
| Versionamento | Git e GitHub |
| Hospedagem | Render |
| Banco em produção | Supabase |

---

## 🐍 Backend

O backend foi desenvolvido em Python utilizando Flask.

Sua responsabilidade é processar as requisições da aplicação, executar as regras de negócio, validar os dados, realizar a autenticação administrativa e trabalhar com a persistência dos registros.

A aplicação utiliza SQLAlchemy como ORM e Flask-Migrate/Alembic para controle das alterações estruturais do banco de dados.

---

## ⚛️ Frontend

O frontend foi desenvolvido utilizando:

- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- CSS

A aplicação possui páginas para o fluxo público e para o ambiente administrativo.

A interface foi desenvolvida com comportamento responsivo, permitindo a utilização em diferentes tamanhos de tela.

---

## 🗄️ Banco de dados

O sistema utiliza **PostgreSQL** como banco de dados relacional.

A comunicação com o banco é realizada pelo backend através do SQLAlchemy.

As alterações estruturais do banco são controladas por migrações, permitindo manter a estrutura do banco sincronizada com a evolução do código.

Em produção, o PostgreSQL utilizado pelo projeto está hospedado no **Supabase**.

---

## 🔒 Segurança e autenticação

A área administrativa utiliza autenticação baseada em **JWT (JSON Web Token)**.

O fluxo básico é:

    Administrador
          │
          ▼
       Login
          │
          ▼
    Backend valida
      credenciais
          │
          ▼
       JWT
          │
          ▼
    Área administrativa

Informações sensíveis, como credenciais, chaves de autenticação e URLs privadas de banco de dados, não devem ser armazenadas no repositório.

As configurações sensíveis devem ser fornecidas através de variáveis de ambiente.

---

## 📦 Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

- Python.
- Node.js e npm.
- PostgreSQL.
- Git.

Também é necessário possuir acesso a um banco PostgreSQL para executar o backend.

---

## 🚀 Instalação

### 1. Clonar o repositório

    git clone <URL_DO_REPOSITORIO>
    cd sistema-cadastro

A URL do repositório deve ser substituída pela URL correspondente ao repositório GitHub utilizado no projeto.

---

## 🐍 Configuração do backend

Entre na pasta do backend:

    cd backend

Crie um ambiente virtual:

### Windows

    python -m venv .venv

Ative o ambiente:

    .venv\Scripts\activate

### Linux / macOS

    python3 -m venv .venv
    source .venv/bin/activate

Instale as dependências:

    pip install -r requirements.txt

---

## 🗄️ Configuração do banco

Crie um banco PostgreSQL para utilização local.

Por exemplo:

    sistema_cadastro

O nome pode ser diferente. O importante é que a conexão configurada no backend corresponda ao banco criado.

Não utilize credenciais reais diretamente no código ou no README.

---

## 🔑 Configuração das variáveis de ambiente

Na pasta `backend`, utilize o arquivo `.env.example` como referência para criar o arquivo `.env`.

O arquivo deve conter as configurações necessárias para a execução local, incluindo a conexão com o PostgreSQL e a chave utilizada pela autenticação JWT.

Exemplo de estrutura:

    DATABASE_URL=<SUA_URL_DO_POSTGRESQL>
    JWT_SECRET=<SUA_CHAVE_SECRETA>

Os valores acima são apenas exemplos e devem ser substituídos por valores configurados no ambiente local.

O arquivo `.env` não deve ser versionado.

---

## 🔄 Migrações do banco

Com o ambiente virtual ativo e as variáveis de ambiente configuradas, execute as migrações através do Flask-Migrate:

    flask db upgrade

Esse comando aplica as migrações existentes e deixa o banco de dados atualizado de acordo com a estrutura definida pelo projeto.

Evite executar diferentes sistemas de migração manualmente para a mesma atualização. O fluxo utilizado pela aplicação deve ser mantido através do mecanismo de migrações configurado no projeto.

---

## 👤 Criação do administrador

O projeto possui um comando CLI para criação de usuários administradores.

Com o backend configurado, execute:

    flask admin criar

Siga as instruções exibidas no terminal para informar os dados solicitados.

As credenciais utilizadas devem ser mantidas de forma segura e nunca devem ser adicionadas ao Git.

---

## ▶️ Execução do backend

Na pasta `backend`, com o ambiente virtual ativo:

    python run.py

O backend ficará disponível localmente no endereço configurado pela aplicação, normalmente:

    http://127.0.0.1:5000

---

## ⚛️ Configuração do frontend

Abra outro terminal e entre na pasta do frontend:

    cd frontend

Instale as dependências:

    npm install

Crie ou configure o arquivo `.env` do frontend com a URL da API:

    VITE_API_URL=http://127.0.0.1:5000

A variável `VITE_API_URL` deve apontar para o endereço em que o backend estiver sendo executado.

---

## ▶️ Execução do frontend

Inicie o servidor de desenvolvimento:

    npm run dev

O Vite exibirá no terminal o endereço local utilizado para acessar a aplicação.

Normalmente, a aplicação ficará disponível em:

    http://localhost:5173

---

## 🧭 Principais rotas e páginas

Entre as principais páginas disponíveis no frontend estão:

| Rota | Função |
|---|---|
| `/` | Página inicial / área pública |
| `/cadastro` | Realização de cadastro |
| `/consulta` | Consulta de cadastro |
| `/login` | Login administrativo |
| `/admin` | Área administrativa |
| `/admin/list` | Listagem e gerenciamento de cadastros |
| `/admin/detail` | Visualização de detalhes de cadastro |

As rotas administrativas são protegidas pela autenticação da aplicação.

---

## 🔌 Principais endpoints da API

Os endpoints abaixo são os que podem ser identificados com segurança pela estrutura atual do projeto:

| Endpoint | Finalidade |
|---|---|
| `/admin/api/stats` | Informações estatísticas do painel administrativo |
| `/admin/api/logs` | Consulta de registros de log |
| `/admin/api/incidentes` | Consulta de incidentes |

Os demais endpoints da API não são listados aqui para evitar documentar rotas sem confirmação da implementação atual.

---

## 🏭 Build de produção

Para gerar a versão de produção do frontend:

    npm run build

O Vite gera os arquivos otimizados na pasta:

    frontend/dist/

Para testar a aplicação em produção, utilize o mecanismo de hospedagem configurado para o projeto.

---

## ☁️ Deploy

O projeto possui ambiente de produção utilizando:

- **GitHub:** versionamento e gerenciamento do código.
- **Render:** hospedagem das aplicações.
- **Supabase:** PostgreSQL utilizado pelo ambiente de produção.

As configurações de produção devem ser fornecidas através das variáveis de ambiente configuradas no serviço de hospedagem.

Nenhuma credencial ou variável sensível deve ser armazenada no repositório.

---

## 🔄 Fluxo de desenvolvimento

O desenvolvimento segue um fluxo baseado em Git e GitHub.

Fluxo simplificado:

    Desenvolvimento local
            │
            ▼
        Alterações
            │
            ▼
        Git commit
            │
            ▼
        Git push
            │
            ▼
          GitHub
            │
            ▼
     Ambiente de deploy
            │
            ▼
         Render

O código do frontend e backend permanece organizado no mesmo projeto, enquanto cada aplicação mantém suas próprias responsabilidades.

---

## 📌 Status do projeto

**Em desenvolvimento / evolução contínua.**

O sistema já possui os principais fluxos de cadastro, consulta e gerenciamento administrativo implementados, além da estrutura necessária para execução local e publicação em ambiente de produção.

---

## 🎯 Objetivos técnicos

O projeto foi desenvolvido com foco em:

- Separação de responsabilidades.
- Organização entre frontend e backend.
- Desenvolvimento de uma API REST.
- Persistência de dados utilizando PostgreSQL.
- Utilização de ORM através do SQLAlchemy.
- Controle de alterações do banco através de migrações.
- Autenticação administrativa com JWT.
- Validação de dados de entrada.
- Interface responsiva.
- Organização do código visando manutenção e evolução.
- Utilização de Git e GitHub no fluxo de desenvolvimento.
- Preparação da aplicação para execução em ambiente de produção.

---

## 📚 Aprendizados

O desenvolvimento do Cadastro Digital proporcionou prática em diferentes áreas do desenvolvimento web Full Stack, incluindo:

- Desenvolvimento de interfaces com React e TypeScript.
- Criação e organização de uma API utilizando Flask.
- Comunicação entre frontend e backend através de HTTP.
- Integração com PostgreSQL.
- Utilização do SQLAlchemy para persistência.
- Criação e execução de migrações.
- Implementação de autenticação JWT.
- Validação e tratamento de dados.
- Organização de regras de negócio em camadas.
- Desenvolvimento de interfaces administrativas.
- Responsividade para diferentes dispositivos.
- Versionamento utilizando Git e GitHub.
- Configuração e publicação de aplicações em ambiente de produção.

---

## 📄 Licença

Este projeto não possui uma licença de código aberto especificada neste README.

Caso uma licença seja definida posteriormente, esta seção deverá ser atualizada de acordo com a licença adotada.
