class Exemplar < ApplicationRecord
  self.table_name = "exemplares"
  belongs_to :livro
  has_many :emprestimos, dependent: :restrict_with_error

  validates :codigo_barras, presence: true, uniqueness: true
  validates :status, inclusion: { in: %w[disponível emprestado manutenção] }
end
