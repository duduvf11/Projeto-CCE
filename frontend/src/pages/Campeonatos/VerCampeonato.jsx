import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, PlayCircle, Swords } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext.js';

// --- Componentes Auxiliares ---
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
                            <svg width="48" height="48" viewBox="0 0 24 24" fill={'#2a6692'} xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 3H15V2C15 1.45 14.55 1 14 1H10C9.45 1 9 1.45 9 2V3ZM20.5 5H16V4H8V5H3.5L3 7.5L5.5 11L6 20H18L18.5 11L21 7.5L20.5 5Z" />
                            </svg>
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
    <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Confrontos Definidos</h3>
        <div className="space-y-3">
            {partidas.length === 0 ? (
                <p className="text-center text-gray-500 py-4">As partidas aparecerão aqui após o início do campeonato.</p>
            ) : (
                partidas.map((partida) => (
                    <div key={partida.id} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="col-span-5 text-right font-semibold text-gray-700">{partida.nomeA || 'A definir'}</div>
                        <div className="col-span-2 text-center flex justify-center items-center">
                            <span className="font-bold text-lg text-red-500">VS</span>
                        </div>
                        <div className="col-span-5 font-semibold text-gray-700">{partida.nomeB || 'A definir'}</div>
                        <div className="col-span-12 sm:col-span-2 text-center mt-2 sm:mt-0">
                            <Link
                                to={`/partida/${partida.id}`}
                                className="bg-green-600 text-white p-2 rounded-full inline-flex items-center justify-center hover:bg-green-700 transition-transform transform hover:scale-110"
                                title="Controlar Partida"
                            >
                                <PlayCircle size={20} />
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);


// --- COMPONENTE PRINCIPAL ---

export default function VerCampeonato() {
    const { campeonatoId } = useParams();
    const { user } = useContext(AuthContext);

    const [campeonato, setCampeonato] = useState(null);
    const [loading, setLoading] = useState(true);
    const [partidas, setPartidas] = useState([]);
    const [error, setError] = useState(null);
  
    const fetchAllData = useCallback(async () => {
        if (!campeonatoId) return;
        setLoading(true);
        try {
            const [campeonatoResponse, jogosResponse] = await Promise.all([
                api.get(`/championship/${campeonatoId}`),
                api.get(`/game/${campeonatoId}`)
            ]);
            
            setCampeonato(campeonatoResponse.data);
            setPartidas(jogosResponse.data || []);

        } catch (err) {
            setError('Não foi possível carregar os dados do campeonato.');
            console.error("Erro ao carregar dados:", err);
        } finally {
            setLoading(false);
        }
    }, [campeonatoId]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleIniciarCampeonato = async () => {
        if (!window.confirm("Tem certeza que deseja iniciar o campeonato? As inscrições serão encerradas e os confrontos gerados.")) return;
        
        try {
            await api.post(`/game/${campeonatoId}`, {
                usuarioId: user.id
            });
            alert("Campeonato iniciado e confrontos gerados com sucesso!");
            // Recarrega todos os dados para exibir os novos jogos
            fetchAllData(); 
        } catch (err) {
            console.error("Erro ao iniciar o campeonato:", err);
            const errorMessage = err.response?.data?.error || "Ocorreu um erro. Verifique se os jogos já não foram gerados."
            alert(`Falha ao iniciar campeonato: ${errorMessage}`);
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={40} /></div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!campeonato) return <div className="text-center p-10">Campeonato não encontrado.</div>;

    const isCreator = user?.id === campeonato.usuarioId;
    const vagasAtingidas = campeonato.times.length >= campeonato.numeroTimes;
    const statusAtual = campeonato.status || 'NAO_INICIADO'; 
    const podeIniciar = isCreator && vagasAtingidas && statusAtual === 'NAO_INICIADO';

    return (
        <div className="p-4 md:p-8 min-h-full bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <header className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold">{campeonato.nome}</h1>
                        <p className="text-gray-600 mt-1">Vagas: {campeonato.times.length} / {campeonato.numeroTimes}</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                         {statusAtual === 'NAO_INICIADO' && (
                             <div className="bg-green-100 text-green-800 font-bold py-2 px-4 rounded-lg text-center">INSCRIÇÕES ABERTAS</div>
                         )}
                         {podeIniciar && (
                            <button onClick={handleIniciarCampeonato} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 animate-pulse flex items-center justify-center gap-2">
                                <Swords size={18} /> Iniciar Campeonato
                            </button>
                        )}
                    </div>
                </header>

                <main className="mt-8">
                    <TeamsGrid times={campeonato.times} />
                    <TabelaDePartidas partidas={partidas} campeonatoId={campeonato.id} />
                </main>
            </div>
        </div>
    );
}
