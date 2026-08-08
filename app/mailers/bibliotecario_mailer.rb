class BibliotecarioMailer < ApplicationMailer
  def senha_temporaria(bibliotecario, senha_temp)
    @bibliotecario = bibliotecario
    @senha_temp = senha_temp
    mail(to: @bibliotecario.email, subject: "Recuperação de Senha - Biblioteca Ney Pontes")
  end
end
