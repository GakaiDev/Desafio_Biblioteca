Rails.application.routes.draw do
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
