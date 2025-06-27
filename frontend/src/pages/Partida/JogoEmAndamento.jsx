import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Flag, User, Shield, Zap, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function JogoEmAndamento() {
  const { partidaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [partida, setPartida] = useState(null);
  const [placar, setPlacar] = useState({ golsA: 0, golsB: 0 });
  const [tempo, setTempo] = useState("00:00");
  const [status, setStatus] = useState("Carregando...");
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os detalhes iniciais do jogo
  const fetchGameDetails = useCallback(async () => {
    try {
      // Para buscar os detalhes de um jogo, precisamos do ID do campeonato.
      // Assumindo que ele é passado via state do Link no componente VerCampeonato.
      const campeonatoId = location.state?.campeonatoId;
      if (!campeonatoId) {
          // Se não tiver o ID do campeonato, usamos dados genéricos.
          // O ideal é ter uma rota GET /game/details/:partidaId no futuro.
          console.warn("ID do campeonato não encontrado. Usando dados genéricos.");
          setPartida({ id: parseInt(partidaId), nomeA: 'Time A', nomeB: 'Time B' });
          return;
      }
      
      const response = await api.get(`/game/${campeonatoId}`);
      const jogoAtual = response.data.find(j => j.id === parseInt(partidaId));
      
      if (jogoAtual) {
        setPartida(jogoAtual);
        setPlacar({ golsA: jogoAtual.golsA || 0, golsB: jogoAtual.golsB || 0 });
        setStatus(jogoAtual.status || 'PENDENTE');
      } else {
        throw new Error("Partida não encontrada");
      }
    } catch (err) {
      console.error("Erro ao buscar detalhes da partida:", err);
      setStatus("Erro ao carregar partida");
      // Fallback para dados fictícios em caso de erro
      setPartida({ id: parseInt(partidaId), nomeA: 'Time da Casa', nomeB: 'Time Visitante' });
    } finally {
      setLoading(false);
    }
  }, [partidaId, location.state]);

  useEffect(() => {
    fetchGameDetails();
  }, [fetchGameDetails]);


  // Conecta ao stream de eventos do backend para atualizações em tempo real
  useEffect(() => {
    if (!partidaId) return;
    
    // ATENÇÃO: A URL deve ser a do seu backend. Ajuste 'localhost:3000' se necessário.
    const eventSource = new EventSource(`http://localhost:3000/events/${partidaId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Evento recebido:", data);
      
      if (data.minutos !== undefined) setTempo(`${String(data.minutos).padStart(2, '0')}:${String(data.segundos).padStart(2, '0')}`);
      if (data.status) setStatus(data.status);
      if (data.placar) setPlacar({ golsA: data.placar.golsA || 0, golsB: data.placar.golsB || 0 });
      if (data.evento) setEventos(prev => [data.evento, ...prev]);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [partidaId]);
  
  // Inicia a partida (cria estatísticas)
  const handleStartGame = async () => {
    try {
      await api.post(`/game/create/${partidaId}`);
      alert("Partida iniciada!");
    } catch (error) {
      alert(`Falha ao iniciar a partida: ${error.response?.data?.message}`);
    }
  };
  
  // Registra um evento
  const registrarEvento = async (tipoEvento) => {
    let jogadorId, time;

    // Ações que precisam do ID do jogador
    if (['goal', 'redCard', 'yellowCard'].includes(tipoEvento)) {
      jogadorId = prompt(`ID do jogador para o evento: ${tipoEvento}`);
      if (!jogadorId) return;
    }
    
    time = prompt(`Time do evento ('a' para ${partida?.nomeA} ou 'b' para ${partida?.nomeB}):`);
    if (!time || !['a', 'b'].includes(time.toLowerCase())) {
      alert("Time inválido. Use 'a' ou 'b'.");
      return;
    }

    try {
      const endpoint = jogadorId
        ? `/events/${tipoEvento}/${partidaId}/${jogadorId}/${time}`
        : `/events/${tipoEvento}/${partidaId}/${time}`;
        
      await api.post(endpoint);
      alert(`Evento '${tipoEvento}' registrado com sucesso!`);
    } catch (err) {
        alert(`Erro ao registrar ${tipoEvento}: ${err.response?.data?.message}`);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Loader2 className="animate-spin text-white" size={40} />
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-2xl p-6">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeft size={20} /> Voltar
          </button>
          
          <header className="text-center mb-6">
            <h2 className="text-lg text-gray-400">Status: <span className="font-bold text-yellow-400">{status}</span></h2>
          </header>

          <div className="flex justify-around items-center text-center">
             <div>
                <h3 className="text-2xl font-bold">{partida?.nomeA}</h3>
                <p className="text-6xl font-bold">{placar.golsA}</p>
             </div>
             <p className="text-7xl font-mono tracking-widest">{tempo}</p>
             <div>
                <h3 className="text-2xl font-bold">{partida?.nomeB}</h3>
                <p className="text-6xl font-bold">{placar.golsB}</p>
             </div>
          </div>
          
           <div className="mt-10 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold mb-4 text-center">Controles da Partida</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <button onClick={handleStartGame} className="bg-green-600 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"><Play size={18}/> Iniciar Partida</button>
                  <button onClick={() => registrarEvento('goal')} className="bg-blue-500 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"><Zap size={18}/> Gol</button>
                  <button onClick={() => registrarEvento('yellowCard')} className="bg-yellow-500 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-600 text-black"><User size={18}/> C. Amarelo</button>
                  <button onClick={() => registrarEvento('redCard')} className="bg-red-500 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600"><User size={18}/> C. Vermelho</button>
                  <button onClick={() => registrarEvento('assist')} className="bg-teal-500 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-600"><User size={18} /> Assist.</button>
                  <button onClick={() => registrarEvento('shot')} className="bg-orange-500 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600"><Shield size={18}/> Finalização</button>
                  <button onClick={() => registrarEvento('offside')} className="bg-purple-500 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600"><Flag size={18}/> Impedimento</button>
                  <button onClick={() => registrarEvento('penalti')} className="bg-indigo-500 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-600"><Shield size={18}/> Pênalti</button>
              </div>
           </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Eventos da Partida</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {eventos.length === 0 ? (
                    <p className="text-gray-400 text-center">Nenhum evento registrado.</p>
                ) : (
                    eventos.map((evento, index) => (
                        <div key={index} className="bg-gray-700 p-2 rounded-md text-sm">
                           <span className="font-bold text-yellow-300">{evento.tipoEvento}:</span> {evento.descricao || `Evento para jogador ${evento.jogadorId}`}
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}