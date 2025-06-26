import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/Card';
import { AuthContext } from '../../contexts/AuthContext.js';

export default function VerCampeonato() {
  const { campeonatoId } = useParams();
  const { user } = useContext(AuthContext);

  const [campeonato, setCampeonato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [allTeamsEnrolled, setAllTeamsEnrolled] = useState(false);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [joining, setJoining] = useState(false);
  
  const userId = user?.id;

  const ShirtIcon = ({ color = '#2a6692' }) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3H15V2C15 1.45 14.55 1 14 1H10C9.45 1 9 1.45 9 2V3ZM20.5 5H16V4H8V5H3.5L3 7.5L5.5 11L6 20H18L18.5 11L21 7.5L20.5 5Z" />
    </svg>
  );

  const AwardsTable = ({ premios }) => (
    <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <button className="text-gray-700 flex items-center bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          Regras <ChevronDown size={16} className="ml-1"/> 
        </button>
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
          {premios && premios.length > 0 ? (
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
          {times.map(inscricao => {
            const time = inscricao.time || inscricao;
            if (!time || !time.id) return null;
            return (
              <div key={time.id} className="flex flex-col items-center">
                <ShirtIcon color='#2a6692' />
                <span className="text-sm mt-1">{time.nome}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nenhum time inscrito ainda.</p>
      )}
      <div className="text-center mt-4">
        <button className="text-gray-500 hover:text-gray-800"><ChevronDown/></button>
      </div>
    </div>
  );

  const fetchChampionshipData = useCallback(async () => {
    setError(null);
    try {
      const championshipResponse = await api.get(`/championship/${campeonatoId}`);
      const championshipData = championshipResponse.data;
      setCampeonato(championshipData);

      if (userId) {
        const teamsResponse = await api.get(`/team`);
        const userTeamsData = teamsResponse.data;
        const enrolledTeamIds = championshipData.times.map(inscricao => (inscricao.time || inscricao).id);

        const teamsWithStatus = userTeamsData.map(team => ({
          ...team,
          isEnrolled: enrolledTeamIds.includes(team.id),
        }));
        setUserTeams(teamsWithStatus);

        const allUserTeamsEnrolled = userTeamsData.length > 0 && teamsWithStatus.every(team => team.isEnrolled);
        setAllTeamsEnrolled(allUserTeamsEnrolled);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError('Não foi possível carregar os dados do campeonato.');
    } finally {
      setLoading(false);
    }
  }, [campeonatoId, userId]);

  useEffect(() => {
    if (campeonatoId) {
      fetchChampionshipData();
    }
  }, [campeonatoId, fetchChampionshipData]);

  const handleOpenJoinModal = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => setIsJoinModalOpen(false);

  const handleTeamJoined = () => {
    fetchChampionshipData();
    handleCloseJoinModal();
  };

  const handleJoin = async () => {
    if (!selectedTeamId) {
      alert('Por favor, selecione um time para inscrever.');
      return;
    }
    
    setJoining(true);
    try {
      await api.post(`/championship/${campeonatoId}/time/${selectedTeamId}`);
      alert(`Time inscrito com sucesso!`);
      handleTeamJoined();
    } catch (err) {
      console.error('Erro na inscrição:', err);
      const errorMessage = err.response?.data?.error || 'Ocorreu um erro ao inscrever o time.';
      alert(errorMessage);
    } finally {
      setJoining(false);
    }
  };

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

  return (
    <div className="p-4 md:p-8 min-h-full">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <header className="flex flex-col md:flex-row justify-between items-center text-gray-800">
          <div>
            <h1 className="text-4xl font-bold">{campeonato.nome}</h1>
            <p className="text-gray-600 mt-2">{campeonato.local || 'Local não definido'}</p>
            <p className="text-gray-600">Prêmio: <span className="font-bold text-gray-800">{campeonato.premio || '-'}</span></p>
          </div>
          <div className="mt-6 md:mt-0">
            <button
              onClick={handleOpenJoinModal}
              disabled={allTeamsEnrolled || !userId}
              className="bg-[#1f8c70] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#27ae8c] disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {!userId ? 'Faça login para se inscrever' : allTeamsEnrolled ? 'INSCRITO' : 'INSCREVA-SE'}
            </button>
          </div>
        </header>

        <main className="mt-4">
          <AwardsTable premios={campeonato.premios} />
          <TeamsGrid times={campeonato.times} />
        </main>
      </div>
      
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.7)] flex items-center justify-center z-20 p-4">
          <Card title="Inscrever Time" onBackClick={handleCloseJoinModal}>
            <div className="space-y-4">
              {userTeams.length === 0 ? (
                <p className="text-center text-gray-500">Você não tem times para se inscrever.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {userTeams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => !team.isEnrolled && setSelectedTeamId(team.id)}
                      disabled={team.isEnrolled}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center relative ${
                        selectedTeamId === team.id
                          ? 'border-[var(--verde)] bg-green-50'
                          : team.isEnrolled
                          ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {team.isEnrolled && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Inscrito
                        </div>
                      )}
                      <ShirtIcon color={selectedTeamId === team.id ? '#2a6692' : '#9ca3af'} />
                      <span className="mt-2 font-medium">{team.nome}</span>
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleJoin}
                disabled={!selectedTeamId || joining}
                className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${
                  !selectedTeamId || joining
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                }`}
              >
                {joining ? 'Inscrevendo...' : 'Confirmar Inscrição'}
              </button>
              <button onClick={handleCloseJoinModal} className="w-full py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}