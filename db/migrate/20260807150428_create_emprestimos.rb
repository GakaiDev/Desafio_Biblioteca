class CreateEmprestimos < ActiveRecord::Migration[8.1]
  def change
    create_table :emprestimos do |t|
      t.references :livro, null: false, foreign_key: true
      t.references :usuario_biblioteca, null: false, foreign_key: true
      t.date :data_emprestimo, null: false
      t.date :data_devolucao, null: false
      t.boolean :devolvido, null: false

      t.timestamps
    end
  end
end
