class AddSenhaProvisoriaToBibliotecarios < ActiveRecord::Migration[8.1]
  def change
    add_column :bibliotecarios, :senha_provisoria, :boolean, default: true, null: false
  end
end
