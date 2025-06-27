import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JogoEmAndamento() {
  const { partidaId } = useParams(); // Pega o ID da partida da URL
  const navigate = useNavigate();

  // Aqui você faria uma chamada à API para buscar os dados da partida
  // e se conectaria ao WebSocket para receber atualizações do cronômetro.

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 bg-gray-700 p-2 rounded-lg">
          &larr; Voltar para o Campeonato
        </button>

        <h1 className="text-4xl font-bold mb-4">Partida: {partidaId}</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-2xl">
            CRONÔMETRO AQUI
          </p>
          <div className="mt-6 space-x-4">
            <button className="bg-green-600 p-3 rounded-lg">Iniciar/Pausar</button>
            <button className="bg-yellow-500 p-3 rounded-lg">Adicionar Acréscimo</button>
            <button className="bg-red-600 p-3 rounded-lg">Finalizar Tempo</button>
          </div>
        </div>
      </div>
    </div>
  );
}