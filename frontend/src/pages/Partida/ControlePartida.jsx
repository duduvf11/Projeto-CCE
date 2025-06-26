import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importa o hook para pegar o ID da URL

// --- Mock Data (Substitua pela sua chamada de API) ---
// Em um aplicativo real, você usaria o partidaId para buscar esses dados
const allPlayersMock = {
    teamA: [
      { id: 1, number: 1, name: 'Goleiro A' }, { id: 2, number: 4, name: 'Zagueiro A' },
      { id: 3, number: 10, name: 'Meia A' }, { id: 4, number: 9, name: 'Atacante A' },
      { id: 5, number: 11, name: 'Estevão' }, { id: 6, number: 7, name: 'Janderson' },
      { id: 7, number: 8, name: 'Ricardo' },
    ],
    teamB: [
      { id: 8, number: 1, name: 'Goleiro B' }, { id: 9, number: 3, name: 'Zagueiro B' },
      { id: 10, number: 8, name: 'Meia B' }, { id: 11, number: 7, name: 'Atacante B' },
      { id: 12, number: 18, name: 'Javier' }, { id: 13, number: 19, name: 'Dudu' },
      { id: 14, number: 20, name: 'Felipe' },
    ]
};

// --- Componentes Internos da Página ---

const Scoreboard = ({ timeInSeconds, score, isRunning, onStart, onPause, championshipName }) => {
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{championshipName || 'NOME DO CAMPEONATO'}</h2>
      <div className="flex items-center justify-center space-x-4 md:space-x-8">
        <span className="text-2xl md:text-6xl font-bold text-gray-800">TIME A</span>
        {/* A mudança foi aqui: removi o div com fundo preto e ajustei as cores do texto */}
        <div>
          <div className="text-5xl md:text-7xl font-mono text-gray-900 tracking-wider">{score.a} - {score.b}</div>
           <div className="text-3xl md:text-5xl font-mono text-gray-700 mt-2">{formatTime(timeInSeconds)}</div>
        </div>
        <span className="text-2xl md:text-6xl font-bold text-gray-800">TIME B</span>
      </div>
      <div className="mt-4 space-x-4">
        <button onClick={onStart} disabled={isRunning} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-500">
          INICIAR
        </button>
        <button onClick={onPause} disabled={!isRunning} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-500">
          PAUSAR
        </button>
      </div>
    </div>
  );
};

