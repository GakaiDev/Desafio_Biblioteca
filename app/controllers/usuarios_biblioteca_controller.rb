class UsuariosBibliotecaController < ApplicationController
  before_action :set_usuario, only: %i[ show update destroy ]

  def index
    @usuarios = UsuarioBiblioteca.all
    render json: @usuarios, except: [ :senha_emprestimo ]
  end

  def show
    render json: @usuario, except: [ :senha_emprestimo ]
  end

  def create
    @usuario = UsuarioBiblioteca.new(usuario_params)

    if @usuario.save
      render json: @usuario, status: :created, except: [ :senha_emprestimo ]
    else
      render json: @usuario.errors, status: :unprocessable_entity
    end
  end

  def update
    if @usuario.update(usuario_params)
      render json: @usuario, except: [ :senha_emprestimo ]
    else
      render json: @usuario.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @usuario.destroy!
  end

  private
    def set_usuario
      @usuario = UsuarioBiblioteca.find(params[:id])
    end

    def usuario_params
      params.require(:usuario_biblioteca).permit(
        :nome, :cpf, :telefone, :email,
        :cep, :logradouro, :bairro, :cidade, :uf
      )
    end
end
