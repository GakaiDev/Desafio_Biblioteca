import { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, ScanBarcode, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../api/axios';

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  const [usuarioId, setUsuarioId] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resEmp, resUsu] = await Promise.all([
        api.get('/emprestimos'),
        api.get('/usuarios')
      ]);
      setEmprestimos(resEmp.data);
      setUsuarios(resUsu.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
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
      carregarDados();
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
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao registrar devolução.');
    }
  };

  const handleRenovacao = async (id) => {
    if (!window.confirm('Deseja renovar este empréstimo por mais 15 dias úteis?')) return;
    try {
      await api.patch(`/emprestimos/${id}/renovar`);
      carregarDados();
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

      {/* Painel do Balcão (Formulário de Saída) */}
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
                autoFocus 
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

      {/* Histórico de Movimentações */}
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
                    Nenhuma movimentação registrada.
                  </td>
                </tr>
              ) : (
                emprestimos.map((emp) => (
                  <tr key={emp.id} className="transition-colors hover:bg-zinc-50">
                    
                    {/* 1. OBRA */}
                    <td className="px-6 py-4 font-medium text-zinc-900">{emp.exemplar?.livro?.titulo}</td>
                    
                    {/* 2. CÓDIGO FÍSICO */}
                    <td className="px-6 py-4 font-mono text-xs">{emp.exemplar?.codigo_barras}</td>
                    
                    {/* 3. LEITOR */}
                    <td className="px-6 py-4">{emp.usuario_biblioteca?.nome}</td>
                    
                    {/* 4. DATA SAÍDA */}
                    <td className="px-6 py-4">{formatarData(emp.data_emprestimo)}</td>
                    
                    {/* 5. PREVISÃO */}
                    <td className="px-6 py-4">{formatarData(emp.data_devolucao)}</td>
                    
                    {/* 6. STATUS */}
                    <td className="px-6 py-4">
                      {emp.devolvido ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Devolvido</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Em curso</span>
                      )}
                    </td>
                    
                    {/* 7. AÇÕES */}
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
      </div>
    </div>
  );
}