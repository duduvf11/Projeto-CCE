import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, Loader2 } from 'lucide-react';
import api from '../../services/api'; // Importa a instância do axios
import Card from '../../components/Card'; // Reutilizando seu componente Card

export default function VerCampeonato() {
  const { campeonatoId } = useParams();
  const [campeonato, setCampeonato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [joining, setJoining] = useState(false);
  
  const userId = 1; 


  const ShirtIcon = ({ color = '#2a6692' }) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3H15V2C15 1.45 14.55 1 14 1H10C9.45 1 9 1.45 9 2V3ZM20.5 5H16V4H8V5H3.5L3 7.5L5.5 11L6 20H18L18.5 11L21 7.5L20.5 5Z" />
    </svg>
  );

  const AwardsTable = ({ premios }) => (
    <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
            <button className="text-gray-700 flex items-center bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Regras <ChevronDown size={16} className="ml-1"/> </button>
        </div>
        <table className="w-full text-gray-800 text-center">
            <thead className="bg-gray-200">
                <tr>
                    <th className="p-2 font-normal">Lugar</th>
                    <th className="p-2 font-normal">Prêmio</th>
                    <th className="p-2 font-normal">Time</th>
                </tr>
            </thead>
            <tbody>
                {premios.length > 0 ? (
                    premios.map(p => (
                        <tr key={p.lugar}>
                            <td className="p-2 font-bold">{p.lugar}</td>
                            <td className="p-2 text-yellow-600 font-bold">{p.premio}</td>
                            <td className="p-2">{p.time || '-'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="p-4 text-gray-500">Nenhuma premiação definida.</td>
                    </tr>
                )}
            </tbody>
        </table>
        <div className="text-center mt-2">
            <button className="text-gray-500 hover:text-gray-800"><ChevronDown/></button>
        </div>
    </div>
  );

  const TeamsGrid = ({ times }) => (
    <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Times Inscritos ({times.length})</h3>
        {times.length > 0 ? (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-center text-gray-800">
                {times.map(inscricao => (
                    <div key={inscricao.time.id} className="flex flex-col items-center">
                        <ShirtIcon color='#2a6692' />
                        <span className="text-sm mt-1">{inscricao.time.nome}</span>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500">Nenhum time inscrito ainda.</p>
        )}
        <div className="text-center mt-4">
            <button className="text-gray-500 hover:text-gray-800"><ChevronDown/></button>
        </div>
    </div>
  );

  const renderContent = () => {
    if (!campeonato) return null;
    return (
        <>
            <TeamsGrid times={campeonato.times} />
        </>
    );
  };

  // Funções de controle do modal
  const handleOpenJoinModal = () => {
    setIsJoinModalOpen(true);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
    setSelectedTeamId(null);
  };

  const handleTeamJoined = () => {
    // Rebusca os dados do campeonato para atualizar a lista de times
    fetchChampionshipData();
    setIsUserEnrolled(true);
    handleCloseJoinModal();
  };

  // Função para buscar os dados do campeonato e verificar a inscrição do usuário
  const fetchChampionshipData = async () => {
    setLoading(true);
    setError(null);
    try {
      const championshipResponse = await api.get(`/championship/${campeonatoId}`);
      const championshipData = championshipResponse.data;
      setCampeonato(championshipData);
      
      const teamsResponse = await api.get(`/team/${userId}`);
      const userTeamIds = teamsResponse.data.map(team => team.id);
      setUserTeams(teamsResponse.data);

      const enrolledTeamIds = championshipData.times.map(inscricao => inscricao.time.id);
      const isEnrolled = enrolledTeamIds.some(enrolledId => userTeamIds.includes(enrolledId));
      setIsUserEnrolled(isEnrolled);

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError('Não foi possível carregar os dados do campeonato.');
    } finally {
      setLoading(false);
    }
  };

  // Função para inscrever um time no campeonato
  const handleJoin = async () => {
    if (!selectedTeamId) {
        alert('Selecione um time para se inscrever.');
        return;
    }

    setJoining(true);
    try {
        const response = await api.post('/championship/join', {
            usuarioId: userId,
            campeonatoId: parseInt(campeonatoId),
            timeId: selectedTeamId,
        });
        alert(`Time "${response.data.time.nome}" inscrito com sucesso!`);
        handleTeamJoined();
    } catch (err) {
        console.error('Erro na inscrição:', err);
        const errorMessage = err.response?.data?.message || 'Erro ao inscrever o time.';
        alert(errorMessage);
    } finally {
        setJoining(false);
    }
  };

  // UseEffect para carregar dados ao montar o componente
  useEffect(() => {
    if (campeonatoId) {
      fetchChampionshipData();
    }
  }, [campeonatoId]);

  // Renderização de estados de carregamento e erro
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-[var(--verde-claro)]" size={50} />
        <p className="ml-4 text-gray-700">Carregando campeonato...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!campeonato) {
      return <div className="text-center p-10 text-gray-500">Campeonato não encontrado.</div>;
  }

  // Renderização do modal de inscrição
  const renderJoinModal = () => {
    if (!isJoinModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-[rgba(58,58,58,0.7)] flex items-center justify-center z-20 p-4">
          <Card title="Inscrever Time" onBackClick={handleCloseJoinModal}>
              <div className="space-y-4">
                  {userTeams.length === 0 ? (
                      <p className="text-center text-gray-500">Você não tem times para se inscrever. Crie um na sua página de times.</p>
                  ) : (
                      <div className="grid grid-cols-2 gap-4">
                          {userTeams.map(team => (
                              <button
                                  key={team.id}
                                  onClick={() => setSelectedTeamId(team.id)}
                                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                                      selectedTeamId === team.id
                                          ? 'border-[var(--verde)] bg-green-50'
                                          : 'border-gray-300 hover:bg-gray-100'
                                  }`}
                              >
                                  <ShirtIcon color={selectedTeamId === team.id ? '#2a6692' : '#9ca3af'} />
                                  <span className="mt-2 font-medium">{team.nome}</span>
                              </button>
                          ))}
                      </div>
                  )}
                  
                  <button
                      onClick={handleJoin}
                      disabled={!selectedTeamId || joining || userTeams.length === 0}
                      className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${
                          !selectedTeamId || joining || userTeams.length === 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                      }`}
                  >
                      {joining ? 'Inscrevendo...' : 'Inscrever'}
                  </button>
                  <button onClick={handleCloseJoinModal} className="w-full py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">
                      Cancelar
                  </button>
              </div>
          </Card>
      </div>
    );
  };

  // Renderização do componente principal
  return (
    <div className="p-4 md:p-8 min-h-full">
        {/* Painel de Controle para teste - Removido pois não é mais necessário */}

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <header className="flex flex-col md:flex-row justify-between items-center text-gray-800">
                <div>
                    <h1 className="text-4xl font-bold">{campeonato.nome}</h1>
                    {/* A API não fornece 'local', então um valor padrão é usado */}
                    <p className="text-gray-600 mt-2">{campeonato.local || 'Local não definido'}</p>
                    <p className="text-gray-600">Prêmio: <span className="font-bold text-gray-800">{campeonato.premio || '-'}</span></p>
                </div>
                <div className="mt-6 md:mt-0">
                    <button
                        onClick={handleOpenJoinModal}
                        disabled={isUserEnrolled}
                        className="bg-[#1f8c70] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#27ae8c] disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isUserEnrolled ? 'INSCRITO' : 'INSCREVA-SE'}
                    </button>
                </div>
            </header>

            <main className="mt-4">
                {/* O serviço GetChampionshipService.js não retorna prêmios, então um array vazio é passado. */}
                <AwardsTable premios={[]} />
                {renderContent()}
            </main>
        </div>
        
        {renderJoinModal()}
    </div>
  );
}