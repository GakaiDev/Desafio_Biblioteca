class CreateUsuarioBibliotecas < ActiveRecord::Migration[8.1]
  def change
    create_table :usuario_bibliotecas do |t|
      t.string :nome, null: false
      t.string :cpf,  null: false
      t.string :telefone, null: false
      t.string :email,  null: false
      t.string :senha_emprestimo


      t.string :cep
      t.string :logradouro
      t.string :bairro
      t.string :cidade
      t.string :uf

      t.timestamps
    end

    add_index :usuario_bibliotecas, :cpf, unique: true
  end
end
