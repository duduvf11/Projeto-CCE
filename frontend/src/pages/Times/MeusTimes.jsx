import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Card from '../../components/Card';
import api from '../../services/api';

export default function CriarTime() {
  const [popupAberto, setPopupAberto] = useState(false);
  const [nomeTime, setNomeTime] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);
  const [times, setTimes] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [timeEditando, setTimeEditando] = useState(null);
  const [timesExpandidos, setTimesExpandidos] = useState([]);

  // Carrega os times ao iniciar
  useEffect(() => {
    carregarTimes();
  }, []);

  const carregarTimes = async () => {
    try {
      const response = await api.get('/team');
      setTimes(response.data);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      alert('Erro ao carregar times. Verifique o console para mais detalhes.');
    }
  };

  const abrirPopup = () => {
    setPopupAberto(true);
    setConfirmacao(false);
    setNomeTime('');
    setModoEdicao(false);
    setTimeEditando(null);
  };

  const abrirEdicao = (time) => {
    setTimeEditando(time);
    setNomeTime(time.nome);
    setPopupAberto(true);
    setModoEdicao(true);
  };

  const salvarTime = async () => {
    try {
      const timeData = {
        nome: nomeTime
      };

      if (modoEdicao) {
        await api.put(`/team/${timeEditando.id}`, timeData);
      } else {
        await api.post('/team', timeData);
      }

      setConfirmacao(true);
      carregarTimes();
    } catch (error) {
      console.error('Erro ao salvar time:', error);
      alert('Erro ao salvar o time. Verifique os dados.');
    }
  };

  const deletarTime = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este time?')) {
      try {
        await api.delete(`/team/${id}`);
        carregarTimes();
      } catch (error) {
        console.error('Erro ao deletar time:', error);
        alert('Erro ao excluir time. Verifique o console para mais detalhes.');
      }
    }
  };

  const fecharConfirmacao = () => {
    setConfirmacao(false);
    setPopupAberto(false);
  };

  const toggleTimeExpandido = (timeId) => {
    setTimesExpandidos(prev => 
      prev.includes(timeId) 
        ? prev.filter(id => id !== timeId) 
        : [...prev, timeId]
    );
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md max-w-4/5 w-full min-h-7/8 md:max-h-screen m-20 p-6">
      <button
        onClick={abrirPopup}
        className="flex items-center justify-center bg-[var(--verde-claro)] text-white rounded-xl text-center font-bold text-lg p-4 hover:bg-[var(--verde)] h-1/12 max-h-full w-1/4 shadow-md mb-4 mt-4"
      >
        Novo Time
      </button>

      <div className="flex flex-col w-3/5 p-6 rounded-xl gap-6">
        {times.map((time) => (
          <div key={time.id} className="w-full shadow rounded-xl">
            {/* Botão principal do time */}
            <button
              onClick={() => toggleTimeExpandido(time.id)}
              className="w-full bg-[var(--verde)] text-white p-4 rounded-t-xl text-left font-bold flex justify-between items-center"
            >
              <span>{time.nome}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  timesExpandidos.includes(time.id) ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`bg-gray-50 rounded-b-xl shadow overflow-hidden transition-all duration-300 ${
                timesExpandidos.includes(time.id) ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2 pt-2">
                  <Link
                    to="/meus-times/jogadores"
                    state={{ timeId: time.id }} // Opcional: passar o ID do time como state
                    className="bg-[var(--verde-piscina)] text-white px-4 py-2 rounded-lg hover:bg-[var(--verde-piscina-escuro)] flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Jogadores
                  </Link>

                  <Link
                    to="/meus-times/reservas"
                    state={{ timeId: time.id }} // Opcional: passar o ID do time como state
                    className="bg-[var(--verde-piscina)] text-white px-4 py-2 rounded-lg hover:bg-[var(--verde-piscina-escuro)] flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Reservas
                  </Link>

                  <button
                    onClick={() => abrirEdicao(time)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>

                  <button
                    onClick={() => deletarTime(time.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup de Criação/Edição */}
      {popupAberto && !confirmacao && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.5)] flex items-center justify-center z-10 p-4">
          <Card title={modoEdicao ? "Editar Time" : "Criar Novo Time"}
                backButtonVariant="close"
                onBackClick={() => setPopupAberto(false)}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do time"
                value={nomeTime}
                onChange={(e) => setNomeTime(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <button
                onClick={salvarTime}
                disabled={!nomeTime.trim()}
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  nomeTime.trim() 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {modoEdicao ? 'Salvar Alterações' : 'Criar Time'}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Popup de Confirmação */}
      {confirmacao && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.5)] flex items-center justify-center z-20">
          <div className="bg-green-100 text-green-800 p-6 rounded-xl shadow-lg text-center w-[320px]">
            <h2 className="text-2xl font-bold mb-4">
              {modoEdicao ? 'Time atualizado com sucesso!' : 'Time criado com sucesso!'}
            </h2>
            <button
              onClick={fecharConfirmacao}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}