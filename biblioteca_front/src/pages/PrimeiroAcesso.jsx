import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function PrimeiroAcesso() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setErro('A nova senha e a confirmação não conferem.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await api.patch('/atualizar_senha', {
        bibliotecario: {
          current_password: currentPassword,
          password: password,
          password_confirmation: passwordConfirmation
        }
      });
      
      localStorage.removeItem('senha_provisoria');
      navigate('/dashboard');
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao atualizar a senha. Verifique sua senha atual.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-xl font-bold text-zinc-800">Ação Obrigatória</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Por motivos de segurança, você precisa alterar sua senha padrão no primeiro acesso ao sistema.
          </p>
        </div>

        {erro && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Senha Atual</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-zinc-200 pt-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nova Senha</label>
            <input
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Confirmar Nova Senha</label>
            <input
              type="password"
              required
              minLength="6"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <KeyRound size={16} />
            {loading ? 'Atualizando...' : 'Salvar e Acessar Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}