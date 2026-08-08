class UsuarioBiblioteca < ApplicationRecord
  has_many :emprestimos, dependent: :restrict_with_error
  validates :nome, :cpf, :telefone, :email, presence: true
  validates :cpf, uniqueness: true

  before_create :gerar_senha_emprestimo
  after_create_commit :enviar_senha_por_email

  private

  def gerar_senha_emprestimo
    self.senha_emprestimo = SecureRandom.alphanumeric(6).upcase
  end

  def enviar_senha_por_email
    UsuarioMailer.senha_gerada(self).deliver_later
  end
end
