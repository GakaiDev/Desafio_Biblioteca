# 📚 Sistema de Gestão - Biblioteca Municipal Ney Pontes

Um sistema completo de gestão de biblioteca desenvolvido com Ruby on Rails (API) e React (Vite), totalmente orquestrado via Docker. 

O sistema controla o acervo de livros, gestão de exemplares físicos, níveis de acesso de funcionários e o fluxo de empréstimos e devoluções com cálculo automatizado de prazos e multas.

## 🛠️ Tecnologias Utilizadas

* **Backend:** Ruby 3.3.4, Ruby on Rails 8 (API Mode)
* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
* **Banco de Dados:** PostgreSQL 15
* **Cache & Filas:** Redis
* **Mensageria (E-mails):** Mailpit (Servidor SMTP Local)
* **Autenticação:** Devise + JWT (JSON Web Tokens)
* **Infraestrutura:** Docker e Docker Compose

## ⚙️ Arquitetura e Diferenciais

* **Autenticação Stateless:** Uso de JWT no lugar de sessões tradicionais, garantindo alta performance e segurança no consumo da API.
* **Modelagem Avançada:** Separação entre a obra (`Livro`) e o item físico (`Exemplar`), permitindo o controle de múltiplas cópias do mesmo título.
* **Segurança de Empréstimos:** Validação em duas etapas exigindo uma senha de empréstimo (enviada via e-mail) do leitor no ato da retirada.
* **Containers:** Ambiente de desenvolvimento 100% isolado. Nenhuma dependência (além do Docker) precisa ser instalada na máquina host.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### 1. Clonar o repositório
```bash
git clone git@github.com:GakaiDev/Desafio_Biblioteca.git
cd biblioteca-ney-pontes

```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ou copie o de exemplo) e adicione chaves secretas aleatórias para a segurança da API:

```bash
cp .env.example .env

```

*As variáveis necessárias são apenas `SECRET_KEY_BASE` e `DEVISE_JWT_SECRET_KEY`.*

### 3. Subir a Infraestrutura

O Docker Compose fará o build do Frontend, Backend, Postgres, Redis e Mailpit automaticamente:

```bash
sudo docker compose up -d --build

```

### 4. Preparar o Banco de Dados

Com os containers rodando, execute o setup do banco e popule com os dados iniciais de teste:

```bash
sudo docker compose exec api bin/rails db:create db:migrate db:seed

```

## 🔐 Acesso ao Sistema e Ferramentas

Com a infraestrutura no ar, você terá acesso a duas interfaces no seu navegador:

### 1. Sistema da Biblioteca (Frontend)

Acesse **[http://localhost:5173]**.
O script de seeds gerou o seguinte acesso administrador para testes:

* **E-mail:** `admin@biblioteca.com`
* **Senha:** `123456`

### 2. Caixa de E-mails Virtual (Mailpit)

Acesse **[http://localhost:8025]**.
O sistema possui envio real de e-mails para envio de senhas provisórias e senhas de empréstimo. O Mailpit intercepta todos os e-mails enviados pela API localmente para que você possa visualizá-los sem precisar de um provedor externo.

## 🧪 Cenários de Teste (Seeds)

O banco de dados já vem populado com:

* 10 Livros e 20 Exemplares disponíveis.
* 3 Leitores fictícios (Ada Lovelace, Alan Turing, Grace Hopper) com diferentes cenários (regular, com multas, com atrasos) para testes de validação no balcão de empréstimos.

```