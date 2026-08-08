class EmprestimosController < ApplicationController
  before_action :authenticate_bibliotecario!

  def index
    emprestimos = Emprestimo.includes({ exemplar: :livro }, :usuario_biblioteca).order(created_at: :desc)

    render json: emprestimos.as_json(include: {
      exemplar: { include: :livro },
      usuario_biblioteca: {}
    })
  end

  def create
    usuario = UsuarioBiblioteca.find(params[:usuario_biblioteca_id])
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

    @emprestimo = Emprestimo.new(
      exemplar: exemplar,
      usuario_biblioteca: usuario
    )

    if @emprestimo.save
      render json: @emprestimo, status: :created
    else
      render json: { error: @emprestimo.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def devolver
    @emprestimo = Emprestimo.find(params[:id])

    if @emprestimo.update(devolvido: true)
      @emprestimo.exemplar.update!(status: "disponível")
      render json: { message: "Devolução registrada com sucesso." }, status: :ok
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
