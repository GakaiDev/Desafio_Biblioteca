import { useState, useEffect } from 'react';
import { Plus, Trash2, Book, CheckCircle2, XCircle } from 'lucide-react';
import api from '../api/axios';

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [status, setStatus] = useState('disponível');
  const [observacoes, setObservacoes] = useState('');
  
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resLivros, resCategorias] = await Promise.all([
        api.get('/livros'),
        api.get('/categorias')
      ]);
      setLivros(resLivros.data);
      setCategorias(resCategorias.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !autor || !categoriaId) {
      setErro('Título, Autor e Categoria são obrigatórios.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await api.post('/livros', {
        livro: {
          titulo,
          autor,
          categoria_id: categoriaId,
          status,
          observacoes
        }
      });
      
      // Limpar formulário
      setTitulo('');
      setAutor('');
      setCategoriaId('');
      setStatus('disponível');
      setObservacoes('');
      
      carregarDados();
    } catch (error) {
      setErro('Erro ao salvar o livro. Verifique os dados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) return;

    try {
      await api.delete(`/livros/${id}`);
      setLivros(livros.filter((livro) => livro.id !== id));
    } catch (error) {
      alert('Erro ao excluir. O livro pode estar vinculado a um empréstimo.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <Book size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Acervo de Livros</h1>
      </div>

      {/* Formulário de Cadastro */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">Cadastrar Novo Livro</h2>
        
        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Autor *</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Categoria *</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione...</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="disponível">Disponível</option>
              <option value="emprestado">Emprestado</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Observações</label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Estado de conservação, edição, etc."
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="lg:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={16} />
              {loading ? 'Salvando...' : 'Salvar Livro'}
            </button>
          </div>
        </form>
      </div>

      {/* Listagem de Livros */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Título</th>
                <th className="px-6 py-3 font-medium">Autor</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {livros.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">
                    Nenhum livro cadastrado no acervo.
                  </td>
                </tr>
              ) : (
                livros.map((livro) => (
                  <tr key={livro.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">#{livro.id}</td>
                    <td className="px-6 py-4 font-medium text-zinc-900">{livro.titulo}</td>
                    <td className="px-6 py-4">{livro.autor}</td>
                    <td className="px-6 py-4">{livro.categoria?.nome}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        livro.status === 'disponível' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {livro.status === 'disponível' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {livro.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(livro.id)}
                        className="inline-flex items-center gap-1 text-red-600 transition-colors hover:text-red-800"
                        title="Excluir livro"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}