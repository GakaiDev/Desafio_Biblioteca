puts "Limpando o banco de dados..."
Emprestimo.destroy_all
Bibliotecario.destroy_all
Exemplar.destroy_all
Livro.destroy_all
Categoria.destroy_all
UsuarioBiblioteca.destroy_all

puts "Criando acesso de Admin (Bibliotecário)..."
Bibliotecario.find_or_initialize_by(email: 'admin@biblioteca.com').tap do |admin|
  admin.password = '123456'
  admin.password_confirmation = '123456'
  admin.nome = 'admin'
  admin.admin = true
  admin.save!
end

puts "Criando Categorias..."
cat_tec = Categoria.create!(nome: 'Tecnologia')
cat_fic = Categoria.create!(nome: 'Ficção Científica')
cat_lit = Categoria.create!(nome: 'Literatura Clássica')
cat_fan = Categoria.create!(nome: 'Fantasia')

puts "Criando 10 Livros para teste de paginação..."
livros_data = [
  { titulo: 'Código Limpo', autor: 'Robert C. Martin', cat: cat_tec, pref: 'TEC-01' },
  { titulo: 'Arquitetura Limpa', autor: 'Robert C. Martin', cat: cat_tec, pref: 'TEC-02' },
  { titulo: 'O Programador Pragmático', autor: 'Andrew Hunt', cat: cat_tec, pref: 'TEC-03' },
  { titulo: 'Duna', autor: 'Frank Herbert', cat: cat_fic, pref: 'FIC-01' },
  { titulo: 'Fundação', autor: 'Isaac Asimov', cat: cat_fic, pref: 'FIC-02' },
  { titulo: 'Neuromancer', autor: 'William Gibson', cat: cat_fic, pref: 'FIC-03' },
  { titulo: 'Dom Casmurro', autor: 'Machado de Assis', cat: cat_lit, pref: 'LIT-01' },
  { titulo: 'Memórias Póstumas', autor: 'Machado de Assis', cat: cat_lit, pref: 'LIT-02' },
  { titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', cat: cat_fan, pref: 'FAN-01' },
  { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', cat: cat_fan, pref: 'FAN-02' }
]

livros_data.each do |data|
  livro = Livro.create!(titulo: data[:titulo], autor: data[:autor], categoria: data[:cat])

  Exemplar.create!(livro: livro, codigo_barras: "#{data[:pref]}A", status: 'disponível')
  Exemplar.create!(livro: livro, codigo_barras: "#{data[:pref]}B", status: 'disponível')
end

puts "Criando Usuários (Cenários de Apresentação)..."
user_limpo = UsuarioBiblioteca.create!(nome: 'Ada Lovelace', cpf: '11111111111', email: 'ada@teste.com', telefone: '84999999999', multa_total: 0.0)
sleep(2)
user_multado = UsuarioBiblioteca.create!(nome: 'Alan Turing', cpf: '22222222222', email: 'alan@teste.com', telefone: '84999999998', multa_total: 15.50)
sleep(2)
user_atrasado = UsuarioBiblioteca.create!(nome: 'Grace Hopper', cpf: '33333333333', email: 'grace@teste.com', telefone: '84999999997', multa_total: 0.0)

puts "Forjando um Empréstimo Atrasado (Para Multas)..."
exemplar_atrasado = Exemplar.find_by(codigo_barras: 'FIC-01A')
exemplar_atrasado.update!(status: 'emprestado')

Emprestimo.create!(
  usuario_biblioteca: user_atrasado,
  exemplar: exemplar_atrasado,
  data_emprestimo: 20.days.ago,
  data_devolucao: 5.days.ago,
)

puts "Forjando um Empréstimo Ativo (Para Renovação)..."
exemplar_renovacao = Exemplar.find_by(codigo_barras: 'TEC-01A')
exemplar_renovacao.update!(status: 'emprestado')

Emprestimo.create!(
  usuario_biblioteca: user_limpo,
  exemplar: exemplar_renovacao,
  data_emprestimo: 5.days.ago,
  data_devolucao: 10.days.from_now,
)

puts "✅ Banco populado: 10 Livros, 20 Exemplares, Admin gerado e Cenários de Empréstimo prontos!"
