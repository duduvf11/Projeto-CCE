import {} from 'react'
import { Link } from 'react-router-dom'


function Navbar() {
  return (
    <nav className="bg-[var(--verde-claro)] p-4 flex justify-between items-center w-full">
        <div className="flex items-center ml-6">
          <img src="./src/assets/favicon/favicon.ico" alt="Logo" className="h-8 mr-2" />
          <h1 className="text-white text-2xl font-medium ml-2">Nome de usuário</h1>
        </div>
        <div className="flex space-x-4 mr-6 font-semibold">
            <Link to="/Auth/login" className="text-[#ffffff]"><button className="bg-[var(--verde-piscina-escuro)] border-transparent px-4 py-2 rounded-lg hover:bg-[var(--verde-piscina)]">Login</button></Link>
            <Link to="/Auth/register" className="text-[#ffffff]"><button className="bg-[var(--verde-piscina-escuro)] border-transparent px-4 py-2 rounded-lg hover:bg-[var(--verde-piscina)]">Registrar</button></Link>
        </div>
    </nav>
  )
}

export default Navbar