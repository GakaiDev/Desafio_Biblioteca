class EmprestimosController < ApplicationController
  before_action :authenticate_bibliotecario!

  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i
    offset = (page - 1) * per_page

    emprestimos = Emprestimo.includes({ exemplar: :livro }, :usuario_biblioteca).order(created_at: :desc)

    if params[:busca].present?
      termo = "%#{params[:busca]}%"
      emprestimos = emprestimos.joins(:usuario_biblioteca, :exemplar)
                               .where("usuario_bibliotecas.nome ILIKE :termo OR exemplares.codigo_barras ILIKE :termo", termo: termo)
    end

    if params[:status] == "pendentes"
      emprestimos = emprestimos.where(devolvido: false)
    elsif params[:status] == "devolvidos"
      emprestimos = emprestimos.where(devolvido: true)
    elsif params[:status] == "atrasados"
      emprestimos = emprestimos.where(devolvido: false).where("data_devolucao < ?", Date.current)
    end

    total_count = emprestimos.count
    total_pages = (total_count.to_f / per_page).ceil
    emprestimos = emprestimos.limit(per_page).offset(offset)

    render json: {
      emprestimos: emprestimos.as_json(include: {
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

  def create
    usuario = UsuarioBiblioteca.find(params[:usuario_biblioteca_id])

    if usuario.multa_total.to_f > 0
      return render json: { error: "Empréstimo bloqueado: O leitor possui multa pendente (R$ #{'%.2f' % usuario.multa_total}). Receba o valor antes de liberar." }, status: :forbidden
    end

    tem_atrasos = usuario.emprestimos.where(devolvido: false).where("data_devolucao < ?", Date.current).exists?
    if tem_atrasos
      return render json: { error: "Empréstimo bloqueado: O leitor possui pendências em atraso." }, status: :forbidden
    end

    exemplar = Exemplar.find_by(codigo_barras: params[:codigo_barras])

    unless exemplar
      return render json: { error: "Código de barras não encontrado no sistema." }, status: :not_found
    end

    if exemplar.status != "disponível"
      return render json: { error: "Este exemplar já está emprestado ou em manutenção." }, status: :unprocessable_entity
    end

    if usuario.senha_emprestimo != params[:senha_emprestimo]
      return render json: { error: "Senha do leitor inválida. Empréstimo não autorizado." }, status: :unprocessable_entity
    end


    @emprestimo = Emprestimo.new(
      exemplar: exemplar,
      usuario_biblioteca: usuario
    )

    if @emprestimo.save
      exemplar.update!(status: "emprestado")

      render json: @emprestimo, status: :created
    else
      render json: { error: @emprestimo.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def devolver
    @emprestimo = Emprestimo.find_by(id: params[:id]) || Emprestimo.find_by(id: params[:emprestimo_id])

    unless @emprestimo
      return render json: { error: "Empréstimo não encontrado." }, status: :not_found
    end

    if @emprestimo.devolvido
      return render json: { error: "Este exemplar já foi devolvido." }, status: :unprocessable_entity
    end

    dias_atraso = 0
    valor_multa = 0.0

    if Date.current > @emprestimo.data_devolucao
      dias_atraso = (Date.current - @emprestimo.data_devolucao).to_i
      valor_multa = dias_atraso * 2.0
    end

    if @emprestimo.update(devolvido: true)
      @emprestimo.exemplar.update!(status: "disponível")

      if valor_multa > 0
        usuario = @emprestimo.usuario_biblioteca
        usuario.update(multa_total: usuario.multa_total.to_f + valor_multa)
      end

      render json: {
        message: "Devolução registrada com sucesso.",
        dias_atraso: dias_atraso,
        valor_multa: valor_multa
      }, status: :ok
    else
      render json: { error: "Erro ao registrar devolução." }, status: :unprocessable_entity
    end
  end

  def renovar
    @emprestimo = Emprestimo.find(params[:id])

    if @emprestimo.devolvido
      return render json: { error: "Este exemplar já foi devolvido." }, status: :unprocessable_entity
    end

    if @emprestimo.data_devolucao < Date.current
      return render json: { error: "Não é possível renovar um empréstimo que já está em atraso." }, status: :forbidden
    end

    nova_data = 15.business_days.from_now.to_date

    if @emprestimo.update(data_devolucao: nova_data)
      render json: { message: "Empréstimo renovado com sucesso.", nova_data: nova_data }, status: :ok
    else
      render json: { error: "Erro ao renovar empréstimo." }, status: :unprocessable_entity
    end
  end
end
