import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import api from '../../services/api';

export default function CadastroReservas() {
  const location = useLocation();
  const navigate = useNavigate();
  const timeId = location.state?.timeId;
  const [reservas, setReservas] = useState([]);
  const [popupAberto, setPopupAberto] = useState(false);
  const [reservaAtual, setReservaAtual] = useState({
    nome: '',
    genero: '',
    altura: '',
    numeroCamisa: '',
  });
  const [editandoId, setEditandoId] = useState(null);
  const [reservaExpandida, setReservaExpandida] = useState(null);

  const carregarReservas = useCallback(async () => {
    try {
      const response = await api.get(`/player/time/${timeId}`);
      setReservas(response.data);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    }
  }, [timeId]);

  useEffect(() => {
    if (timeId) {
      carregarReservas();
    }
  }, [timeId, carregarReservas]);

  const abrirPopup = (reserva = null) => {
    if (reserva) {
      setReservaAtual({
        nome: reserva.nome || '',
        genero: reserva.genero || '',
        altura: reserva.altura ? reserva.altura.toString() : '',
        numeroCamisa: reserva.numeroCamisa ? reserva.numeroCamisa.toString() : '',
      });
      setEditandoId(reserva.id);
    } else {
      setReservaAtual({
        nome: '',
        genero: '',
        altura: '',
        numeroCamisa: '',
      });
      setEditandoId(null);
    }
    setPopupAberto(true);
  };

  const fecharPopup = () => {
    setPopupAberto(false);
    setReservaAtual({
      nome: '',
      genero: '',
      altura: '',
      numeroCamisa: '',
    });
    setEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservaAtual((prev) => ({ ...prev, [name]: value }));
  };

  const salvarReserva = async () => {
    try {
      const reservaData = {
        nome: reservaAtual.nome,
        numeroCamisa: parseInt(reservaAtual.numeroCamisa) || 0,
        genero: reservaAtual.genero,
        altura: parseFloat(reservaAtual.altura) || 0
      };

      if (editandoId) {
        await api.put(`/player/${editandoId}`, reservaData);
      } else {
        await api.post(`/player/time/${timeId}`, reservaData);
      }

      await carregarReservas();
      fecharPopup();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error.response?.data || error.message);
      alert(`Erro ao salvar reserva: ${error.response?.data?.message || 'Verifique os dados e tente novamente'}`);
    }
  };

  const excluirReserva = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        await api.delete(`/player/${id}`);
        await carregarReservas();
      } catch (error) {
        console.error('Erro ao excluir reserva:', error);
        alert('Erro ao excluir reserva. Tente novamente.');
      }
    }
  };

  const toggleExpandirReserva = (id) => {
    setReservaExpandida(reservaExpandida === id ? null : id);
  };

  const camposPreenchidos = reservaAtual.nome && reservaAtual.genero && reservaAtual.altura && reservaAtual.numeroCamisa;

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md max-w-4/5 w-full min-h-7/8 md:max-h-screen m-20">
      {/* Cabeçalho */}
      <div className='w-full bg-[var(--verde-piscina)] text-white p-4 rounded-t-xl flex justify-between items-center mb-4'>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[var(--cinza-claro)] hover:text-white text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        <h1 className="text-center font-bold text-4xl pr-20">JOGADORES RESERVAS</h1>
        <div></div>
      </div>

      {/* Botão de adicionar */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => abrirPopup()}
          className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
        >
          Adicionar Reserva
        </button>
      </div>

      {/* Lista de reservas */}
      <div className="max-w-3xl mx-auto bg-white p-4 rounded-xl shadow w-full">
        {reservas.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma reserva cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {reservas.map((reserva) => (
              <li key={reserva.id} className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-[var(--verde)] text-white cursor-pointer transition-colors">
                  <button
                    onClick={() => toggleExpandirReserva(reserva.id)}
                    className="flex-1 text-left"
                  >
                    <span className="font-medium">
                      <span className='bg-[var(--verde-piscina-escuro)] text-bold rounded-xl pr-2 pl-2 pt-1 pb-1'>{reserva.numeroCamisa}</span> <span className="font-bold">{reserva.nome}</span>
                    </span>
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirPopup(reserva);
                      }}
                      className="text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      <img src="../src/assets/edit_Pen_white.svg" alt="Editar" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        excluirReserva(reserva.id);
                      }}
                      className="text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      <img src="../src/assets/delete_white.svg" alt="Excluir" />
                    </button>
                  </div>
                </div>
                
                {reservaExpandida === reserva.id && (
                  <div className="p-4 bg-white border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Gênero:</p>
                        <p className="font-medium">{reserva.genero}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Altura:</p>
                        <p className="font-medium">{reserva.altura}m</p>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-right mt-2 text-gray-600">
          {reservas.length} reservas cadastradas
        </p>
      </div>

      {/* Modal de cadastro */}
      {popupAberto && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.7)] flex items-center justify-center z-10 p-4">
          <Card 
            title={editandoId ? "Editar Reserva" : "Cadastrar Reserva"}
            backButtonVariant="close"
            onBackClick={fecharPopup}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="nome-reserva" className="block text-gray-700 mb-1">Nome</label>
                <input
                  id="nome-reserva"
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={reservaAtual.nome}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label htmlFor="numero-reserva" className="block text-gray-700 mb-1">Número da Camisa</label>
                <input
                  id="numero-reserva"
                  type="number"
                  name="numeroCamisa"
                  placeholder="Número"
                  value={reservaAtual.numeroCamisa}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label htmlFor="genero-reserva" className="block text-gray-700 mb-1">Gênero</label>
                <select
                  id="genero-reserva"
                  name="genero"
                  value={reservaAtual.genero}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecione</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="altura-reserva" className="block text-gray-700 mb-1">Altura (metros)</label>
                <input
                  id="altura-reserva"
                  type="number"
                  step="0.01"
                  name="altura"
                  placeholder="1.75"
                  value={reservaAtual.altura}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={fecharPopup}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarReserva}
                  disabled={!camposPreenchidos}
                  className={`px-4 py-2 rounded-lg text-white ${
                    camposPreenchidos
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {editandoId ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}