import React, { useEffect, useState } from 'react';

export default function CampeonatosInscritos() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [popupConfirmacao, setPopupConfirmacao] = useState(false);

  useEffect(() => {
    fetch('/api/campeonatos/inscritos')
      .then(res => res.json())
      .then(data => setCampeonatos(data));
  }, []);

  const confirmarExclusao = (id) => {
    setIdParaExcluir(id);
    setPopupConfirmacao(true);
  };

  const cancelarExclusao = () => {
    setIdParaExcluir(null);
    setPopupConfirmacao(false);
  };

  const excluirCampeonato = async () => {
    if (!idParaExcluir) return;

    const res = await fetch(`/api/campeonatos/inscritos/${idParaExcluir}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setCampeonatos((prev) => prev.filter(c => c._id !== idParaExcluir));
    }

    setIdParaExcluir(null);
    setPopupConfirmacao(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-900">Campeonatos Inscritos</h1>

      {campeonatos.length === 0 ? (
        <p className="text-center text-gray-500">Você não está inscrito em nenhum campeonato.</p>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow max-w-3xl mx-auto">
          {campeonatos.map((camp) => (
            <div key={camp._id} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <p className="font-semibold">{camp.nome}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Ver campeonato ainda não implementado')}
                  className="bg-lime-600 text-white text-sm px-3 py-1 rounded hover:bg-lime-700"
                >
                  Ver Campeonato
                </button>
                <button
                  onClick={() => confirmarExclusao(camp._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
          <p className="text-sm text-right mt-2 text-gray-600">
            {campeonatos.length} campeonato(s) inscrito(s)
          </p>
        </div>
      )}

      {/* Popup de Confirmação */}
      {popupConfirmacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg border-t-8 border-lime-600">
            <p className="text-lg font-semibold text-center mb-4">Você tem certeza que deseja excluir?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={excluirCampeonato}
                className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700"
              >
                SIM
              </button>
              <button
                onClick={cancelarExclusao}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                NÃO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}