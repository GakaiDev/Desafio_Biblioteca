class FuncionariosController < ApplicationController
  before_action :authenticate_bibliotecario!, except: [ :recuperar_senha ]
  before_action :verificar_admin!, only: [ :index, :create, :destroy ]

  def index
    render json: Bibliotecario.all
  end

  def create
    senha_inicial = SecureRandom.hex(4)

    @funcionario = Bibliotecario.new(
      nome: params[:nome],
      email: params[:email],
      password: senha_inicial,
      password_confirmation: senha_inicial,
      admin: params[:admin] || false,
      senha_provisoria: true
    )

    if @funcionario.save
      BibliotecarioMailer.senha_temporaria(@funcionario, senha_inicial).deliver_now
      render json: @funcionario, status: :created
    else
      render json: { error: @funcionario.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    @funcionario = Bibliotecario.find(params[:id])
    if @funcionario == current_bibliotecario
      render json: { error: "Você não pode excluir a própria conta." }, status: :forbidden
    else
      @funcionario.destroy
      head :no_content
    end
  end

  def recuperar_senha
    bibliotecario = Bibliotecario.find_by(email: params[:email])

    if bibliotecario
      senha_temp = SecureRandom.hex(4)
      bibliotecario.update!(password: senha_temp, senha_provisoria: true)
      BibliotecarioMailer.senha_temporaria(bibliotecario, senha_temp).deliver_now
    end

    render json: { message: "Se o e-mail constar em nossa base, uma senha temporária será enviada." }, status: :ok
  end

  private

  def verificar_admin!
    unless current_bibliotecario.admin?
      render json: { error: "Acesso negado. Apenas administradores podem realizar esta ação." }, status: :forbidden
    end
  end
end
