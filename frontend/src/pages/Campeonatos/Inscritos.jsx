import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ShieldX, Frown } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

export default function CampeonatosInscritos() {
  const { user } = useContext(AuthContext);
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [inscricaoParaExcluir, setInscricaoParaExcluir] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchInscricoes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Rota para buscar os campeonatos em que o usuário logado está inscrito
      const response = await api.get('/championship/user'); 
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

  const abrirPopupConfirmacao = (inscricao) => {
    setInscricaoParaExcluir(inscricao);
    setIsPopupOpen(true);
  };

  const fecharPopup = () => {
    setInscricaoParaExcluir(null);
    setIsPopupOpen(false);
  };

  const handleExcluirInscricao = async () => {
    if (!inscricaoParaExcluir) return;

    try {
      const { campeonato, time } = inscricaoParaExcluir;
      // Rota correta para desinscrever um time de um campeonato
      await api.delete(`/championship/${campeonato.id}/time/${time.id}`);
      
      setInscricoes(prev => 
        prev.filter(i => !(i.campeonato.id === campeonato.id && i.time.id === time.id))
      );
      
      fecharPopup();
    } catch (err) {
      console.error("Erro ao tentar remover a inscrição:", err);
      const errorMessage = err.response?.data?.error || "Ocorreu um erro."
      alert(`Não foi possível remover a inscrição: ${errorMessage}`);
      fecharPopup();
    }
  };

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
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Minhas Inscrições</h1>

        {inscricoes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">Você não está inscrito em nenhum campeonato.</p>
            <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Ver Campeonatos
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-4">
            {inscricoes.map((inscricao) => (
              <div 
                key={`${inscricao.campeonato.id}-${inscricao.time.id}`} 
                className="flex flex-col sm:flex-row justify-between items-center border-b p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold text-lg text-gray-800">{inscricao.campeonato.nome}</p>
                  <p className="text-gray-600">Inscrito com o time: <span className="font-medium">{inscricao.time.nome}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/campeonato/${inscricao.campeonato.id}`}
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Página
                  </Link>
                  <button
                    onClick={() => abrirPopupConfirmacao(inscricao)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    title="Cancelar Inscrição"
                  >
                    <ShieldX size={18} />
                  </button>
                </div>
              </div>
            ))}
            <p className="text-sm text-right mt-4 pr-4 text-gray-500">
              {inscricoes.length} inscrição(ões) no total
            </p>
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800">Cancelar Inscrição</h3>
            <p className="text-center text-gray-600 mb-6">
              Tem certeza que quer remover o time <span className="font-bold">{inscricaoParaExcluir?.time.nome}</span> do campeonato <span className="font-bold">{inscricaoParaExcluir?.campeonato.nome}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleExcluirInscricao}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                Sim, remover
              </button>
              <button
                onClick={fecharPopup}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}