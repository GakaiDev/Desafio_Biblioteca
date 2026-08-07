class EmprestimosController < ApplicationController
  before_action :set_emprestimo, only: %i[ show ]

  def index
    @emprestimos = Emprestimo.includes(:livro, :usuario_biblioteca).all
    render json: @emprestimos, include: [ :livro, :usuario_biblioteca ]
  end

  def show
    render json: @emprestimo, include: [ :livro, :usuario_biblioteca ]
  end

  def create
    usuario = UsuarioBiblioteca.find_by(id: emprestimo_params[:usuario_biblioteca_id])
    livro = Livro.find_by(id: emprestimo_params[:livro_id])

    if usuario.nil?
      return render json: { error: "Usuário não encontrado no sistema. Realize o cadastro antes de prosseguir." }, status: :not_found
    end

    if usuario.senha_emprestimo != params[:senha_emprestimo]
      return render json: { error: "Senha de empréstimo incorreta." }, status: :unauthorized
    end

    if livro.nil? || livro.status != "disponível"
      return render json: { error: "O livro não está com status Disponível para empréstimo." }, status: :unprocessable_entity
    end

    @emprestimo = Emprestimo.new(emprestimo_params)

    if @emprestimo.save
      render json: @emprestimo, status: :created
    else
      render json: @emprestimo.errors, status: :unprocessable_entity
    end
  end

  private
    def set_emprestimo
      @emprestimo = Emprestimo.find(params[:id])
    end

    def emprestimo_params
      params.require(:emprestimo).permit(:livro_id, :usuario_biblioteca_id)
    end
end
