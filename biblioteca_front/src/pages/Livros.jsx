import { useState, useEffect } from 'react';
import { Book, Plus, Trash2, Layers, Barcode, X } from 'lucide-react';
import api from '../api/axios';

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [codigoBarras, setCodigoBarras] = useState('');
  const [loadingExemplar, setLoadingExemplar] = useState(false);
  const [erroExemplar, setErroExemplar] = useState('');

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
      
      if (livroSelecionado) {
        const livroAtualizado = resLivros.data.find(l => l.id === livroSelecionado.id);
        setLivroSelecionado(livroAtualizado);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleCreateLivro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      await api.post('/livros', {
        livro: { titulo, autor, isbn, quantidade, categoria_id: categoriaId }
      });
      setTitulo(''); setAutor(''); setIsbn(''); setQuantidade(''); setCategoriaId('');
      carregarDados();
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao cadastrar livro.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLivro = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este livro do catálogo?')) return;
    try {
      await api.delete(`/livros/${id}`);
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir livro. Verifique se existem exemplares atrelados a ele.');
    }
  };


  const abrirModalExemplares = (livro) => {
    setLivroSelecionado(livro);
    setErroExemplar('');
    setCodigoBarras('');
    setIsModalOpen(true);
  };

  const handleAddExemplar = async (e) => {
    e.preventDefault();
    if (!codigoBarras) return;
    
    setLoadingExemplar(true);
    setErroExemplar('');

    try {
      await api.post(`/livros/${livroSelecionado.id}/exemplares`, {
        exemplar: { codigo_barras: codigoBarras }
      });
      setCodigoBarras('');
      carregarDados();
    } catch (error) {
      setErroExemplar(error.response?.data?.error || 'Erro ao cadastrar código de barras.');
    } finally {
      setLoadingExemplar(false);
    }
  };

  const handleDeleteExemplar = async (id) => {
    if (!window.confirm('Remover este exemplar físico?')) return;
    try {
      await api.delete(`/livros/${livroSelecionado.id}/exemplares/${id}`);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao remover exemplar.');
    }
  };

  return (
    <div className="max-w-6xl relative">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <Book size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Acervo de Livros</h1>
      </div>

      {/* Formulário de Cadastro do Catálogo */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">Adicionar ao Catálogo</h2>
        
        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleCreateLivro} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Título</label>
            <input
              type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Autor</label>
            <input
              type="text" required value={autor} onChange={(e) => setAutor(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Categoria</label>
            <select
              required 
              value={categoriaId} 
              onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione...</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">ISBN</label>
            <input
              type="text" required value={isbn} onChange={(e) => setIsbn(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Volume/Edição</label>
            <input
              type="number" required value={quantidade} onChange={(e) => setQuantidade(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-1 flex items-end">
            <button
              type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={16} /> Salvar Obra
            </button>
          </div>
        </form>
      </div>

      {/* Listagem do Catálogo */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
              <tr>
                <th className="px-6 py-3 font-medium">Título</th>
                <th className="px-6 py-3 font-medium">Autor</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium text-center">Cópias Físicas</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {livros.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">Nenhum livro cadastrado.</td>
                </tr>
              ) : (
                livros.map((livro) => (
                  <tr key={livro.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{livro.titulo}</td>
                    <td className="px-6 py-4">{livro.autor}</td>
                    <td className="px-6 py-4">{livro.categoria?.nome}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                        <Layers size={14} />
                        {livro.exemplares?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => abrirModalExemplares(livro)}
                        className="mr-3 inline-flex items-center gap-1 text-emerald-600 transition-colors hover:text-emerald-800 font-medium"
                        title="Gerenciar Cópias Físicas"
                      >
                        <Barcode size={16} /> Exemplares
                      </button>
                      <button
                        onClick={() => handleDeleteLivro(livro.id)}
                        className="inline-flex items-center gap-1 text-red-600 transition-colors hover:text-red-800"
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

      {/* Modal de Exemplares */}
      {isModalOpen && livroSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl flex flex-col max-h-[90vh]">
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 bg-zinc-50 rounded-t-lg">
              <div>
                <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                  <Barcode size={20} className="text-zinc-500" />
                  Exemplares: {livroSelecionado.titulo}
                </h2>
                <p className="text-sm text-zinc-500">Cadastre o código de barras de cada cópia física.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={24} />
              </button>
            </div>

            {/* Body do Modal */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Form de Adicionar Código */}
              <form onSubmit={handleAddExemplar} className="mb-6 flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    placeholder="Bipe o código de barras aqui..."
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <button
                  type="submit" disabled={loadingExemplar}
                  className="flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Plus size={16} /> Registrar
                </button>
              </form>

              {erroExemplar && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {erroExemplar}
                </div>
              )}

              {/* Lista de Cópias */}
              <div className="rounded-md border border-zinc-200 bg-white">
                <table className="w-full text-left text-sm text-zinc-600">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase text-zinc-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">Código de Barras</th>
                      <th className="px-4 py-3 font-medium">Status Físico</th>
                      <th className="px-4 py-3 text-right font-medium">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {!livroSelecionado.exemplares || livroSelecionado.exemplares.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-6 text-center text-zinc-500">
                          Nenhum exemplar físico registrado para esta obra.
                        </td>
                      </tr>
                    ) : (
                      livroSelecionado.exemplares.map((ex) => (
                        <tr key={ex.id} className="hover:bg-zinc-50">
                          <td className="px-4 py-3 font-mono font-medium text-zinc-800">{ex.codigo_barras}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              ex.status === 'disponível' ? 'bg-green-100 text-green-700' :
                              ex.status === 'emprestado' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {ex.status.charAt(0).toUpperCase() + ex.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteExemplar(ex.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
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
        </div>
      )}
    </div>
  );
}