import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function TelaInicial() {
  const [upcomingChampionships, setUpcomingChampionships] = useState([]);
  const [ongoingMatches, setOngoingMatches] = useState([]);
  const [filter, setFilter] = useState('ongoing');
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState({
    upcoming: true,
    ongoing: true,
    championships: true
  });
  const [error, setError] = useState(null);

  // Validate championship data structure
  const isValidChampionship = (champ) => {
    return champ && 
           typeof champ === 'object' && 
           champ.id && 
           typeof champ.id === 'string' && 
           champ.id.trim() !== '' &&
           champ.name &&
           champ.startDate;
  };

  // Validate match data structure
  const isValidMatch = (match) => {
    return match &&
           match.id &&
           typeof match.id === 'string' &&
           match.id.trim() !== '' &&
           match.teamA &&
           match.teamB;
  };

  // Format date consistently
  const formatDate = (dateString) => {
    try {
      const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleString('pt-BR', options);
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Data inválida';
    }
  };

  // Fetch upcoming championships
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(prev => ({...prev, upcoming: true}));
        setError(null);
        
        const response = await api.get('/championship/upcoming?limit=2');
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format from server');
        }

        const validChamps = response.data.filter(isValidChampionship);
        setUpcomingChampionships(validChamps);
        
        if (response.data.length > 0 && validChamps.length === 0) {
          setError('Dados recebidos não estão no formato esperado');
        }
      } catch (err) {
        console.error('Error loading upcoming championships:', err);
        setError('Erro ao carregar próximos campeonatos');
        setUpcomingChampionships([]);
      } finally {
        setLoading(prev => ({...prev, upcoming: false}));
      }
    };

    fetchUpcoming();
  }, []);

  // Fetch ongoing matches
  useEffect(() => {
    const fetchOngoing = async () => {
      try {
        setLoading(prev => ({...prev, ongoing: true}));
        setError(null);
        
        const response = await api.get('/championship/ongoing');
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format from server');
        }

        const validMatches = response.data.filter(isValidMatch);
        setOngoingMatches(validMatches);
        
        if (response.data.length > 0 && validMatches.length === 0) {
          setError('Dados de jogos recebidos não estão no formato esperado');
        }
      } catch (err) {
        console.error('Error loading ongoing matches:', err);
        setError('Erro ao carregar jogos em andamento');
        setOngoingMatches([]);
      } finally {
        setLoading(prev => ({...prev, ongoing: false}));
      }
    };

    fetchOngoing();
  }, []);

  // Fetch championships based on filter
  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        setLoading(prev => ({...prev, championships: true}));
        setError(null);
        
        let endpoint = '';
        switch(filter) {
          case 'finished': endpoint = '/championship/finished'; break;
          case 'upcoming': endpoint = '/championship/upcoming'; break;
          default: endpoint = '/championship/ongoing';
        }

        const response = await api.get(endpoint);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format from server');
        }

        const validChamps = response.data.map(champ => {
          if (isValidChampionship(champ)) {
            return {
              ...champ,
              matches: champ.matches && Array.isArray(champ.matches) 
                ? champ.matches.filter(isValidMatch) 
                : []
            };
          }
          return null;
        }).filter(Boolean);

        setChampionships(validChamps);
        
        if (response.data.length > 0 && validChamps.length === 0) {
          setError('Dados de campeonatos não estão no formato esperado');
        }
      } catch (err) {
        console.error(`Error loading ${filter} championships:`, err);
        setError(`Erro ao carregar campeonatos ${getFilterLabel(filter)}`);
        setChampionships([]);
      } finally {
        setLoading(prev => ({...prev, championships: false}));
      }
    };

    fetchChampionships();
  }, [filter]);

  // Helper function to get filter label
  const getFilterLabel = (filterType) => {
    switch(filterType) {
      case 'ongoing': return 'em andamento';
      case 'finished': return 'finalizados';
      case 'upcoming': return 'próximos';
      default: return '';
    }
  };

  // Render loading skeleton
  const renderLoadingSkeleton = (count = 1) => {
    return Array(count).fill(0).map((_, index) => (
      <div key={index} className="animate-pulse bg-gray-200 rounded-lg p-4 h-24" />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4 md:p-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Upcoming Championships Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-900">Próximos Campeonatos</h2>
        {loading.upcoming ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderLoadingSkeleton(2)}
          </div>
        ) : upcomingChampionships.length === 0 ? (
          <div className="bg-white text-center text-gray-500 p-4 rounded-lg shadow">
            Nenhum campeonato agendado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingChampionships.map((champ) => (
              <div key={champ.id} className="bg-cyan-800 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-1">{champ.name}</h3>
                <p className="text-sm mb-2">{formatDate(champ.startDate)}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-cyan-600 text-xs px-2 py-1 rounded">
                    {champ.type || 'Tipo não especificado'}
                  </span>
                  <span className="text-xs">
                    {champ.teamsCount || 0} times participantes
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ongoing Matches Section */}
      <section className="bg-white rounded-lg p-4 shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-900">Jogos ao Vivo</h2>
          <button 
            onClick={() => setFilter('ongoing')}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver todos
          </button>
        </div>
        
        {loading.ongoing ? (
          <div className="space-y-2">
            {renderLoadingSkeleton(3)}
          </div>
        ) : ongoingMatches.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nenhum jogo em andamento</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {ongoingMatches.slice(0, 3).map((match) => (
              <li key={match.id} className="py-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium">{match.teamA}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded font-bold">
                        {match.scoreA || '0'} - {match.scoreB || '0'}
                      </span>
                      <span className="font-medium">{match.teamB}</span>
                    </div>
                    {match.championship && (
                      <p className="text-xs text-center text-gray-500 mt-1">
                        {match.championship.name}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Filtered Championships Section */}
      <section>
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {['ongoing', 'finished', 'upcoming'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {f === 'ongoing' && 'Em Andamento'}
              {f === 'finished' && 'Finalizados'}
              {f === 'upcoming' && 'Próximos'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          {loading.championships ? (
            <div className="space-y-4">
              {renderLoadingSkeleton(3)}
            </div>
          ) : championships.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {filter === 'ongoing' && 'Nenhum campeonato em andamento'}
              {filter === 'finished' && 'Nenhum campeonato finalizado'}
              {filter === 'upcoming' && 'Nenhum campeonato agendado'}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {championships.map((champ) => (
                <li key={champ.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{champ.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(champ.startDate)} • {champ.status || 'Status não disponível'}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                      {champ.type || 'Tipo não especificado'}
                    </span>
                  </div>
                  
                  {champ.matches && champ.matches.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {champ.matches.slice(0, 2).map((match) => (
                        <div key={match.id} className="text-sm bg-gray-50 p-2 rounded">
                          <div className="flex justify-between">
                            <span>
                              {match.teamA} vs {match.teamB}
                            </span>
                            <span className="text-gray-500">
                              {match.status === 'FINISHED' 
                                ? `${match.scoreA || '0'}-${match.scoreB || '0'}`
                                : match.date 
                                  ? formatDate(match.date).split(',')[1] 
                                  : 'Horário não disponível'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}