require 'rails_helper'

RSpec.describe "Emprestimos API", type: :request do
  let!(:usuario) { UsuarioBiblioteca.create!(nome: 'Ada Lovelace', cpf: '12345678900', email: 'ada@email.com', telefone: '84999999999', multa_total: 0.0) }

  let!(:categoria) { Categoria.create!(nome: 'Tecnologia') }

  let!(:livro) { Livro.create!(titulo: 'Estrutura de Dados', autor: 'Tenenbaum', categoria: categoria) }

  let!(:exemplar) { Exemplar.create!(livro: livro, codigo_barras: 'LIVRO001', status: 'disponível') }
  let!(:exemplar2) { Exemplar.create!(livro: livro, codigo_barras: 'LIVRO002', status: 'disponível') }
  before do
    allow_any_instance_of(EmprestimosController).to receive(:authenticate_bibliotecario!).and_return(true)

    allow_any_instance_of(UsuarioBiblioteca).to receive(:enviar_senha_por_email)
  end

  describe "POST /emprestimos (Regras de Bloqueio)" do
    it "permite empréstimo para usuário regular" do
      post '/emprestimos', params: { usuario_biblioteca_id: usuario.id, codigo_barras: exemplar.codigo_barras }

      expect(response).to have_http_status(:created)
    end

    it "bloqueia empréstimo se o usuário tiver multa financeira pendente" do
      usuario.update(multa_total: 5.0) # Força uma dívida no banco

      post '/emprestimos', params: { usuario_biblioteca_id: usuario.id, codigo_barras: exemplar.codigo_barras }

      expect(response).to have_http_status(:forbidden)
      expect(JSON.parse(response.body)['error']).to include('multa pendente')
    end

    it "bloqueia empréstimo se o usuário tiver livro atrasado em casa" do
      # Cria um empréstimo vencido há 2 dias
      Emprestimo.create!(usuario_biblioteca: usuario, exemplar: exemplar, data_devolucao: 2.days.ago, devolvido: false)

      # Tenta pegar um novo livro (exemplar2)
      post '/emprestimos', params: { usuario_biblioteca_id: usuario.id, codigo_barras: exemplar2.codigo_barras }

      expect(response).to have_http_status(:forbidden)
      expect(JSON.parse(response.body)['error']).to include('pendências em atraso')
    end
  end

  describe "PATCH /emprestimos/:id/devolver (Motor Financeiro)" do
    it "devolve no prazo correto sem gerar multa" do
      emprestimo = Emprestimo.create!(usuario_biblioteca: usuario, exemplar: exemplar, data_devolucao: 1.day.from_now, devolvido: false)

      patch "/emprestimos/#{emprestimo.id}/devolver"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['valor_multa']).to eq(0.0)
      expect(usuario.reload.multa_total.to_f).to eq(0.0)
    end

    it "devolve atrasado, calcula multa e acumula no perfil do leitor" do
      emprestimo = Emprestimo.create!(usuario_biblioteca: usuario, exemplar: exemplar, data_devolucao: 5.days.ago, devolvido: false)

      patch "/emprestimos/#{emprestimo.id}/devolver"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json['dias_atraso']).to eq(5)
      expect(json['valor_multa']).to eq(10.0) # 5 dias * R$ 2,00

      # Confere se a dívida foi gravada no perfil do usuário no banco
      expect(usuario.reload.multa_total.to_f).to eq(10.0)
    end
  end
end
