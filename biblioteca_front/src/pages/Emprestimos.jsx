import { useState, useEffect } from 'react';
import { Plus, ArrowRightLeft, Calendar, KeyRound, Search } from 'lucide-react';
import api from '../api/axios';

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  const [livroId, setLivroId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [senhaEmprestimo, setSenhaEmprestimo] = useState('');
  
  const [buscaLivro, setBuscaLivro] = useState('');
  const [mostrarDropdownLivro, setMostrarDropdownLivro] = useState(false);
  
  const [buscaUsuario, setBuscaUsuario] = useState('');
  const [mostrarDropdownUsuario, setMostrarDropdownUsuario] = useState(false);
  
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resEmprestimos, resLivros, resUsuarios] = await Promise.all([
        api.get('/emprestimos'),
        api.get('/livros'),
        api.get('/usuarios')
      ]);
      
      setEmprestimos(resEmprestimos.data);
      setLivrosDisponiveis(resLivros.data.filter(l => l.status === 'disponível'));
      setUsuarios(resUsuarios.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!livroId || !usuarioId || !senhaEmprestimo) {
      setErro('Selecione o livro, o leitor e informe a senha do usuário.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await api.post('/emprestimos', {
        emprestimo: {
          livro_id: livroId,
          usuario_biblioteca_id: usuarioId
        },
        senha_emprestimo: senhaEmprestimo
      });
      
      setLivroId(''); setUsuarioId(''); setSenhaEmprestimo('');
      setBuscaLivro(''); setBuscaUsuario('');
      
      carregarDados();
      alert('Empréstimo realizado com sucesso! A data de devolução foi calculada automaticamente.');
    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Erro ao realizar o empréstimo.';
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleDevolucao = async (id) => {
    if (!window.confirm('Confirmar a devolução deste livro ao acervo?')) return;

    try {
      await api.patch(`/emprestimos/${id}/devolver`);
      carregarDados(); 
      alert('Devolução registrada com sucesso!');
    } catch (error) {
      alert('Erro ao registrar devolução.');
      console.error(error);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Filtros dinâmicos das listas
  const livrosFiltrados = livrosDisponiveis.filter(l => 
    l.titulo.toLowerCase().includes(buscaLivro.toLowerCase())
  );
  
  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(buscaUsuario.toLowerCase()) || 
    u.cpf.includes(buscaUsuario)
  );

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <ArrowRightLeft size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Gerenciar Empréstimos</h1>
      </div>

      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">Registrar Novo Empréstimo</h2>
        
        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 relative">
          
          {/* Autocomplete Customizado - Livro */}
          <div className="lg:col-span-1 relative">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Livro *</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="text"
                value={buscaLivro}
                placeholder="Buscar título..."
                onChange={(e) => {
                  setBuscaLivro(e.target.value);
                  setLivroId(''); 
                  setMostrarDropdownLivro(true);
                }}
                onFocus={() => setMostrarDropdownLivro(true)}
                onBlur={() => setTimeout(() => setMostrarDropdownLivro(false), 200)}
                className="w-full rounded-md border border-zinc-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
            {/* Lista com Posicionamento Absoluto */}
            {mostrarDropdownLivro && livrosFiltrados.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg">
                {livrosFiltrados.map(l => (
                  <li
                    key={l.id}
                    onClick={() => {
                      setLivroId(l.id);
                      setBuscaLivro(l.titulo);
                      setMostrarDropdownLivro(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    #{l.id} - {l.titulo}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Autocomplete Customizado - Usuário */}
          <div className="lg:col-span-1 relative">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Leitor *</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="text"
                value={buscaUsuario}
                placeholder="Buscar nome ou CPF..."
                onChange={(e) => {
                  setBuscaUsuario(e.target.value);
                  setUsuarioId('');
                  setMostrarDropdownUsuario(true);
                }}
                onFocus={() => setMostrarDropdownUsuario(true)}
                onBlur={() => setTimeout(() => setMostrarDropdownUsuario(false), 200)}
                className="w-full rounded-md border border-zinc-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
            {/* Lista com Posicionamento Absoluto */}
            {mostrarDropdownUsuario && usuariosFiltrados.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg">
                {usuariosFiltrados.map(u => (
                  <li
                    key={u.id}
                    onClick={() => {
                      setUsuarioId(u.id);
                      setBuscaUsuario(u.nome);
                      setMostrarDropdownUsuario(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {u.nome} <span className="text-xs text-zinc-400">({u.cpf})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Senha do Leitor */}
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Senha do Leitor *</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="password"
                value={senhaEmprestimo}
                onChange={(e) => setSenhaEmprestimo(e.target.value)}
                placeholder="Senha de 6 dígitos"
                className="w-full rounded-md border border-zinc-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="lg:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={16} />
              {loading ? 'Processando...' : 'Confirmar Empréstimo'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
              <tr>
                <th className="px-6 py-3 font-medium">Livro</th>
                <th className="px-6 py-3 font-medium">Leitor</th>
                <th className="px-6 py-3 font-medium">Data do Empréstimo</th>
                <th className="px-6 py-3 font-medium">Devolução Prevista</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {emprestimos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                    Nenhum empréstimo registrado no sistema.
                  </td>
                </tr>
              ) : (
                emprestimos.map((emp) => (
                  <tr key={emp.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{emp.livro?.titulo}</td>
                    <td className="px-6 py-4">{emp.usuario_biblioteca?.nome}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Calendar size={14} className="text-zinc-400" />
                      {formatarData(emp.data_emprestimo)}
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-700">
                      {formatarData(emp.data_devolucao)}
                    </td>
                    <td className="px-6 py-4">
                    {emp.devolvido ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Devolvido
                        </span>
                    ) : (
                        <div className="flex items-center gap-2">
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                            Em andamento
                        </span>
                        <button
                            onClick={() => handleDevolucao(emp.id)}
                            className="ml-2 rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
                        >
                            Registrar Devolução
                        </button>
                        </div>
                    )}
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