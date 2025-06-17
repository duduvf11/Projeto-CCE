import React, { useState } from 'react';
import Card from '../../components/Card';

export default function CriarCampeonato() {
  const [etapa, setEtapa] = useState(0);
  const [campeonato, setCampeonato] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    premiacao: '',
    formato: '',
    numeroTimes: '',
  });
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampeonato((prev) => ({ ...prev, [name]: value }));
  };

  const camposPreenchidos =
    campeonato.nome &&
    campeonato.descricao &&
    campeonato.dataInicio &&
    campeonato.dataFim &&
    campeonato.premiacao;

  const formatos = ['Mata-mata', 'Mata-mata com chaveamento', 'Suiço', 'Grupos'];
  const numerosTimes = ['8', '16', '32'];

  const abrirPopup = () => setEtapa(1);

  const avancarEtapa = () => {
    if (etapa === 3) {
      setSucesso(true);
      setEtapa(0);
    } else {
      setEtapa(etapa + 1);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md max-w-4/5 w-full h-4/5 m-20">
      <button
        onClick={abrirPopup}
        className="flex items-center justify-center bg-[var(--verde-claro)] text-white rounded-xl text-center font-bold text-lg p-4 hover:bg-[var(--verde)] h-1/12 max-h-full w-1/4 shadow-md mb-4 mt-4"
      >
        Novo Campeonato
      </button>

      {/* Popup principal com etapas */}
      {etapa > 0 && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.5)] flex items-center justify-center z-10 p-4">
            <Card title="Criação de Campeonato">
              {etapa === 1 && (
                <>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome do campeonato"
                    value={campeonato.nome}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="descricao"
                    placeholder="Descrição"
                    value={campeonato.descricao}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    />
                  <input
                    type="date"
                    name="dataInicio"
                    value={campeonato.dataInicio}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    />
                  <input
                    type="date"
                    name="dataFim"
                    value={campeonato.dataFim}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="text"
                    name="premiacao"
                    placeholder="Premiação"
                    value={campeonato.premiacao}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                    />
                  <button
                    onClick={avancarEtapa}
                    disabled={!camposPreenchidos}
                    className={`w-full py-2 rounded text-white ${
                      camposPreenchidos ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                    >
                    Avançar
                  </button>
                </>
              )}

              {etapa === 2 && (
                <>
                  <p className="font-semibold mb-2">Formato do Campeonato:</p>
                  {formatos.map((formato) => (
                    <button
                    key={formato}
                      onClick={() => setCampeonato((prev) => ({ ...prev, formato }))}
                      className={`w-full mb-2 p-2 rounded border ${
                        campeonato.formato === formato ? 'bg-[var(--verde)] text-white border-black' : 'bg-gray-100'
                      }`}
                      >
                      {formato}
                    </button>
                  ))}
                  <button
                    onClick={avancarEtapa}
                    disabled={!campeonato.formato}
                    className={`w-full py-2 rounded text-white mt-2 ${
                      campeonato.formato ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                    >
                    Avançar
                  </button>
                </>
              )}

              {etapa === 3 && (
                <>
                  <p className="font-semibold mb-2">Número de Times:</p>
                  {numerosTimes.map((num) => (
                    <button
                    key={num}
                    onClick={() => setCampeonato((prev) => ({ ...prev, numeroTimes: num }))}
                    className={`w-full mb-2 p-2 rounded border ${
                      campeonato.numeroTimes === num ? 'bg-[var(--verde)] text-white border-black' : 'bg-gray-100'
                    }`}
                    >
                      {num} Times
                    </button>
                  ))}
                  <button
                    onClick={avancarEtapa}
                    disabled={!campeonato.numeroTimes}
                    className={`w-full py-2 rounded text-white mt-2 ${
                      campeonato.numeroTimes ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                    >
                    Finalizar
                  </button>
                </>
              )}
            </Card>
        </div>
      )}

      {/* Sucesso */}
      {sucesso && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.5)] flex items-center justify-center z-20">
          <div className="bg-green-100 text-green-800 p-6 rounded-xl shadow-lg text-center w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Campeonato criado com sucesso!</h2>
            <button
              onClick={() => {
                setSucesso(false);
                setCampeonato({
                  nome: '',
                  descricao: '',
                  dataInicio: '',
                  dataFim: '',
                  premiacao: '',
                  formato: '',
                  numeroTimes: '',
                });
              }}
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