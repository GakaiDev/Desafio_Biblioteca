import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', {
        bibliotecario: { email, password }
      });

      const authHeader = response.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        localStorage.setItem('token', token);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const meResponse = await api.get('/me');

        const adminStatus = meResponse.data.admin ? 'true' : 'false';
        localStorage.setItem('isAdmin', meResponse.data.admin);
        localStorage.setItem('userName', meResponse.data.nome || meResponse.data.email);
        
        if (meResponse.data.senha_provisoria) {
          localStorage.setItem('senha_provisoria', 'true');
          navigate('/primeiro-acesso');
        } else {
          localStorage.removeItem('senha_provisoria');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border border-zinc-200">
        <div className="mb-8 flex flex-col items-center justify-center text-zinc-800">
          <BookOpen size={48} className="mb-2 text-blue-600" />
          <h1 className="text-2xl font-bold">Biblioteca Ney Pontes</h1>
          <p className="text-sm text-zinc-500">Acesso Restrito - Bibliotecários</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-zinc-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="admin@mossoro.rn.gov.br"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-zinc-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <Link to="/recuperar-senha" className="text-xs font-medium text-blue-600 hover:underline" >Esqueci minha senha</Link>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}