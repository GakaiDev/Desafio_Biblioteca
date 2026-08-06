class CreateCategoria < ActiveRecord::Migration[8.1]
  def change
    create_table :categoria do |t|
      t.string :nome, null: false

      t.timestamps
    end
  end
end
