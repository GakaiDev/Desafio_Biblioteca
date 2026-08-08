class AddDetalhesToBibliotecarios < ActiveRecord::Migration[8.1]
  def change
    add_column :bibliotecarios, :admin, :boolean, default: false, null: false
  end
end
