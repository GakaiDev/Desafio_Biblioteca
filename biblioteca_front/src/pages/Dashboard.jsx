import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Users, ArrowRightLeft, AlertTriangle, Clock, CalendarDays, UserPlus } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const [dados, setDados] = useState({
    metricas: { total_livros: 0, livros_emprestados: 0, total_usuarios: 0, emprestimos_ativos: 0 },
    atrasados: [],
    emprestimos_hoje: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      const response = await api.get('/dashboard/resumo');
      setDados(response.data);
    } catch (error) {
      console.error('Erro ao carregar os dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  if (loading) {
    return <div className="p-8 text-zinc-500">Carregando métricas...</div>;
  }

  return (
    <div className="max-w-6xl">
      {/* Cabeçalho com Botões de Ação Rápida */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-zinc-800">Visão Geral</h1>
        
        <div className="flex gap-3">
          <Link
            to="/dashboard/usuarios"
            className="flex items-center gap-2 rounded-md bg-white border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <UserPlus size={16} className="text-emerald-600" />
            Novo Leitor
          </Link>
          <Link
            to="/dashboard/emprestimos"
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <ArrowRightLeft size={16} />
            Realizar Empréstimo
          </Link>
        </div>
      </div>

      {/* Cartões de Métricas (KPIs) */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500">Total do Acervo</h3>
            <Book size={20} className="text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-zinc-800">{dados.metricas.total_livros}</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500">Livros Emprestados</h3>
            <ArrowRightLeft size={20} className="text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-zinc-800">{dados.metricas.livros_emprestados}</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500">Leitores Cadastrados</h3>
            <Users size={20} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-zinc-800">{dados.metricas.total_usuarios}</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500">Empréstimos Ativos</h3>
            <Clock size={20} className="text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-zinc-800">{dados.metricas.emprestimos_ativos}</p>
        </div>
      </div>

      {/* Tabelas Inferiores divididas em duas colunas no Desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Tabela de Alertas (Esquerda) */}
        <div className="rounded-lg border border-red-200 bg-white shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 p-4 rounded-t-lg">
            <AlertTriangle size={20} className="text-red-600" />
            <h2 className="font-semibold text-red-800">Alertas de Atraso</h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Livro</th>
                  <th className="px-4 py-3 font-medium">Leitor</th>
                  <th className="px-4 py-3 font-medium text-right">Atraso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {dados.atrasados.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-zinc-500">
                      Nenhuma devolução pendente em atraso.
                    </td>
                  </tr>
                ) : (
                  dados.atrasados.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{item.livro}</td>
                      <td className="px-4 py-3">{item.leitor}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                          {item.dias_atraso} {item.dias_atraso === 1 ? 'dia' : 'dias'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela Movimentação do Dia (Direita) */}
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 p-4 rounded-t-lg">
            <CalendarDays size={20} className="text-blue-600" />
            <h2 className="font-semibold text-zinc-800">Movimentação de Hoje</h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Livro</th>
                  <th className="px-4 py-3 font-medium">Leitor</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {dados.emprestimos_hoje.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-zinc-500">
                      Nenhum empréstimo registrado hoje.
                    </td>
                  </tr>
                ) : (
                  dados.emprestimos_hoje.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{item.livro}</td>
                      <td className="px-4 py-3">{item.leitor}</td>
                      <td className="px-4 py-3 text-right">
                        {item.devolvido ? (
                           <span className="text-xs font-medium text-green-600">Devolvido hoje</span>
                        ) : (
                           <span className="text-xs font-medium text-amber-600">Saiu hoje</span>
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
    </div>
  );
}