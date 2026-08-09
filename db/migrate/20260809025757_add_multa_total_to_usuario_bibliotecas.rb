class AddMultaTotalToUsuarioBibliotecas < ActiveRecord::Migration[7.1]
  def change
    add_column :usuario_bibliotecas, :multa_total, :decimal, precision: 10, scale: 2, default: 0.0
  end
end
