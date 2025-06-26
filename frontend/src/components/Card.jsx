import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Card({ 
  title, 
  children,
  showBackButton = true,
  onBackClick, // Nova prop para controle customizado
  backButtonVariant = 'navigate' // 'navigate' ou 'close'
}) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      // Se houver uma função customizada, usa ela
      onBackClick();
    } else if (backButtonVariant === 'close') {
      // Comportamento padrão para fechar (não faz nada aqui, precisa ser controlado pelo parent)
      return;
    } else {
      // Comportamento padrão de navegação
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col bg-[var(--cinza-claro)] rounded-xl shadow-md max-w-2/5 w-full">
      {/* Cabeçalho */}
      <div className="flex bg-[var(--verde)] text-white rounded-t-xl text-center font-bold text-lg p-4">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="flex items-center text-[var(--cinza-claro)] hover:text-white text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {backButtonVariant === 'close' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
            {backButtonVariant === 'close' ? 'Fechar' : 'Voltar'}
          </button>
        )}
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
