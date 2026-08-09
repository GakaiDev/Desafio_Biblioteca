Rails.application.routes.draw do
  resources :categorias
  resources :funcionarios, only: [ :index, :create, :destroy ]
  post "/recuperar_senha", to: "funcionarios#recuperar_senha"
  resources :livros do
    resources :exemplares, only: [ :index, :create, :destroy ]
  end
  resources :usuarios_biblioteca, path: "usuarios"
  resources :emprestimos, only: [ :index, :create ] do
    member do
      patch :devolver
      patch :renovar
    end
  end
  get "/me", to: "perfis#me"
  patch "/atualizar_senha", to: "perfis#atualizar_senha"

  patch "usuarios/:id/pagar_multa", to: "usuarios_biblioteca#pagar_multa"

  get "/dashboard/resumo", to: "dashboard#resumo"
  get "dashboard", to: "dashboard#index"

  devise_for :bibliotecarios, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup"
  },
  defaults: { format: :json },
  controllers: {
    sessions: "bibliotecarios/sessions",
    registrations: "bibliotecarios/registrations"
  }
end
