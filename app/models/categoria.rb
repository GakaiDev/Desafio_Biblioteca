class Categoria < ApplicationRecord
  validates :nome, presence: true
end
