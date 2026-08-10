class UsuarioBiblioteca < ApplicationRecord
  has_many :emprestimos, dependent: :restrict_with_error
  validates :nome, :telefone, :email, presence: true
  validates :cpf, presence: true, uniqueness: true, format: { with: /\A\d{11}\z/, message: "deve conter exatamente 11 números" }
  validates :telefone, presence: true, format: { with: /\A\d{10,11}\z/, message: "deve conter 10 ou 11 números com DDD" }

  before_create :gerar_senha_emprestimo
  after_create_commit :enviar_senha_por_email

  private

  def gerar_senha_emprestimo
    self.senha_emprestimo = SecureRandom.alphanumeric(6).upcase
  end

  def enviar_senha_por_email
    UsuarioMailer.senha_gerada(self).deliver_now
  end
end
