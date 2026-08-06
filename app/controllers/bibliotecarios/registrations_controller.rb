class Bibliotecarios::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: "Bibliotecário cadastrado com sucesso." },
        data: resource
      }, status: :ok
    else
      render json: {
        status: { message: "O cadastro falhou. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
