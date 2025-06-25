import React, { useState } from 'react';

export default function CadastroReservas() {
  const [reservas, setReservas] = useState([]);
  const [popupAberto, setPopupAberto] = useState(false);
  const [reservaAtual, setReservaAtual] = useState({
    nome: '',
    genero: '',
    altura: '',
    numero: '',
    idade: '',
  });
  const [editandoIndex, setEditandoIndex] = useState(null);

  const abrirPopup = (index = null) => {
    if (index !== null) {
      setReservaAtual(reservas[index]);
      setEditandoIndex(index);
    } else {
      setReservaAtual({ nome: '', genero: '', altura: '', numero: '', idade: '' });
      setEditandoIndex(null);
    }
    setPopupAberto(true);
  };

  const fecharPopup = () => {
    setPopupAberto(false);
    setReservaAtual({ nome: '', genero: '', altura: '', numero: '', idade: '' });
    setEditandoIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservaAtual((prev) => ({ ...prev, [name]: value }));
  };

  const salvarReserva = () => {
    if (editandoIndex !== null) {
      const atualizados = [...reservas];
      atualizados[editandoIndex] = reservaAtual;
      setReservas(atualizados);
    } else {
      setReservas((prev) => [...prev, reservaAtual]);
    }
    fecharPopup();
  };

  const excluirReserva = (index) => {
    const atualizados = reservas.filter((_, i) => i !== index);
    setReservas(atualizados);
  };

  const camposPreenchidos = Object.values(reservaAtual).every((v) => v !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 to-blue-300 p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-teal-900">JOGADORES RESERVAS</h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => abrirPopup()}
          className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
        >
          Criar Novo Jogador Reserva
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-4 rounded-xl shadow">
        {reservas.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum jogador reserva cadastrado.</p>
        ) : (
          <ul>
            {reservas.map((reserva, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <span>
                  {reserva.nome} — Camisa {reserva.numero} — {reserva.genero}, {reserva.idade} anos, {reserva.altura}m
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => abrirPopup(index)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirReserva(index)}
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
          {reservas.length}/22 jogadores reservas criados
        </p>
      </div>

      {popupAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-xl font-bold text-center mb-4">Cadastro de Jogador Reserva</h2>
            <input
              type="text"
              name="nome"
              placeholder="Nome do jogador"
              value={reservaAtual.nome}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="genero"
              placeholder="Gênero"
              value={reservaAtual.genero}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="altura"
              placeholder="Altura (em metros)"
              value={reservaAtual.altura}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="numero"
              placeholder="Número da camiseta"
              value={reservaAtual.numero}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="idade"
              placeholder="Idade"
              value={reservaAtual.idade}
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
                onClick={salvarReserva}
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