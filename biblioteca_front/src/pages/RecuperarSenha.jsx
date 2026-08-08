import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import api from '../api/axios';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      const res = await api.post('/recuperar_senha', { email });
      setMensagem(res.data.message);
      setEmail('');
    } catch (error) {
      setMensagem('Erro ao solicitar recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border border-zinc-200">
        <div className="mb-6 flex flex-col items-center justify-center text-center text-zinc-800">
          <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold">Recuperar Acesso</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Digite seu e-mail institucional. Enviaremos uma senha temporária.
          </p>
        </div>

        {mensagem && (
          <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-700 border border-blue-200">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="bibliotecario@mossoro.rn.gov.br"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? 'Enviando...' : 'Receber Senha Temporária'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600">
            <ArrowLeft size={16} /> Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}