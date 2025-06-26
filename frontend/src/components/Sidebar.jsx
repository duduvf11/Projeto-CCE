import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="bg-[var(--verde-piscina-escuro)] h-full p-6 w-1/6">
      <ul className="text-[#D9D9D9] font-semibold">
        <li className="mb-4">
          <Link to="/" className="hover:underline">Página Inicial</Link>
        </li>
        <li className="mb-4">
          <Link to="/meus-campeonatos" className="hover:underline">Meus campeonatos</Link>
        </li>
        <li className="mb-4">
          <Link to="/meus-times" className="hover:underline">Meus Times</Link>
        </li>
        <li className="mb-4">
            <Link to="/campeonatos-inscritos" className="hover:underline">Campeonatos Inscritos</Link>
        </li>
        <li className="mb-4">
          <Link to="/partida/123" className="hover:underline">Controle Jogo</Link>
        </li>

      </ul>
    </div>
  )
}

export default Sidebar