import React, { useEffect, useState } from 'react';

export default function CampeonatosInscritos() {
  const [inscricoes, setInscricoes] = useState([]);
  const [inscricaoParaExcluir, setInscricaoParaExcluir] = useState(null);
  const [popupConfirmacao, setPopupConfirmacao] = useState(false);

  useEffect(() => {
    fetch('/api/campeonatos/inscritos')
      .then(res => res.json())
      .then(data => setInscricoes(data));
  }, []);

  const confirmarExclusao = (inscricao) => {
    setInscricaoParaExcluir(inscricao);
    setPopupConfirmacao(true);
  };

  const cancelarExclusao = () => {
    setInscricaoParaExcluir(null);
    setPopupConfirmacao(false);
  };

  const excluirInscricao = async () => {
    if (!inscricaoParaExcluir) return;

    try {
      const res = await fetch(`/api/campeonatos/desinscrever`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campeonatoId: inscricaoParaExcluir.campeonatoId,
          timeId: inscricaoParaExcluir.timeId,
        }),
      });

      if (res.ok) {
        setInscricoes((prev) => 
          prev.filter(i => i.campeonatoId !== inscricaoParaExcluir.campeonatoId || i.timeId !== inscricaoParaExcluir.timeId)
        );
      } else {
        const errorData = await res.json();
        alert(`Erro ao remover inscrição: ${errorData.message}`);
      }

    } catch (error) {
      // O erro estava sendo ignorado aqui. Agora, ele é usado para exibir a mensagem completa.
      console.error("Erro ao tentar remover a inscrição:", error);
      alert("Erro ao tentar remover a inscrição. Veja o console para mais detalhes.");
    }

    setInscricaoParaExcluir(null);
    setPopupConfirmacao(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-900">Meus Campeonatos</h1>

      {inscricoes.length === 0 ? (
        <p className="text-center text-gray-500">Você não está inscrito em nenhum campeonato.</p>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow max-w-3xl mx-auto">
          {inscricoes.map((inscricao) => (
            <div key={`${inscricao.campeonatoId}-${inscricao.timeId}`} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <p className="font-semibold">{inscricao.campeonato.nome} <span className="text-gray-500">com o time {inscricao.time.nome}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Ver campeonato ainda não implementado')}
                  className="bg-lime-600 text-white text-sm px-3 py-1 rounded hover:bg-lime-700"
                >
                  Ver Campeonato
                </button>
                <button
                  onClick={() => confirmarExclusao(inscricao)}
                  className="text-red-600 hover:underline text-sm"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
          <p className="text-sm text-right mt-2 text-gray-600">
            {inscricoes.length} inscrição(ões)
          </p>
        </div>
      )}

      {popupConfirmacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg border-t-8 border-lime-600">
            <p className="text-lg font-semibold text-center mb-4">Você tem certeza que deseja remover a inscrição?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={excluirInscricao}
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