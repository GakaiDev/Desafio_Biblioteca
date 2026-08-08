import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Users, RefreshCw, AlertTriangle, PlusCircle, ScanBarcode } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [metricas, setMetricas] = useState({
    total_acervo: 0,
    leitores_ativos: 0,
    emprestimos_ativos: 0,
    emprestimos_atrasados: 0
  });
  
  const [movimentacoesHoje, setMovimentacoesHoje] = useState([]);
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalMovimentacoes, setTotalMovimentacoes] = useState(0);

  useEffect(() => {
    carregarDashboard(paginaAtual);
  }, [paginaAtual]);

  const carregarDashboard = async (pagina = 1) => {
    try {
      const response = await api.get('/dashboard', {
        params: { page: pagina }
      });
      
      setMetricas(response.data.metricas);
      setMovimentacoesHoje(response.data.movimentacoes_hoje);
      
      if (response.data.meta) {
        setTotalPaginas(response.data.meta.total_pages);
        setTotalMovimentacoes(response.data.meta.total_count);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="max-w-6xl">
      {/* Cabeçalho com Ações Rápidas */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-zinc-800">Visão Geral</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/usuarios')}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-700 border border-zinc-300 transition-colors hover:bg-zinc-50"
          >
            <PlusCircle size={18} className="text-emerald-600" />
            Cadastrar Leitor
          </button>
          
          <button 
            onClick={() => navigate('/dashboard/Emprestimos')}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <ScanBarcode size={18} />
            Novo Empréstimo
          </button>
        </div>
      </div>
      
      {/* Cards de Métricas */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Book size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Volume do Acervo</p>
              <h3 className="text-2xl font-bold text-zinc-800">{metricas.total_acervo}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Leitores Cadastrados</p>
              <h3 className="text-2xl font-bold text-zinc-800">{metricas.leitores_ativos}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <RefreshCw size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Empréstimos Ativos</p>
              <h3 className="text-2xl font-bold text-zinc-800">{metricas.emprestimos_ativos}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Atrasos Pendentes</p>
              <h3 className="text-2xl font-bold text-red-600">{metricas.emprestimos_atrasados}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Movimentações Recentes */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-4 flex justify-between items-center bg-zinc-50">
          <h2 className="text-lg font-semibold text-zinc-800">Saídas de Hoje</h2>
          <span className="text-sm font-medium text-zinc-500 bg-white px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
            Total: {totalMovimentacoes}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 bg-white">
              <tr>
                <th className="px-6 py-3 font-medium">Obra</th>
                <th className="px-6 py-3 font-medium">Código Físico</th>
                <th className="px-6 py-3 font-medium">Leitor</th>
                <th className="px-6 py-3 font-medium">Devolução Prevista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {movimentacoesHoje.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                    Nenhuma saída registrada hoje.
                  </td>
                </tr>
              ) : (
                movimentacoesHoje.map((mov) => (
                  <tr key={mov.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{mov.exemplar?.livro?.titulo}</td>
                    <td className="px-6 py-4 font-mono text-xs">{mov.exemplar?.codigo_barras}</td>
                    <td className="px-6 py-4">{mov.usuario_biblioteca?.nome}</td>
                    <td className="px-6 py-4">{formatarData(mov.data_devolucao)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé de Paginação */}
        {totalMovimentacoes > 0 && (
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
        )}
      </div>
    </div>
  );
}