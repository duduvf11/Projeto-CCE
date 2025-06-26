import React, { useState } from 'react';
//import { useLocation } from 'react-router-dom';

export default function CadastroJogadores() {
  //const location = useLocation();
  //const timeId = location.state?.timeId;
  const [jogadores, setJogadores] = useState([]);
  const [popupAberto, setPopupAberto] = useState(false);
  const [jogadorAtual, setJogadorAtual] = useState({
    nome: '',
    genero: '',
    altura: '',
    numero: '',
    idade: '',
  });
  const [editandoIndex, setEditandoIndex] = useState(null);

  const abrirPopup = (index = null) => {
    if (index !== null) {
      setJogadorAtual(jogadores[index]);
      setEditandoIndex(index);
    } else {
      setJogadorAtual({ nome: '', genero: '', altura: '', numero: '', idade: '' });
      setEditandoIndex(null);
    }
    setPopupAberto(true);
  };

  const fecharPopup = () => {
    setPopupAberto(false);
    setJogadorAtual({ nome: '', genero: '', altura: '', numero: '', idade: '' });
    setEditandoIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJogadorAtual((prev) => ({ ...prev, [name]: value }));
  };

  const salvarJogador = () => {
    if (editandoIndex !== null) {
      const atualizados = [...jogadores];
      atualizados[editandoIndex] = jogadorAtual;
      setJogadores(atualizados);
    } else {
      setJogadores((prev) => [...prev, jogadorAtual]);
    }
    fecharPopup();
  };

  const excluirJogador = (index) => {
    const atualizados = jogadores.filter((_, i) => i !== index);
    setJogadores(atualizados);
  };

  const camposPreenchidos = Object.values(jogadorAtual).every((v) => v !== '');

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md max-w-4/5 w-full min-h-7/8 md:max-h-screen m-20">
      <div className='w-full bg-[var(--verde-piscina)] text-white p-4 rounded-t-xl flex justify-between items-center mb-4'>
        <button
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

      <div className="flex justify-center mb-4">
        <button
          onClick={() => abrirPopup()}
          className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
        >
          Criar Novo Jogadores
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-4 rounded-xl shadow">
        {jogadores.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum jogador cadastrado.</p>
        ) : (
          <ul>
            {jogadores.map((jogador, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <span>
                  {jogador.nome} — Camisa {jogador.numero} — {jogador.genero}, {jogador.idade} anos, {jogador.altura}m
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => abrirPopup(index)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirJogador(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-right mt-2 text-gray-600">
          {jogadores.length}/11 jogadores criados
        </p>
      </div>

      {popupAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-xl font-bold text-center mb-4">Cadastro de Jogadores</h2>
            <input
              type="text"
              name="nome"
              placeholder="Nome do jogador"
              value={jogadorAtual.nome}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="genero"
              placeholder="Gênero"
              value={jogadorAtual.genero}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="altura"
              placeholder="Altura (em metros) ex: 1.75"
              value={jogadorAtual.altura}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="numero"
              placeholder="Número da camiseta"
              value={jogadorAtual.numero}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="idade"
              placeholder="Idade"
              value={jogadorAtual.idade}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={fecharPopup}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={salvarJogador}
                disabled={!camposPreenchidos}
                className={`px-4 py-2 rounded text-white ${
                  camposPreenchidos
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {editandoIndex !== null ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}