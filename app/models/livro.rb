class Livro < ApplicationRecord
  belongs_to :categoria
  has_many :exemplares, class_name: "Exemplar", dependent: :destroy

  validates :titulo, :autor, :isbn, :quantidade, presence: true
  validates :isbn, uniqueness: true
end
