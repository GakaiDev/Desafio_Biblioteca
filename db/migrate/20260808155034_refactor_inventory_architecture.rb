class RefactorInventoryArchitecture < ActiveRecord::Migration[8.1]
  def change
    remove_reference :emprestimos, :livro, foreign_key: true

    add_reference :emprestimos, :exemplar, foreign_key: { to_table: :exemplares }, null: false

    remove_column :livros, :status, :string
  end
end
