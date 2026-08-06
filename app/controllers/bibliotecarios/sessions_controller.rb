class Bibliotecarios::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    render json: {
      status: {
        code: 200, message: "Login efetuado com sucesso.",
        data: current_user
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, Rails.application.credentials.secret_key_base).first
      current_user = Bibliotecario.find(jwt_payload["sub"])
    end

    if current_user
      render json: { status: 200, message: "Logout efetuado com sucesso." }, status: :ok
    else
      render json: { status: 401, message: "Nenhuma sessão ativa encontrada." }, status: :unauthorized
    end
  end
end
