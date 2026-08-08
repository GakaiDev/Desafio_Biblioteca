import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import api from '../api/axios';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('O nome da categoria é obrigatório.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await api.post('/categorias', { categoria: { nome } });
      setNome('');
      carregarCategorias(); 
    } catch (error) {
      setErro('Erro ao salvar a categoria. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await api.delete(`/categorias/${id}`);
      setCategorias(categorias.filter((cat) => cat.id !== id));
    } catch (error) {
      alert('Erro ao excluir. Verifique se existem livros vinculados a esta categoria.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <Tag size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
      </div>

      {/* Formulário de Cadastro */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">Nova Categoria</h2>
        
        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nome da categoria *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ficção Científica, História, Tecnologia"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-[38px] items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={16} />
            {loading ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      {/* Listagem de Categorias */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Nome da Categoria</th>
              <th className="px-6 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {categorias.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            ) : (
              categorias.map((categoria) => (
                <tr key={categoria.id} className="transition-colors hover:bg-zinc-50">
                  <td className="px-6 py-4 font-medium text-zinc-900">#{categoria.id}</td>
                  <td className="px-6 py-4">{categoria.nome}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(categoria.id)}
                      className="inline-flex items-center gap-1 text-red-600 transition-colors hover:text-red-800"
                      title="Excluir categoria"
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
  );
}