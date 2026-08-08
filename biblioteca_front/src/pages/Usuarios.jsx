import { useState, useEffect } from 'react';
import { Users, Search, Edit, Trash2, X } from 'lucide-react';
import api from '../api/axios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // Controle de Edição e Feedback
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Estados de Paginação e Filtro
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Efeito para recarregar quando a página mudar
  useEffect(() => {
    carregarUsuarios(paginaAtual, busca);
  }, [paginaAtual]);

  const carregarUsuarios = async (pagina = paginaAtual, termo = busca) => {
    try {
      const res = await api.get('/usuarios', {
        params: { page: pagina, busca: termo }
      });
      // Acessa o envelope novo do JSON
      setUsuarios(res.data.usuarios || res.data); 
      if (res.data.meta) {
        setTotalPaginas(res.data.meta.total_pages);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    carregarUsuarios(1, busca);
  };

  const limparFormulario = () => {
    setNome(''); setCpf(''); setEmail(''); setTelefone('');
    setUsuarioEditando(null);
    setErro('');
  };

  const handleEditarClick = (usuario) => {
    setUsuarioEditando(usuario);
    setNome(usuario.nome);
    setCpf(usuario.cpf);
    setEmail(usuario.email);
    setTelefone(usuario.telefone || '');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela para o formulário
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const payload = {
      usuario_biblioteca: { nome, cpf, email, telefone }
    };

    try {
      if (usuarioEditando) {
        // Rotina de Atualização (PUT/PATCH)
        await api.put(`/usuarios/${usuarioEditando.id}`, payload);
      } else {
        // Rotina de Criação (POST)
        await api.post('/usuarios', payload);
      }
      
      limparFormulario();
      carregarUsuarios(); // Recarrega a tabela na página atual
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao salvar o leitor.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este leitor?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      carregarUsuarios();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao excluir o leitor.');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <Users size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Gestão de Leitores</h1>
      </div>

      {/* Formulário de Cadastro / Edição */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm relative">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">
          {usuarioEditando ? 'Editar Leitor' : 'Novo Leitor'}
        </h2>
        
        {usuarioEditando && (
          <button 
            onClick={limparFormulario}
            className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600"
            title="Cancelar Edição"
          >
            <X size={20} />
          </button>
        )}

        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSalvar} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nome Completo</label>
            <input
              type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">CPF</label>
            <input
              type="text" required value={cpf} onChange={(e) => setCpf(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">E-mail</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Telefone</label>
            <input
              type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-4 flex justify-end mt-2">
            <button
              type="submit" disabled={loading}
              className={`rounded-md px-6 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                usuarioEditando ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processando...' : (usuarioEditando ? 'Salvar Alterações' : 'Cadastrar Leitor')}
            </button>
          </div>
        </form>
      </div>

      {/* Barra de Pesquisa */}
      <form onSubmit={handleBuscar} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar leitor por nome ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-800 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          <Search size={16} className="inline mr-2" />
          Buscar
        </button>
      </form>

      {/* Tabela de Leitores */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">CPF</th>
                <th className="px-6 py-3 font-medium">E-mail</th>
                <th className="px-6 py-3 font-medium">Telefone</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                    Nenhum leitor encontrado.
                  </td>
                </tr>
              ) : (
                usuarios.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{user.nome}</td>
                    <td className="px-6 py-4">{user.cpf}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.telefone || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditarClick(user)}
                        className="mr-3 inline-flex items-center gap-1 text-amber-600 transition-colors hover:text-amber-800"
                        title="Editar"
                      >
                        <Edit size={16} /> Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(user.id)}
                        className="inline-flex items-center gap-1 text-red-600 transition-colors hover:text-red-800"
                        title="Excluir"
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

        {/* Rodapé de Paginação */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3">
          <span className="text-sm text-zinc-500">
            Página <span className="font-semibold text-zinc-800">{paginaAtual}</span> de <span className="font-semibold text-zinc-800">{totalPaginas || 1}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-white"
            >
              Anterior
            </button>
            <button
              onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas || totalPaginas === 0}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-white"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}