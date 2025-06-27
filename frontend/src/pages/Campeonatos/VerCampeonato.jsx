import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, Loader2, PlayCircle } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/Card';
import { AuthContext } from '../../contexts/AuthContext.js';

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
            <p className="text-center text-gray-500 py-4">Nenhum time inscrito ainda.</p>
        )}
    </div>
);

const TabelaDePartidas = ({ partidas }) => (
    <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Partidas do Campeonato</h3>
        <div className="space-y-3">
            {partidas.map((partida) => (
                <div key={partida.id} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="col-span-4 text-right font-semibold text-gray-700">{partida.timeA.nome}</div>
                    <div className="col-span-2 text-center">
                        <span className="font-bold text-lg text-gray-400">VS</span>
                    </div>
                    <div className="col-span-4 font-semibold text-gray-700">{partida.timeB.nome}</div>
                    <div className="col-span-2 text-center">
                        <Link
                            to={`/partida/${partida.id}`}
                            className="bg-green-600 text-white p-2 rounded-full inline-flex items-center justify-center hover:bg-green-700 transition-transform transform hover:scale-110"
                            title="Iniciar Partida"
                        >
                            <PlayCircle size={20} />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


export default function VerCampeonato() {
    const { campeonatoId } = useParams();
    const { user } = useContext(AuthContext);

    const [campeonato, setCampeonato] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [partidas, setPartidas] = useState([]);
  
    // Estados para o modal de inscrição
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [userTeams, setUserTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [joining, setJoining] = useState(false);

    const userId = user?.id;

    const fetchChampionshipData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: championshipData } = await api.get(`/championship/${campeonatoId}`);
            setCampeonato(championshipData);

            if (championshipData.partidas && championshipData.partidas.length > 0) {
                setPartidas(championshipData.partidas);
            }
        } catch (err) {
            console.error("Erro ao carregar dados do campeonato:", err);
            setError('Não foi possível carregar os dados do campeonato.');
        } finally {
            setLoading(false);
        }
    }, [campeonatoId]);

    const fetchUserTeams = useCallback(async () => {
        if (!userId) return;
        try {
            const { data: userTeamsData } = await api.get(`/team`);
            const enrolledTeamIds = campeonato.times.map(inscricao => (inscricao.time || inscricao).id);
            const teamsWithStatus = userTeamsData.map(team => ({
                ...team,
                isEnrolled: enrolledTeamIds.includes(team.id),
            }));
            setUserTeams(teamsWithStatus);
        } catch (error) {
            console.error("Erro ao buscar times do usuário:", error);
        }
    }, [userId, campeonato]);

    useEffect(() => {
        if (campeonatoId) {
            fetchChampionshipData();
        }
    }, [campeonatoId, fetchChampionshipData]);

    useEffect(() => {
        if (isJoinModalOpen && campeonato) {
            fetchUserTeams();
        }
    }, [isJoinModalOpen, campeonato, fetchUserTeams]);

    const handleIniciarCampeonato = async () => {
        if (!window.confirm("Tem certeza que deseja iniciar o campeonato? As inscrições serão encerradas e os confrontos gerados.")) return;
        
        console.log("Simulando início do campeonato...");
        const timesInscritos = campeonato.times.map(t => t.time);
        const timesEmbaralhados = [...timesInscritos].sort(() => Math.random() - 0.5);
        const novasPartidas = [];
        for (let i = 0; i < timesEmbaralhados.length; i += 2) {
            if (timesEmbaralhados[i + 1]) {
                novasPartidas.push({
                    id: `partida-simulada-${i / 2 + 1}`,
                    timeA: timesEmbaralhados[i],
                    timeB: timesEmbaralhados[i + 1],
                });
            }
        }
        setPartidas(novasPartidas);
        setCampeonato(prev => ({ ...prev, status: 'EM_ANDAMENTO' }));
    };
  
    const handleOpenJoinModal = () => setIsJoinModalOpen(true);
    const handleCloseJoinModal = () => {
        setIsJoinModalOpen(false);
        setSelectedTeamId('');
    };

    const handleJoin = async () => {
        if (!selectedTeamId) {
            alert('Por favor, selecione um time.');
            return;
        }
        setJoining(true);
        try {
            await api.post(`/championship/${campeonatoId}/time/${selectedTeamId}`);
            alert('Time inscrito com sucesso!');
            handleCloseJoinModal();
            fetchChampionshipData(); // Atualiza os dados do campeonato
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Não foi possível inscrever o time.';
            alert(`Erro: ${errorMessage}`);
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={40} /></div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!campeonato) return <div className="text-center p-10">Campeonato não encontrado.</div>;

    const statusAtual = campeonato.status || 'NAO_INICIADO';
    const isCreator = user?.id === campeonato.usuarioId;
    const vagasAtingidas = campeonato.times.length >= campeonato.numeroTimes;
    const podeIniciar = isCreator && vagasAtingidas && statusAtual === 'NAO_INICIADO';

    return (
        <div className="p-4 md:p-8 min-h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <header className="flex flex-col md:flex-row justify-between items-start text-gray-800">
                    <div>
                        <h1 className="text-4xl font-bold">{campeonato.nome}</h1>
                        <p className="text-gray-600 mt-2">{campeonato.local || 'Local não definido'}</p>
                        <p className="text-gray-600">Prêmio: <span className="font-bold text-gray-800">{campeonato.premio || '-'}</span></p>
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-col items-center gap-3 w-full md:w-auto">
                        
                        <button
                            onClick={handleOpenJoinModal}
                            disabled={statusAtual !== 'NAO_INICIADO' || !userId}
                            className="w-full bg-[#1f8c70] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#27ae8c] disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {statusAtual !== 'NAO_INICIADO' ? 'INSCRIÇÕES ENCERRADAS' : 'INSCREVA-SE'}
                        </button>
                        
                        {podeIniciar && (
                            <button
                                onClick={handleIniciarCampeonato}
                                className="w-full bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 animate-pulse"
                            >
                                Iniciar Campeonato
                            </button>
                        )}
                    </div>
                </header>

                <main className="mt-4">
                    <AwardsTable premios={campeonato.premios} />
                    <TeamsGrid times={campeonato.times} />
                    {statusAtual === 'EM_ANDAMENTO' && (
                        <TabelaDePartidas partidas={partidas} />
                    )}
                </main>
            </div>
      
            {isJoinModalOpen && (
                <div className="fixed inset-0 bg-[rgba(58,58,58,0.7)] flex items-center justify-center z-20 p-4">
                    <Card title="Inscrever Time" onBackClick={handleCloseJoinModal}>
                        <div className="space-y-4 p-4">
                            {userTeams.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {userTeams.map(team => (
                                        <button
                                            key={team.id}
                                            onClick={() => !team.isEnrolled && setSelectedTeamId(team.id)}
                                            disabled={team.isEnrolled}
                                            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center relative ${
                                                selectedTeamId === team.id
                                                ? 'border-blue-500 bg-blue-50'
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
                            ) : (
                                <p className="text-center text-gray-500">Você não tem times para inscrever ou todos já estão inscritos.</p>
                            )}
                            
                            <button
                                onClick={handleJoin}
                                disabled={!selectedTeamId || joining}
                                className={`w-full py-3 mt-4 rounded-lg text-white font-bold transition-colors ${
                                    !selectedTeamId || joining
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {joining ? 'Inscrevendo...' : 'Confirmar Inscrição'}
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}