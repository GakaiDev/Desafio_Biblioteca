class UsuariosBibliotecaController < ApplicationController
  before_action :set_usuario, only: [ :show, :update, :destroy ]

  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i
    offset = (page - 1) * per_page

    @usuarios = UsuarioBiblioteca.order(created_at: :desc)

    if params[:busca].present?
      termo = "%#{params[:busca]}%"
      @usuarios = @usuarios.where("nome ILIKE :termo OR cpf ILIKE :termo", termo: termo)
    end

    total_count = @usuarios.count
    total_pages = (total_count.to_f / per_page).ceil

    @usuarios = @usuarios.limit(per_page).offset(offset)

    render json: {
      usuarios: @usuarios,
      meta: {
        current_page: page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end

  def show
    render json: @usuario
  end

  def create
    @usuario = UsuarioBiblioteca.new(usuario_params)

    if @usuario.save
      render json: @usuario, status: :created
    else
      render json: { error: @usuario.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if @usuario.update(usuario_params)
      render json: @usuario, status: :ok
    else
      render json: { error: @usuario.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    if @usuario.destroy
      head :no_content
    else
      render json: { error: "Não é possível excluir um leitor com histórico de empréstimos." }, status: :unprocessable_entity
    end
  end

  def pagar_multa
    @usuario = UsuarioBiblioteca.find(params[:id])
    if @usuario.update(multa_total: 0.0)
      render json: { message: "Multa zerada com sucesso!" }, status: :ok
    else
      render json: { error: "Erro ao processar pagamento." }, status: :unprocessable_entity
    end
  end

  private

  def set_usuario
    @usuario = UsuarioBiblioteca.find(params[:id])
  end

  def usuario_params
    params.require(:usuario_biblioteca).permit(:nome, :cpf, :email, :telefone)
  end
end
