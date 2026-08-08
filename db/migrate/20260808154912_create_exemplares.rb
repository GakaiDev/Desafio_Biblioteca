class CreateExemplares < ActiveRecord::Migration[8.1]
  def change
    create_table :exemplares do |t|
      t.references :livro, null: false, foreign_key: true
      t.string :codigo_barras, null: false
      t.string :status, default: 'disponível'

      t.timestamps
    end

    add_index :exemplares, :codigo_barras, unique: true
  end
end
