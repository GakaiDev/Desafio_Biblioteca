import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Search, MapPin } from 'lucide-react';
import api from '../api/axios';
import axios from 'axios'; // Usado exclusivamente para o ViaCEP

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  
  // Estados do endereço (ViaCEP)
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setErro('CEP inválido. Digite os 8 números.');
      return;
    }

    setLoadingCep(true);
    setErro('');

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (response.data.erro) {
        setErro('CEP não encontrado.');
        return;
      }
      setLogradouro(response.data.logradouro);
      setBairro(response.data.bairro);
      setCidade(response.data.localidade);
      setUf(response.data.uf);
    } catch (error) {
      setErro('Erro ao buscar o CEP na API ViaCEP.');
      console.error(error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !cpf || !telefone || !email) {
      setErro('Os campos Nome, CPF, Telefone e E-mail são obrigatórios.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await api.post('/usuarios', {
        usuario_biblioteca: {
          nome, cpf, telefone, email, cep, logradouro, bairro, cidade, uf
        }
      });
      
      // Limpar formulário
      setNome(''); setCpf(''); setTelefone(''); setEmail('');
      setCep(''); setLogradouro(''); setBairro(''); setCidade(''); setUf('');
      
      carregarUsuarios();
      alert('Usuário cadastrado com sucesso! A senha foi enviada para o e-mail do usuário.');
    } catch (error) {
      setErro('Erro ao salvar o usuário. Verifique se o CPF ou E-mail já estão cadastrados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (error) {
      alert('Erro ao excluir. O usuário pode ter empréstimos pendentes.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-zinc-800">
        <Users size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Usuários da Biblioteca</h1>
      </div>

      {/* Formulário de Cadastro */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">Cadastrar Novo Leitor</h2>
        
        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Dados Pessoais */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nome Completo *</label>
            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">CPF *</label>
            <input type="text" required value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Apenas números" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Telefone *</label>
            <input type="text" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">E-mail *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          
          <div className="col-span-full mt-2 mb-1 flex items-center gap-2 border-b border-zinc-200 pb-2 text-sm font-semibold text-zinc-700">
            <MapPin size={16} /> Endereço
          </div>

          {/* Integração ViaCEP */}
          <div className="lg:col-span-1 flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-zinc-700">CEP</label>
              <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000000" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <button type="button" onClick={buscarCep} disabled={loadingCep} className="flex h-[38px] items-center justify-center rounded-md bg-zinc-200 px-3 py-2 text-zinc-700 transition-colors hover:bg-zinc-300 disabled:opacity-50" title="Buscar CEP">
              <Search size={16} />
            </button>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Logradouro</label>
            <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-zinc-50" />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Bairro</label>
            <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-zinc-50" />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Cidade</label>
            <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-zinc-50" />
          </div>
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">UF</label>
            <input type="text" value={uf} onChange={(e) => setUf(e.target.value)} maxLength={2} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-zinc-50 uppercase" />
          </div>

          <div className="lg:col-span-4 flex justify-end mt-4">
            <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
              <Plus size={16} />
              {loading ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>

      {/* Listagem de Usuários */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-700">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">CPF</th>
                <th className="px-6 py-3 font-medium">Contato</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{usuario.nome}</td>
                    <td className="px-6 py-4">{usuario.cpf}</td>
                    <td className="px-6 py-4">
                      <div>{usuario.telefone}</div>
                      <div className="text-xs text-zinc-500">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(usuario.id)} className="inline-flex items-center gap-1 text-red-600 transition-colors hover:text-red-800" title="Excluir usuário">
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