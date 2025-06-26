import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Home = () => {
  // Estados (removidas as variáveis não utilizadas)
  const [upcomingChampionships, setUpcomingChampionships] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [filter, setFilter] = useState('ongoing');
  const [loading, setLoading] = useState({
    upcoming: true,
    championships: true
  });

  // Busca os próximos campeonatos
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(prev => ({ ...prev, upcoming: true }));
        const response = await api.get('/championship/upcoming');
        setUpcomingChampionships(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar próximos campeonatos:", err);
      } finally {
        setLoading(prev => ({ ...prev, upcoming: false }));
      }
    };
    fetchUpcoming();
  }, []);

  // Busca campeonatos conforme filtro
  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        setLoading(prev => ({ ...prev, championships: true }));
        const endpoint = `/championship/${filter}`;
        const response = await api.get(endpoint);
        setChampionships(response.data || []);
      } catch (err) {
        console.error(`Erro ao buscar campeonatos (${filter}):`, err);
      } finally {
        setLoading(prev => ({ ...prev, championships: false }));
      }
    };
    fetchChampionships();
  }, [filter]);

  // Formata datas
  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="flex flex-col justify-center bg-white rounded-xl shadow-md max-w-4/5 w-full min-h-7/8 m-20 p-6">
      {/* Seção: Próximos Campeonatos */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-900">Próximos Campeonatos</h2>
        
        {loading.upcoming ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-24" />
            ))}
          </div>
        ) : upcomingChampionships.length === 0 ? (
          <div className="bg-white text-center text-gray-500 p-4 rounded-lg shadow">
            Nenhum campeonato agendado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingChampionships.map(champ => (
              <div key={champ.id} className="bg-cyan-800 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-1">{champ.nome}</h3>
                <p className="text-sm mb-2">{formatDate(champ.dataInicio)}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-cyan-600 text-xs px-2 py-1 rounded">
                    {champ.formato}
                  </span>
                  <span className="text-xs">
                    {champ.numeroTimes} times
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção: Filtros de Campeonatos */}
      <section className='bg-[var(--verde-piscina-escuro)] p-6 rounded-lg shadow-md'>
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {[
            { value: 'ongoing', label: 'Em Andamento' },
            { value: 'finished', label: 'Finalizados' },
            { value: 'upcoming', label: 'Próximos' }
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === item.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          {loading.championships ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-20" />
              ))}
            </div>
          ) : championships.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {filter === 'ongoing' && 'Nenhum campeonato em andamento'}
              {filter === 'finished' && 'Nenhum campeonato finalizado'}
              {filter === 'upcoming' && 'Nenhum campeonato agendado'}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {championships.map(champ => (
                <li key={champ.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{champ.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(champ.dataInicio)} • {champ.status || 'Em andamento'}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                      {champ.formato}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;