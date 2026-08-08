class ExemplaresController < ApplicationController
  before_action :set_livro
  before_action :authenticate_bibliotecario!

  def index
    render json: @livro.exemplares
  end

  def create
    @exemplar = @livro.exemplares.build(exemplar_params)

    if @exemplar.save
      render json: @exemplar, status: :created
    else
      render json: { error: @exemplar.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    @exemplar = @livro.exemplares.find(params[:id])

    if @exemplar.destroy
      head :no_content
    else
      render json: { error: "Não é possível excluir um exemplar que possui histórico de empréstimos." }, status: :unprocessable_entity
    end
  end

  private

  def set_livro
    @livro = Livro.find(params[:livro_id])
  end

  def exemplar_params
    params.require(:exemplar).permit(:codigo_barras)
  end
end
