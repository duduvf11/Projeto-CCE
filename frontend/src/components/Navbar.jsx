import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Auth/login');
  };

  return (
    <nav className="bg-[var(--verde-claro)] p-4 flex justify-between items-center w-full">
      <div className="flex items-center ml-6">
        <img src="/src/assets/favicon/favicon.ico" alt="Logo" className="h-8 mr-2" />
        <h1 className="text-white text-2xl font-medium ml-2">
          {user ? `Olá, ${user.nome}` : 'Bem-vindo'}
        </h1>
      </div>

      <div className="flex space-x-4 mr-6 font-semibold">
        {!user ? (
          <>
            <Link to="/Auth/login">
              <button className="bg-[var(--verde-piscina-escuro)] text-white px-4 py-2 rounded-lg hover:bg-[var(--verde-piscina)]">Login</button>
            </Link>
            <Link to="/Auth/register">
              <button className="bg-[var(--verde-piscina-escuro)] text-white px-4 py-2 rounded-lg hover:bg-[var(--verde-piscina)]">Registrar</button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-[var(--verde-piscina-escuro)] text-white px-4 py-2 rounded-lg hover:bg-[var(--verde-piscina)]"
          >
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
