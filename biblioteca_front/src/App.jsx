import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Categorias from './pages/Categorias';
import Livros from './pages/Livros';
import Usuarios from './pages/Usuarios';
import Emprestimos from './pages/Emprestimos';
import PrimeiroAcesso from './pages/PrimeiroAcesso';
import Funcionarios from './pages/Funcionarios';
import RecuperarSenha from './pages/RecuperarSenha';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const hasSenhaProvisoria = localStorage.getItem('senha_provisoria') === 'true';

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (hasSenhaProvisoria) return <Navigate to="/primeiro-acesso" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        <Route 
          path="/primeiro-acesso" 
          element={
            !!localStorage.getItem('token') 
              ? <PrimeiroAcesso /> 
              : <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Rotas filhas injetadas no <Outlet /> do DashboardLayout */}
          <Route index element={<Dashboard />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="livros" element={<Livros />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="emprestimos" element={<Emprestimos />} />
          <Route path="funcionarios" element={<Funcionarios />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;