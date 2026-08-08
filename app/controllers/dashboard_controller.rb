class DashboardController < ApplicationController
  def resumo
    hoje = Date.current

    dados = {
      metricas: {
        total_livros: Livro.count,
        livros_emprestados: Livro.where(status: "emprestado").count,
        total_usuarios: UsuarioBiblioteca.count,
        emprestimos_ativos: Emprestimo.where(devolvido: false).count
      },
      atrasados: Emprestimo.includes(:livro, :usuario_biblioteca)
                           .where(devolvido: false)
                           .where("data_devolucao < ?", hoje)
                           .order(data_devolucao: :asc)
                           .map do |emp|
                             {
                               id: emp.id,
                               livro: emp.livro.titulo,
                               leitor: emp.usuario_biblioteca.nome,
                               data_devolucao: emp.data_devolucao,
                               dias_atraso: (hoje - emp.data_devolucao).to_i
                             }
                           end,
      emprestimos_hoje: Emprestimo.includes(:livro, :usuario_biblioteca)
                                  .where(data_emprestimo: hoje)
                                  .order(created_at: :desc)
                                  .map do |emp|
                                    {
                                      id: emp.id,
                                      livro: emp.livro.titulo,
                                      leitor: emp.usuario_biblioteca.nome,
                                      devolvido: emp.devolvido
                                    }
                                  end
    }

    render json: dados, status: :ok
  end
end
