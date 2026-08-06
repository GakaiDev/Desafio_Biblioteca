class AddJtiToBibliotecarios < ActiveRecord::Migration[8.1]
  def change
    add_column :bibliotecarios, :jti, :string
    add_index :bibliotecarios, :jti
  end
end
