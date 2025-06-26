import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import api from '../../services/api';

export default function CadastroJogadores() {
  const location = useLocation();
  const navigate = useNavigate();
  const timeId = location.state?.timeId;
  const [jogadores, setJogadores] = useState([]);
  const [popupAberto, setPopupAberto] = useState(false);
  const [jogadorAtual, setJogadorAtual] = useState({
    nome: '',
    genero: '',
    altura: '',
    numeroCamisa: '',
  });
  const [editandoId, setEditandoId] = useState(null);
  const [jogadorExpandido, setJogadorExpandido] = useState(null);

  const carregarJogadores = useCallback(async () => {
    try {
      const response = await api.get(`/player/time/${timeId}`);
      setJogadores(response.data);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    }
  }, [timeId]);

  useEffect(() => {
    if (timeId) {
      carregarJogadores();
    }
  }, [timeId, carregarJogadores]);

  const abrirPopup = (jogador = null) => {
    if (jogador) {
      setJogadorAtual({
        nome: jogador.nome || '',
        genero: jogador.genero || '',
        altura: jogador.altura ? jogador.altura.toString() : '',
        numeroCamisa: jogador.numeroCamisa ? jogador.numeroCamisa.toString() : '',
      });
      setEditandoId(jogador.id);
    } else {
      setJogadorAtual({
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
    setJogadorAtual({
      nome: '',
      genero: '',
      altura: '',
      numeroCamisa: '',
    });
    setEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJogadorAtual((prev) => ({ ...prev, [name]: value }));
  };

  const salvarJogador = async () => {
    try {
      const jogadorData = {
        nome: jogadorAtual.nome,
        numeroCamisa: parseInt(jogadorAtual.numeroCamisa) || 0,
        genero: jogadorAtual.genero,
        altura: parseFloat(jogadorAtual.altura) || 0
      };

      if (editandoId) {
        await api.put(`/player/${editandoId}`, jogadorData);
      } else {
        await api.post(`/player/time/${timeId}`, jogadorData);
      }

      await carregarJogadores();
      fecharPopup();
    } catch (error) {
      console.error('Erro ao salvar jogador:', error.response?.data || error.message);
      alert(`Erro ao salvar jogador: ${error.response?.data?.message || 'Verifique os dados e tente novamente'}`);
    }
  };

  const excluirJogador = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este jogador?')) {
      try {
        await api.delete(`/player/${id}`);
        await carregarJogadores();
      } catch (error) {
        console.error('Erro ao excluir jogador:', error);
        alert('Erro ao excluir jogador. Tente novamente.');
      }
    }
  };

  const toggleExpandirJogador = (id) => {
    setJogadorExpandido(jogadorExpandido === id ? null : id);
  };

  const camposPreenchidos = jogadorAtual.nome && jogadorAtual.genero && jogadorAtual.altura && jogadorAtual.numeroCamisa;

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
        <h1 className="text-center font-bold text-4xl pr-20">JOGADORES</h1>
        <div></div>
      </div>

      {/* Botão de adicionar */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => abrirPopup()}
          className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
        >
          Adicionar Jogador
        </button>
      </div>

      {/* Lista de jogadores */}
      <div className="max-w-3xl mx-auto bg-white p-4 rounded-xl shadow w-full">
        {jogadores.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum jogador cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {jogadores.map((jogador) => (
              <li key={jogador.id} className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-[var(--verde)] text-white cursor-pointer transition-colors">
                  <button
                    onClick={() => toggleExpandirJogador(jogador.id)}
                    className="flex-1 text-left"
                  >
                    <span className="font-medium">
                    <span className='bg-[var(--verde-piscina-escuro)] text-bold rounded-xl pr-2 pl-2 pt-1 pb-1'>{jogador.numeroCamisa}</span> <span className="font-bold">{jogador.nome}</span>
                    </span>
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirPopup(jogador);
                      }}
                      className="text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      <img src="../src/assets/edit_Pen_white.svg" alt="Editar" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        excluirJogador(jogador.id);
                      }}
                      className="text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      <img src="../src/assets/delete_white.svg" alt="Excluir" />
                    </button>
                  </div>
                </div>
                
                {jogadorExpandido === jogador.id && (
                  <div className="p-4 bg-white border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Gênero:</p>
                        <p className="font-medium">{jogador.genero}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Altura:</p>
                        <p className="font-medium">{jogador.altura}m</p>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-right mt-2 text-gray-600">
          {jogadores.length} jogadores cadastrados
        </p>
      </div>

      {/* Modal de cadastro */}
      {popupAberto && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.7)] flex items-center justify-center z-10 p-4">
          <Card 
            title={editandoId ? "Editar Jogador" : "Cadastrar Jogador"}
            backButtonVariant="close"
            onBackClick={fecharPopup}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="nome-jogador" className="block text-gray-700 mb-1">Nome</label>
                <input
                  id="nome-jogador"
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={jogadorAtual.nome}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label htmlFor="numero-jogador" className="block text-gray-700 mb-1">Número da Camisa</label>
                <input
                  id="numero-jogador"
                  type="number"
                  name="numeroCamisa"
                  placeholder="Número"
                  value={jogadorAtual.numeroCamisa}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label htmlFor="genero-jogador" className="block text-gray-700 mb-1">Gênero</label>
                <select
                  id="genero-jogador"
                  name="genero"
                  value={jogadorAtual.genero}
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
                <label htmlFor="altura-jogador" className="block text-gray-700 mb-1">Altura (metros)</label>
                <input
                  id="altura-jogador"
                  type="number"
                  step="0.01"
                  name="altura"
                  placeholder="1.75"
                  value={jogadorAtual.altura}
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
                  onClick={salvarJogador}
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