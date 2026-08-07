# Controle de Escopo - Desafio Biblioteca Municipal Ney Pontes

## 1. Infraestrutura e Setup (Concluído)
- [x] Configuração do ambiente de desenvolvimento (Fedora, Ruby 3.3.4, Node.js 20).
- [x] Inicialização da API em Ruby on Rails (`--api -d postgresql`).
- [x] Inicialização do Frontend em React (Vite).
- [x] Configuração do PostgreSQL local e criação do banco de dados.
- [x] Configuração do repositório Git e autenticação SSH no GitHub.
- [x] Orquestração de serviços auxiliares com Docker (Redis).

## 2. Autenticação e Segurança (Em Andamento)
- [x] Instalação e configuração do Devise para ambiente API.
- [x] Configuração de autenticação via tokens JWT (`devise-jwt` + `JTIMatcher`).
- [x] Sobrescrita de controllers (Sessão/Registro) para formatar respostas em JSON.
- [x] Configuração de filas em background (Sidekiq) para não travar a API.
- [x] Configuração de envio de e-mails (ActionMailer + Mailtrap) para recuperação de senha.
- [x] Isolamento de credenciais usando variáveis de ambiente (`dotenv-rails`).
- [ ] **Pendente:** Criar migração para `force_password_change` no modelo Bibliotecário e lógica para exigir troca de senha no primeiro login.

## 3. Categorias de Livros (Pendente)
- [x] Criar modelo e migração para `Categoria`.
- [x] Atributo obrigatório: Nome.
- [x] Desenvolver endpoints da API (CRUD).

## 4. Livros (Pendente)
- [ ] Criar modelo e migração para `Livro`.
- [ ] Atributos obrigatórios: Autor, Título, Categoria, Status (disponível/emprestado).
- [ ] Atributos opcionais: Observações.
- [ ] Configurar chaves estrangeiras (relacionamento com Categoria).
- [ ] Desenvolver endpoints da API (CRUD).

## 5. Usuários da Biblioteca (Pendente)
- [ ] Criar modelo e migração para `UsuarioBiblioteca`.
- [ ] Atributos obrigatórios: Nome completo, CPF (único), Telefone, E-mail.
- [ ] Lógica para gerar senha de empréstimo aleatória automaticamente no cadastro.
- [ ] Lógica via Sidekiq para enviar a senha gerada para o e-mail do usuário.
- [ ] Desenvolver endpoints da API (CRUD).

## 6. Empréstimos (Pendente)
- [ ] Criar modelo e migração para `Emprestimo` relacionando Livro e Usuário.
- [ ] Lógica para verificar se o status do livro é "Disponível" antes de prosseguir.
- [ ] Endpoint de validação de empréstimo exigindo a "senha de empréstimo" do usuário.
- [ ] Cálculo automático de devolução somando 15 dias úteis (utilizar gem `business_time`).

## 7. Frontend e Integração (Pendente)
- [ ] Desenvolver telas em React (Login, Dashboard, Cadastros).
- [ ] Implementar chamadas à API injetando o token JWT no cabeçalho `Authorization`.

## 8. Funcionalidades Extras e Fechamento (Pendente)
- [ ] Integração com a API ViaCEP no cadastro de usuários (Opcional).
- [ ] Funcionalidade extra: Relatório de livros em atraso.
- [ ] Funcionalidade extra: Cálculo de multas / Renovação online.
- [ ] Gravação do vídeo de até 8 minutos apresentando o sistema em funcionamento.
- [ ] Envio do formulário e do link final do GitHub.