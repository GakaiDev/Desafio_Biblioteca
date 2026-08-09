import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Book, Users, RefreshCw, Tags, LogOut, Menu, UserSquare2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icone: LayoutDashboard, label: 'Visão Geral' },
    { path: '/dashboard/livros', icone: Book, label: 'Acervo' },
    { path: '/dashboard/usuarios', icone: Users, label: 'Leitores' },
    { path: '/dashboard/emprestimos', icone: RefreshCw, label: 'Empréstimos' },
    { path: '/dashboard/categorias', icone: Tags, label: 'Categorias' },
    { path: '/dashboard/funcionarios', icone: UserSquare2, label: 'Equipe' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100">
      
      <aside className="w-64 flex-shrink-0 bg-blue-700 flex flex-col shadow-xl">
        
        <div className="flex h-16 items-center px-6 border-b border-blue-600/50">
          <h1 className="text-lg font-serif font-bold text-white tracking-wide">
            Biblioteca Ney Pontes
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isAtivo = location.pathname === item.path;
            const Icone = item.icone;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isAtivo
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-blue-50 hover:bg-blue-600 hover:text-white' 
                }`}
              >
                <Icone size={20} className={isAtivo ? 'text-blue-600' : 'text-blue-200'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-600/50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-blue-100 transition-colors rounded-md hover:bg-blue-800 hover:text-white"
          >
            <LogOut size={20} className="text-blue-300" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Toaster position="top-right" reverseOrder={false} />
        <header className="md:hidden flex h-16 items-center justify-between bg-blue-700 px-4 shadow-sm">
          <span className="text-lg font-bold text-white">Biblioteca</span>
          <button className="text-white">
            <Menu size={24} />
          </button>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}