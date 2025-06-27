import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Importar o Link
import api from '../../services/api';

const Home = () => {
  const [upcomingChampionships, setUpcomingChampionships] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [filter, setFilter] = useState('ongoing');
  const [loading, setLoading] = useState({
    upcoming: true,
    championships: true
  });

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="flex flex-col justify-center bg-white rounded-xl shadow-md max-w-4/5 w-full min-h-7/8 m-4 sm:m-8 md:m-20 p-6">
      {/* Seção: Próximos Campeonatos */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Próximos Campeonatos</h2>
        
        {loading.upcoming ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32" />
            ))}
          </div>
        ) : upcomingChampionships.length === 0 ? (
          <div className="bg-gray-100 text-center text-gray-500 p-6 rounded-lg">
            Nenhum campeonato agendado no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingChampionships.map(champ => (
              <div key={champ.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">{champ.nome}</h3>
                  <p className="text-sm text-gray-300 mb-3">Início em: {formatDate(champ.dataInicio)}</p>
                  <div className="flex gap-2 items-center mb-4">
                    <span className="bg-cyan-600 text-xs px-2 py-1 rounded">{champ.formato || 'N/D'}</span>
                    <span className="text-xs">{champ.numeroTimes} times</span>
                  </div>
                </div>
                {/* 2. Botão adicionado aqui */}
                <Link 
                  to={`/campeonato/${champ.id}`} 
                  className="w-full text-center mt-2 p-2 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Ver Campeonato
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção: Filtros de Campeonatos */}
      <section className='bg-gray-100 p-4 sm:p-6 rounded-lg shadow-inner'>
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {[
            { value: 'ongoing', label: 'Em Andamento' },
            { value: 'finished', label: 'Finalizados' },
            { value: 'upcoming', label: 'Próximos' }
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-semibold text-sm sm:text-base ${
                filter === item.value
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white hover:bg-gray-200 text-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md min-h-[200px]">
          {loading.championships ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-16" />
              ))}
            </div>
          ) : championships.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum campeonato para exibir nesta categoria.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {championships.map(champ => (
                <li key={champ.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{champ.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(champ.dataInicio)} • <span className="font-medium capitalize">{champ.status || filter}</span>
                    </p>
                  </div>
                   {/* 3. Botão adicionado aqui */}
                  <Link 
                    to={`/campeonato/${champ.id}`} 
                    className="flex-shrink-0 w-full sm:w-auto text-center p-2 px-4 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700 transition-colors text-sm"
                  >
                    Ver Campeonato
                  </Link>
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