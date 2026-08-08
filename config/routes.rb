Rails.application.routes.draw do
  resources :categorias
  resources :funcionarios, only: [ :index, :create, :destroy ]
  post "/recuperar_senha", to: "funcionarios#recuperar_senha"
  resources :livros
  resources :usuarios_biblioteca, path: "usuarios"
  resources :emprestimos, only: [ :index, :show, :create ] do
    member do
      patch :devolver
    end
  end
  get "/me", to: "perfis#me"
  patch "/atualizar_senha", to: "perfis#atualizar_senha"

  get "/dashboard/resumo", to: "dashboard#resumo"

  devise_for :bibliotecarios, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup"
  },
  controllers: {
    sessions: "bibliotecarios/sessions",
    registrations: "bibliotecarios/registrations"
  }
end
