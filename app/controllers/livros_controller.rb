class LivrosController < ApplicationController
  before_action :set_livro, only: %i[ show update destroy ]

  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i
    offset = (page - 1) * per_page

    @livros = Livro.includes(:categoria, :exemplares).order(created_at: :desc)

    if params[:busca].present?
      termo = "%#{params[:busca]}%"
      @livros = @livros.where("titulo ILIKE :termo OR autor ILIKE :termo", termo: termo)
    end

    total_count = @livros.count
    total_pages = (total_count.to_f / per_page).ceil

    @livros = @livros.limit(per_page).offset(offset)

    render json: {
      livros: @livros.as_json(include: [ :categoria, :exemplares ]),
      meta: {
        current_page: page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
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
      params.require(:livro).permit(:titulo, :autor, :observacoes, :categoria_id)
    end
end
