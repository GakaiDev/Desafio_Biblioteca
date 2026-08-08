class DashboardController < ApplicationController
  def index
    total_acervo = Exemplar.count
    leitores_ativos = UsuarioBiblioteca.count
    emprestimos_ativos = Emprestimo.where(devolvido: false).count

    emprestimos_atrasados = Emprestimo.where(devolvido: false).where("data_devolucao < ?", Date.current).count

    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i
    offset = (page - 1) * per_page

    movimentacoes_query = Emprestimo.includes({ exemplar: :livro }, :usuario_biblioteca)
                                    .where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)
                                    .order(created_at: :desc)

    total_count = movimentacoes_query.count
    total_pages = (total_count.to_f / per_page).ceil

    movimentacoes = movimentacoes_query.limit(per_page).offset(offset)

    render json: {
      metricas: {
        total_acervo: total_acervo,
        leitores_ativos: leitores_ativos,
        emprestimos_ativos: emprestimos_ativos,
        emprestimos_atrasados: emprestimos_atrasados
      },
      movimentacoes_hoje: movimentacoes.as_json(include: {
        exemplar: { include: :livro },
        usuario_biblioteca: {}
      }),
      meta: {
        current_page: page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end
end
