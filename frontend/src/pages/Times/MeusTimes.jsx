import React, { useState } from 'react';

export default function CriarTime() {
  const [popupAberto, setPopupAberto] = useState(false);
  const [nomeTime, setNomeTime] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);

  const abrirPopup = () => {
    setPopupAberto(true);
    setConfirmacao(false);
    setNomeTime('');
  };

  const avancar = () => {
    if (nomeTime.trim()) {
      setConfirmacao(true);
    }
  };

  const fecharConfirmacao = () => {
    setConfirmacao(false);
    setPopupAberto(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-teal-400 p-8">
      <button
        onClick={abrirPopup}
        className="bg-white text-green-700 px-6 py-3 rounded-xl shadow-lg hover:bg-green-100"
      >
        Novo Time
      </button>

      {popupAberto && !confirmacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[320px]">
            <h2 className="text-xl font-bold mb-4 text-center">Criar Novo Time</h2>
            <input
              type="text"
              placeholder="Nome do time"
              value={nomeTime}
              onChange={(e) => setNomeTime(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={avancar}
              disabled={!nomeTime.trim()}
              className={`w-full py-2 rounded text-white ${
                nomeTime.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Avançar
            </button>
          </div>
        </div>
      )}

      {confirmacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-green-100 text-green-800 p-6 rounded-xl shadow-lg text-center w-[320px]">
            <h2 className="text-2xl font-bold mb-4">Time "{nomeTime}" criado com sucesso!</h2>
            <button
              onClick={fecharConfirmacao}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}