class UsuarioMailer < ApplicationMailer
  def senha_gerada(usuario)
    @usuario = usuario
    mail(to: @usuario.email, subject: "Sua senha de empréstimo - Biblioteca Ney Pontes")
  end
end
