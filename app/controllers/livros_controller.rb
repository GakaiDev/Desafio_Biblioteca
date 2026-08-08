class LivrosController < ApplicationController
  before_action :set_livro, only: %i[ show update destroy ]

  def index
    @livros = Livro.includes(:categoria, :exemplares).all
    render json: @livros.as_json(include: [ :categoria, :exemplares ])
  end

  def show
    render json: @livro, include: :categoria
  end

  def create
    @livro = Livro.new(livro_params)

    if @livro.save
      render json: @livro, status: :created
    else
      render json: @livro.errors, status: :unprocessable_entity
    end
  end

  def update
    if @livro.update(livro_params)
      render json: @livro
    else
      render json: @livro.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @livro.destroy!
  end

  private
    def set_livro
      @livro = Livro.find(params[:id])
    end

    def livro_params
      params.require(:livro).permit(:titulo, :autor, :status, :observacoes, :categoria_id)
    end
end
