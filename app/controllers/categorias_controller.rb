class CategoriasController < ApplicationController
  # before_action :authenticate_bibliotecario!
  before_action :set_categoria, only: %i[ show update destroy ]

  def index
    @categorias = Categoria.all
    render json: @categorias
  end

  def show
    render json: @categoria
  end

  def create
    @categoria = Categoria.new(categoria_params)

    if @categoria.save
      render json: @categoria, status: :created
    else
      render json: @categoria.errors, status: :unprocessable_entity
    end
  end

  def update
    if @categoria.update(categoria_params)
      render json: @categoria
    else
      render json: @categoria.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @categoria.destroy!
  end

  private
    def set_categoria
      @categoria = Categoria.find(params[:id])
    end

    def categoria_params
      params.require(:categoria).permit(:nome)
    end
end
