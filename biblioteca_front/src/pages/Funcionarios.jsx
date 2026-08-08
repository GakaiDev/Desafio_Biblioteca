import { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldCheck, User, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isAdminForm, setIsAdminForm] = useState(false);
  
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const myEmail = localStorage.getItem('userName'); 

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    carregarFuncionarios();
  }, [isAdmin, navigate]);

  const carregarFuncionarios = async () => {
    try {
      const response = await api.get('/funcionarios');
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar equipe:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !email) {
      setErro('Nome e E-mail são obrigatórios.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await api.post('/funcionarios', {
        nome,
        email,
        admin: isAdminForm
      });
      
      setNome('');
      setEmail('');
      setIsAdminForm(false);
      
      carregarFuncionarios();
      alert('Funcionário cadastrado! A senha temporária foi enviada para o e-mail informado.');
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao cadastrar funcionário. Verifique os dados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover o acesso deste funcionário?')) return;

    try {
      await api.delete(`/funcionarios/${id}`);
      setFuncionarios(funcionarios.filter((f) => f.id !== id));
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao excluir funcionário.');
      console.error(error);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <ShieldCheck size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Gestão da Equipe</h1>
      </div>

      {/* Formulário de Cadastro */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">Cadastrar Novo Bibliotecário</h2>
        
        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nome Completo *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: João da Silva"
            />
          </div>
          
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">E-mail Institucional *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="joao@mossoro.rn.gov.br"
            />
          </div>

          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="adminCheck"
              checked={isAdminForm}
              onChange={(e) => setIsAdminForm(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="adminCheck" className="text-sm font-medium text-zinc-700">
              Acesso Admin
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[38px] items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={16} />
            {loading ? 'Processando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      {/* Listagem de Funcionários */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
            <tr>
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium">Nível de Acesso</th>
              <th className="px-6 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {funcionarios.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            ) : (
              funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="transition-colors hover:bg-zinc-50">
                  <td className="px-6 py-4 font-medium text-zinc-900">{funcionario.nome || 'Não informado'}</td>
                  <td className="px-6 py-4">{funcionario.email}</td>
                  <td className="px-6 py-4">
                    {funcionario.admin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                        <ShieldAlert size={12} /> Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                        <User size={12} /> Bibliotecário
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {funcionario.email !== myEmail ? (
                      <button
                        onClick={() => handleDelete(funcionario.id)}
                        className="inline-flex items-center gap-1 text-red-600 transition-colors hover:text-red-800"
                        title="Remover acesso"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400">Sua conta</span>
                    )}
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