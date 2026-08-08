class Emprestimo < ApplicationRecord
  belongs_to :exemplar
  belongs_to :usuario_biblioteca

  before_validation :definir_datas, on: :create
  after_create_commit :atualizar_status_exemplar

  validates :data_emprestimo, :data_devolucao, presence: true

  private

  def definir_datas
    self.data_emprestimo ||= Date.current
    self.data_devolucao ||= 15.business_days.from_now.to_date
    self.devolvido = false if self.devolvido.nil?
  end

  def atualizar_status_exemplar
    exemplar.update!(status: "emprestado")
  end
end
