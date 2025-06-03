import React from 'react'
import { Link } from 'react-router-dom';

export default function Card({ title, children }) {
  return (
    <div className="flex flex-col bg-[var(--cinza-claro)] rounded-xl shadow-md max-w-2/5 w-full">
      {/* Cabeçalho*/}
      <div className="flex bg-[var(--verde)] text-white rounded-t-xl text-center font-bold text-lg p-4">
        <Link to="/" className="flex items-center text-[var(--cinza-claro)] hover:text-white text-sm ">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          Voltar
        </Link>
        <div className="flex-1 text-center">
            {title}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
