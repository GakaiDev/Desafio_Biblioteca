import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Book, Bookmark, Users, ArrowRightLeft, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.delete('/logout');
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const navItems = [
    { name: 'Visão Geral', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Categorias', path: '/dashboard/categorias', icon: Bookmark },
    { name: 'Acervo de Livros', path: '/dashboard/livros', icon: Book },
    { name: 'Usuários', path: '/dashboard/usuarios', icon: Users },
    { name: 'Empréstimos', path: '/dashboard/emprestimos', icon: ArrowRightLeft },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Equipe', path: '/dashboard/funcionarios', icon: ShieldCheck });
  }

  return (
    <div className="flex h-screen w-full bg-zinc-100">
      <aside className="flex w-64 flex-col border-r border-zinc-200 bg-white">
        <div className="flex h-16 items-center justify-center border-b border-zinc-200">
          <h2 className="font-bold text-zinc-800">Biblioteca Ney Pontes</h2>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            // Lógica ajustada: O item "Visão Geral" só fica ativo se a rota for exatamente /dashboard
            const isActive = item.path === '/dashboard' 
              ? location.pathname === '/dashboard' 
              : location.pathname.startsWith(item.path);
            
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}