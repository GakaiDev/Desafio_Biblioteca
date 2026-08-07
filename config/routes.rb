Rails.application.routes.draw do
  resources :categorias
  resources :livros
  resources :usuarios_biblioteca, path: "usuarios"
  resources :emprestimos, only: [ :index, :show, :create ]

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