const EventList = ({ events, onCancelEvent }) => {
    const getEventStyle = (type) => {
        switch(type) {
            case 'goal': return 'bg-green-100 border-l-4 border-green-500';
            case 'yellowCard': return 'bg-yellow-100 border-l-4 border-yellow-500';
            case 'redCard': return 'bg-red-100 border-l-4 border-red-500';
            default: return 'bg-gray-100';
        }
    };
    
    const getEventTitle = (event) => {
        const titles = {
            goal: `Gol Time ${event.team}`, foul: `Falta Time ${event.team}`,
            impediment: `Impedimento Time ${event.team}`, corner: `Escanteio Time ${event.team}`,
            yellowCard: `Cartão Amarelo Time ${event.team}`, redCard: `Cartão Vermelho Time ${event.team}`,
            substitution: `Substituição Time ${event.team}`,
        };
        return titles[event.type] || 'Evento';
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="font-bold mb-2 text-center text-gray-700">Lista de Eventos</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto p-1">
                {events.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">Nenhum evento na partida.</p>
                )}
                {events.map(event => (
                    <div key={event.id} className={`p-2 rounded-md flex justify-between items-center text-sm ${getEventStyle(event.type)}`}>
                        <div>
                            <p className="font-semibold">{getEventTitle(event)}</p>
                            <p className="text-gray-600">
                                {event.player ? `Jogador n° ${event.player.number} (${event.player.name})` : ''} às {event.time}
                            </p>
                        </div>
                        <button onClick={() => onCancelEvent(event.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs">
                            CANCELAR
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamActions = ({ teamName, onAddFoul, onAddSubstitution, onAddImpediment, onAddCorner, onAddYellowCard, onAddRedCard }) => (
    <div className="bg-gray-700 p-4 rounded-lg w-full">
        <h3 className="text-white font-bold text-lg mb-3">TIME {teamName}</h3>
        <div className="grid grid-cols-1 gap-2">
            <button onClick={onAddFoul} className="bg-blue-500 w-full text-white py-2 rounded-md hover:bg-blue-600">ADICIONAR FALTA</button>
            <button onClick={onAddImpediment} className="bg-blue-500 w-full text-white py-2 rounded-md hover:bg-blue-600">ADICIONAR IMPEDIMENTO</button>
            <button onClick={onAddCorner} className="bg-blue-500 w-full text-white py-2 rounded-md hover:bg-blue-600">ADICIONAR ESCANTEIO</button>
            <button onClick={onAddYellowCard} className="bg-yellow-500 w-full text-black py-2 rounded-md hover:bg-yellow-600">ADICIONAR CARTÃO AMARELO</button>
            <button onClick={onAddRedCard} className="bg-red-500 w-full text-white py-2 rounded-md hover:bg-red-600">ADICIONAR CARTÃO VERMELHO</button>
            <button onClick={onAddSubstitution} className="bg-purple-500 w-full text-white py-2 rounded-md hover:bg-purple-600">FAZER SUBSTITUIÇÃO</button>
        </div>
    </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
        <div className="bg-[#4D7A4F] text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-bold text-center">{title}</h2>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>
        <div className="bg-gray-100 p-4 flex justify-end rounded-b-lg">
            <button onClick={onClose} className="bg-[#2A4B2C] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#4D7A4F]">FECHAR</button>
        </div>
    </div>
  </div>
);

const PlayerSelectionModalContent = ({ players, onSelectPlayer }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map(player => (
            <div key={player.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span className="font-semibold text-gray-800">{`${player.number} ${player.name}`}</span>
                <button onClick={() => onSelectPlayer(player)} className="bg-green-600 text-white text-sm px-4 py-1 rounded-md hover:bg-green-700">Selecionar</button>
            </div>
        ))}
    </div>
);

const MODAL_CONFIGS = {
    impediment: { title: 'ADICIONAR IMPEDIMENTO' }, corner: { title: 'ADICIONAR ESCANTEIO' },
    yellowCard: { title: 'ADICIONAR CARTÃO AMARELO' }, redCard: { title: 'ADICIONAR CARTÃO VERMELHO' },
};

// --- Componente Principal da Página ---
export default function ControlePartida() {
  const { partidaId } = useParams(); // Pega o ID da partida da URL, ex: /partida/123

  // --- STATE MANAGEMENT ---
  const [partida, setPartida] = useState(null); // Aqui ficariam os dados da partida
  const [timeInSeconds, setTimeInSeconds] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState({ a: 0, b: 0 });
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState({ type: null, data: null });
  
  useEffect(() => {
    console.log("Buscando dados para a partida com ID:", partidaId);
    setPartida({ id: partidaId, name: `Campeonato Brasileiro - Partida ${partidaId}`});
    setScore({a: 1, b: 0}); // Placar inicial de exemplo
    setEvents([{id: 1, type: 'goal', team: 'A', player: {id: 2, name: 'Zagueiro A', number: 4 }, time: '01:12'}]);
  }, [partidaId]);


  const getTeamPlayers = (team) => team === 'A' ? allPlayersMock.teamA : allPlayersMock.teamB;
  
  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval = null;
    if (isRunning && timeInSeconds > 0) {
      interval = setInterval(() => setTimeInSeconds(prev => prev - 1), 1000);
    } else {
      setIsRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeInSeconds]);
  
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // --- EVENT HANDLERS ---
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const closeModal = () => setModal({ type: null, data: null });

  const addEvent = (type, team, player = null) => {
      const newEvent = { id: Date.now(), type, team, player, time: formatTime(timeInSeconds) };
      setEvents(prev => [newEvent, ...prev].sort((a,b) => b.id - a.id));
      
      if (type === 'goal') {
         setScore(prev => ({...prev, [team.toLowerCase()]: prev[team.toLowerCase()] + 1}));
      }
  };

  const cancelEvent = (eventId) => {
      const eventToCancel = events.find(e => e.id === eventId);
      if (eventToCancel && eventToCancel.type === 'goal') {
          setScore(prev => ({
              ...prev,
              [eventToCancel.team.toLowerCase()]: Math.max(0, prev[eventToCancel.team.toLowerCase()] - 1)
          }));
      }
      setEvents(prev => prev.filter(e => e.id !== eventId));
  };
  
  const handleSelectPlayerForEvent = (player) => {
      const { type, data } = modal;
      addEvent(type, data.team, player);
      closeModal();
  };
  
  const openModalForTeam = (type, team) => setModal({ type, data: { team } });

  // Renderiza um loading enquanto os dados da partida não chegam
  if (!partida) {
      return <div className="text-gray-800 text-center p-10">Carregando partida...</div>
  }

  return (
    <div className="p-4 md:p-6 min-h-full">
      {modal.type && (
        <Modal title={MODAL_CONFIGS[modal.type]?.title || 'Selecionar Jogador'} onClose={closeModal}>
            <PlayerSelectionModalContent 
                players={getTeamPlayers(modal.data.team)}
                onSelectPlayer={handleSelectPlayerForEvent} 
            />
        </Modal>
      )}

      <main className="w-full">
          <Scoreboard 
            timeInSeconds={timeInSeconds} 
            score={score}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            championshipName={partida.name}
          />
          <div className="flex flex-col lg:flex-row justify-center items-start gap-6 mt-6">
             <div className="flex flex-col gap-4 items-center w-full max-w-xs mx-auto">
                 <button onClick={() => openModalForTeam('goal', 'A')} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg w-full">
                    ADICIONAR GOL PARA O TIME A
                 </button>
                  <TeamActions 
                    teamName="A" 
                    onAddImpediment={() => openModalForTeam('impediment', 'A')}
                    onAddCorner={() => openModalForTeam('corner', 'A')}
                    onAddYellowCard={() => openModalForTeam('yellowCard', 'A')}
                    onAddRedCard={() => openModalForTeam('redCard', 'A')}
                    onAddSubstitution={() => openModalForTeam('substitution', 'A')}
                   />
             </div>

            <div className="w-full max-w-sm mx-auto">
                <EventList events={events} onCancelEvent={cancelEvent} />
            </div>

            <div className="flex flex-col gap-4 items-center w-full max-w-xs mx-auto">
                <button onClick={() => openModalForTeam('goal', 'B')} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg w-full">
                    ADICIONAR GOL PARA O TIME B
                </button>
                <TeamActions 
                    teamName="B" 
                    onAddImpediment={() => openModalForTeam('impediment', 'B')}
                    onAddCorner={() => openModalForTeam('corner', 'B')}
                    onAddYellowCard={() => openModalForTeam('yellowCard', 'B')}
                    onAddRedCard={() => openModalForTeam('redCard', 'B')}
                    onAddSubstitution={() => openModalForTeam('substitution', 'B')}
                />
            </div>
          </div>
      </main>
    </div>
  );
}
