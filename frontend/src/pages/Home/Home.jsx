import React, { useEffect, useState } from 'react';

export default function TelaInicial() {
  const [proximosCampeonatos, setProximosCampeonatos] = useState([]);
  const [jogosAoVivo, setJogosAoVivo] = useState([]);
  const [filtro, setFiltro] = useState('andamento');
  const [campeonatos, setCampeonatos] = useState([]);

  useEffect(() => {
    fetch('') //Os dois campeonatos mais próximos
      .then(res => res.json())
      .then(data => setProximosCampeonatos(data.slice(0, 2)));

    fetch('') //Jogos ao vivo
      .then(res => res.json())
      .then(data => setJogosAoVivo(data));

    fetch(``) //Campeonatos por status: Em andamento, finalizados, próximos
      .then(res => res.json())
      .then(data => setCampeonatos(data));
  }, [filtro]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6">
      {/* Campeonatos mais próximos */}
      <div className="mb-6">
    {proximosCampeonatos.length === 0 ? (
      <div className="bg-white text-center text-red-500 font-semibold p-4 rounded shadow">
        Campeonatos não encontrados
      </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proximosCampeonatos.map((camp, i) => (
          <div key={i} className="bg-cyan-900 text-white p-4 rounded shadow">
            <p className="text-sm mb-1">{camp.dataHora}</p>
            <p className="font-bold text-lg">{camp.timeA} x {camp.timeB}</p>
            <span className="bg-blue-500 px-2 py-1 text-xs rounded mt-2 inline-block">{camp.nome}</span>
          </div>
        ))}
      </div>
      )}
      </div>


      {/* Jogos ao vivo */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-green-900">Jogos ao Vivo</h2>
        {jogosAoVivo.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum jogo ao vivo.</p>
        ) : (
          <ul className="space-y-2">
            {jogosAoVivo.map((jogo, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
                <span>{jogo.timeA} {jogo.golsA} x {jogo.golsB} {jogo.timeB}</span>
                <span className="text-xs text-blue-600">{jogo.nomeCampeonato}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="text-center mt-4">
          <button className="text-sm text-blue-600 hover:underline">Ver todos os jogos</button>
        </div>
      </div>

      {/* Campeonatos por status */}
      <div>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFiltro('andamento')}
            className={`px-4 py-1 rounded ${
              filtro === 'andamento' ? 'bg-lime-600 text-white' : 'bg-gray-200'
            }`}
          >
            CAMPEONATOS EM ANDAMENTO
          </button>
          <button
            onClick={() => setFiltro('finalizados')}
            className={`px-4 py-1 rounded ${
              filtro === 'finalizados' ? 'bg-lime-600 text-white' : 'bg-gray-200'
            }`}
          >
            CAMPEONATOS FINALIZADOS
          </button>
          <button
            onClick={() => setFiltro('proximos')}
            className={`px-4 py-1 rounded ${
              filtro === 'proximos' ? 'bg-lime-600 text-white' : 'bg-gray-200'
            }`}
          >
            PRÓXIMOS CAMPEONATOS
          </button>
        </div>

        <div className="bg-white rounded p-4 shadow">
          {campeonatos.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum campeonato encontrado.</p>
          ) : (
            campeonatos.map((camp, i) => (
              <div key={i} className="border-b py-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{camp.nome}</p>
                  <p className="text-sm text-gray-500">{camp.timeA} x {camp.timeB} - {camp.dataHora}</p>
                </div>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">{camp.tipo}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}