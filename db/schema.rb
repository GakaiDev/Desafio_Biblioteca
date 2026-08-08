# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_08_08_030019) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "bibliotecarios", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "jti"
    t.string "nome"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.boolean "senha_provisoria", default: true, null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_bibliotecarios_on_email", unique: true
    t.index ["jti"], name: "index_bibliotecarios_on_jti"
    t.index ["reset_password_token"], name: "index_bibliotecarios_on_reset_password_token", unique: true
  end

  create_table "categoria", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "nome", null: false
    t.datetime "updated_at", null: false
  end

  create_table "emprestimos", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "data_devolucao", null: false
    t.date "data_emprestimo", null: false
    t.boolean "devolvido", null: false
    t.bigint "livro_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "usuario_biblioteca_id", null: false
    t.index ["livro_id"], name: "index_emprestimos_on_livro_id"
    t.index ["usuario_biblioteca_id"], name: "index_emprestimos_on_usuario_biblioteca_id"
  end

  create_table "livros", force: :cascade do |t|
    t.string "autor", null: false
    t.bigint "categoria_id", null: false
    t.datetime "created_at", null: false
    t.text "observacoes"
    t.string "status", default: "disponível", null: false
    t.string "titulo", null: false
    t.datetime "updated_at", null: false
    t.index ["categoria_id"], name: "index_livros_on_categoria_id"
  end

  create_table "usuario_bibliotecas", force: :cascade do |t|
    t.string "bairro"
    t.string "cep"
    t.string "cidade"
    t.string "cpf", null: false
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "logradouro"
    t.string "nome", null: false
    t.string "senha_emprestimo"
    t.string "telefone", null: false
    t.string "uf"
    t.datetime "updated_at", null: false
    t.index ["cpf"], name: "index_usuario_bibliotecas_on_cpf", unique: true
  end

  add_foreign_key "emprestimos", "livros"
  add_foreign_key "emprestimos", "usuario_bibliotecas"
  add_foreign_key "livros", "categoria", column: "categoria_id"
end
