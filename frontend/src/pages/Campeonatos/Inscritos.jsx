import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Frown, Trophy } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

export default function Inscritos() { 
  const { user } = useContext(AuthContext);
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInscricoes = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/championship/subscribed'); 
      setInscricoes(response.data);
    } catch (err) {
      console.error('Erro ao buscar inscrições:', err);
      setError('Não foi possível carregar suas inscrições.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInscricoes();
  }, [fetchInscricoes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-gray-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-red-600">
        <Frown size={50} />
        <p className="mt-4 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-[var(--verde-piscina-escuro)] rounded-xl shadow-md w-4/6 m-20 p-6 md:p-8 min-h-4/5">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left text-white">Minhas Inscrições</h1>

        {inscricoes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">Você não inscreveu nenhum time em campeonatos.</p>
            <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Explorar Campeonatos
            </Link>
          </div>
        ) : (
          <div className="w-5/6 bg-white rounded-lg shadow-md">
            {inscricoes.map((inscricao) => (
              <div 
                key={inscricao.id} 
                className="flex sm:flex-row justify-between items-center border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center gap-4 mb-4 sm:mb-0 text-center sm:text-left">
                  <Trophy className="text-yellow-500 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{inscricao.nomeCampeonato}</p>
                    <p className="text-gray-600">Time inscrito: <span className="font-medium text-gray-900">{inscricao.nomeTime}</span></p>
                  </div>
                </div>
                <div className="flex w-1/3 items-center">
                  <Link
                    // O link agora usa o ID do campeonato
                    to={`/campeonato/${inscricao.campeonatoId}`}
                    className="bg-[var(--verde-claro)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--verde)] transition-colors"
                  >
                    Ver Página do Campeonato
                  </Link>
                </div>
              </div>
            ))}
            <p className="text-sm text-right mt-2 p-4 text-gray-500">
              Total de {inscricoes.length} inscrição(ões)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}