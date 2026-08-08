import { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, ScanBarcode, CheckCircle, RefreshCw, Filter } from 'lucide-react';
import api from '../api/axios';

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  const [usuarioId, setUsuarioId] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState(''); 
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    carregarEmprestimos(paginaAtual, busca, statusFiltro);
  }, [paginaAtual, statusFiltro]);

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const carregarEmprestimos = async (pagina = paginaAtual, termo = busca, status = statusFiltro) => {
    try {
      const res = await api.get('/emprestimos', {
        params: { page: pagina, busca: termo, status: status }
      });
      setEmprestimos(res.data.emprestimos);
      setTotalPaginas(res.data.meta.total_pages);
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    carregarEmprestimos(1, busca, statusFiltro);
  };

  const handleMudarStatusFiltro = (e) => {
    const novoStatus = e.target.value;
    setStatusFiltro(novoStatus);
    setPaginaAtual(1); 
  };

  const handleCreateEmprestimo = async (e) => {
    e.preventDefault();
    if (!usuarioId || !codigoBarras) {
      setErro('Selecione o leitor e faça a leitura do código de barras.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await api.post('/emprestimos', {
        usuario_biblioteca_id: usuarioId,
        codigo_barras: codigoBarras
      });
      
      setCodigoBarras('');
      carregarEmprestimos(); 
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao registrar empréstimo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevolucao = async (id) => {
    if (!window.confirm('Confirmar a devolução deste exemplar?')) return;
    try {
      await api.patch(`/emprestimos/${id}/devolver`);
      carregarEmprestimos();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao registrar devolução.');
    }
  };

  const handleRenovacao = async (id) => {
    if (!window.confirm('Deseja renovar este empréstimo por mais 15 dias úteis?')) return;
    try {
      await api.patch(`/emprestimos/${id}/renovar`);
      carregarEmprestimos();
      alert('Prazo renovado com sucesso!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao renovar.');
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <ArrowRightLeft size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Gestão de Empréstimos</h1>
      </div>

      {/* Balcão de Saída */}
      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50/50 p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-blue-800">
          <ScanBarcode size={20} />
          <h2 className="text-lg font-semibold">Balcão de Saída (Bipe)</h2>
        </div>
        
        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-white p-3 text-sm text-red-600 shadow-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleCreateEmprestimo} className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 md:max-w-sm">
            <label className="mb-1 block text-sm font-medium text-blue-900">Leitor</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-blue-400" size={18} />
              <select
                required
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                className="w-full rounded-md border border-blue-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione o leitor...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome} ({u.cpf})</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-blue-900">Código de Barras do Exemplar</label>
            <div className="relative">
              <ScanBarcode className="absolute left-3 top-2.5 text-blue-400" size={18} />
              <input
                type="text"
                required
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                placeholder="Ex: 987654321"
                className="w-full rounded-md border border-blue-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[38px] items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <CheckCircle size={16} />
            {loading ? 'Processando...' : 'Registrar Saída'}
          </button>
        </form>
      </div>

      {/* Controles de Busca e Filtro (Novo) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleBuscar} className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Buscar por leitor ou código de barras..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full max-w-md rounded-md border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select
            value={statusFiltro}
            onChange={handleMudarStatusFiltro}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos os Movimentos</option>
            <option value="pendentes">Em Curso (Pendentes)</option>
            <option value="atrasados">Atrasados</option>
            <option value="devolvidos">Devolvidos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
              <tr>
                <th className="px-6 py-3 font-medium">Obra</th>
                <th className="px-6 py-3 font-medium">Código Físico</th>
                <th className="px-6 py-3 font-medium">Leitor</th>
                <th className="px-6 py-3 font-medium">Data Saída</th>
                <th className="px-6 py-3 font-medium">Previsão</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {emprestimos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                    Nenhuma movimentação encontrada para estes filtros.
                  </td>
                </tr>
              ) : (
                emprestimos.map((emp) => (
                  <tr key={emp.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{emp.exemplar?.livro?.titulo}</td>
                    <td className="px-6 py-4 font-mono text-xs">{emp.exemplar?.codigo_barras}</td>
                    <td className="px-6 py-4">{emp.usuario_biblioteca?.nome}</td>
                    <td className="px-6 py-4">{formatarData(emp.data_emprestimo)}</td>
                    <td className="px-6 py-4">{formatarData(emp.data_devolucao)}</td>
                    <td className="px-6 py-4">
                      {emp.devolvido ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Devolvido</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Em curso</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!emp.devolvido && (
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleRenovacao(emp.id)}
                            className="inline-flex items-center gap-1 text-emerald-600 transition-colors hover:text-emerald-800 font-medium"
                            title="Renovar prazo"
                          >
                            <RefreshCw size={16} /> Renovar
                          </button>
                          
                          <button
                            onClick={() => handleDevolucao(emp.id)}
                            className="text-blue-600 transition-colors hover:text-blue-800 font-medium"
                          >
                            Devolver
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