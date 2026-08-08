class PerfisController < ApplicationController
  before_action :authenticate_bibliotecario!

  def me
    render json: current_bibliotecario
  end

  def atualizar_senha
    if current_bibliotecario.update_with_password(senha_params)
      current_bibliotecario.update_column(:senha_provisoria, false)
      render json: { message: "Senha atualizada com sucesso" }, status: :ok
    else
      render json: { error: current_bibliotecario.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def senha_params
    params.require(:bibliotecario).permit(:current_password, :password, :password_confirmation)
  end
end
