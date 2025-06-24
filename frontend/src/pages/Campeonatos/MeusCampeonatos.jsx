import React, { useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

export default function CriarCampeonato() {
  const [etapa, setEtapa] = useState(0);
  const [campeonato, setCampeonato] = useState({
    id: null,
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    premio: '',
    formato: '',
    numeroTimes: '',
  });
  const [sucesso, setSucesso] = useState(false);
  const [campeonatoSalvo, setCampeonatoSalvo] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampeonato((prev) => ({ ...prev, [name]: value }));
  };

  const camposPreenchidos =
    campeonato.nome &&
    campeonato.descricao &&
    campeonato.dataInicio &&
    campeonato.dataFim &&
    campeonato.premio;

  const formatos = ["MATA_MATA", "GRUPO", "MATA_MATA_CHAVEAMENTO"];
  const numerosTimes = ['8', '16', '32'];

  const abrirPopup = () => {
    setEtapa(1);
    setModoEdicao(false);
  };

  const avancarEtapa = async () => {
    if (etapa === 3) {
      try {
        let response;
        if (modoEdicao) {
          response = await api.put(`/championship/${campeonato.id}`, campeonato);
          setModoEdicao(false);
        } else {
          response = await api.post('/championship', campeonato);
          setSucesso(true);
        }
        setCampeonatoSalvo(response.data);
        setEtapa(0);
      } catch (error) {
        console.error('Erro ao salvar campeonato:', error);
        alert('Erro ao salvar o campeonato. Verifique os dados ou o login.');
      }
    } else {
      setEtapa(etapa + 1);
    }
  };

  const removerCampeonato = async () => {
    if (campeonatoSalvo?.id) {
      try {
        await api.delete(`/championship/${campeonatoSalvo.id}`);
        setCampeonatoSalvo(null);
      } catch (error) {
        console.error('Erro ao remover:', error);
        alert('Erro ao remover o campeonato.');
      }
    }
  };

  const editarCampeonato = () => {
    setCampeonato(campeonatoSalvo);
    setEtapa(1);
    setModoEdicao(true);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md max-w-4/5 w-full min-h-7/8 m-20">
      <button
        onClick={abrirPopup}
        className="flex items-center justify-center bg-[var(--verde-claro)] text-white rounded-xl text-center font-bold text-lg p-4 hover:bg-[var(--verde)] h-1/12 max-h-full w-1/4 shadow-md mb-4 mt-4"
      >
        Novo Campeonato
      </button>

      {campeonatoSalvo && (
        <div className="flex align-center justify-between items-center w-full max-w-4/5 bg-gray-100 p-6 rounded-xl shadow mb-4">
          <h3 className="text-xl font-bold">{campeonatoSalvo.nome}</h3>
          <div className="flex items-center mr-2 gap-2">
            <button onClick={editarCampeonato}>
              <img src="../src/assets/edit_Pen.svg" alt="Editar" />
            </button>
            <button onClick={removerCampeonato}>
              <img src="../src/assets/delete.svg" alt="Remover" />
            </button>
          </div>
        </div>
      )}

      {etapa > 0 && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.5)] flex items-center justify-center z-10 p-4">
          <Card title={modoEdicao ? "Editar Campeonato" : "Criação de Campeonato"}>
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
                  name="premio"
                  placeholder="Premiação"
                  value={campeonato.premio}
                  onChange={handleChange}
                  className="w-full p-2 mb-4 border rounded"
                />
                <button
                  onClick={avancarEtapa}
                  disabled={!camposPreenchidos}
                  className={`w-full py-2 rounded text-white ${
                    camposPreenchidos
                      ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                      : 'bg-gray-600 cursor-not-allowed'
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
                      campeonato.formato === formato
                        ? 'bg-[var(--verde)] text-white border-black'
                        : 'bg-gray-100'
                    }`}
                  >
                    {formato}
                  </button>
                ))}
                <button
                  onClick={avancarEtapa}
                  disabled={!campeonato.formato}
                  className={`w-full py-2 rounded text-white mt-2 ${
                    campeonato.formato
                      ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                      : 'bg-gray-600 cursor-not-allowed'
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
                      campeonato.numeroTimes === num
                        ? 'bg-[var(--verde)] text-white border-black'
                        : 'bg-gray-100'
                    }`}
                  >
                    {num} Times
                  </button>
                ))}
                <button
                  onClick={avancarEtapa}
                  disabled={!campeonato.numeroTimes}
                  className={`w-full py-2 rounded text-white mt-2 ${
                    campeonato.numeroTimes
                      ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {modoEdicao ? 'Salvar Alterações' : 'Finalizar'}
                </button>
              </>
            )}
          </Card>
        </div>
      )}

      {sucesso && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.5)] flex items-center justify-center z-20">
          <div className="bg-green-100 text-green-800 p-6 rounded-xl shadow-lg text-center w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Campeonato criado com sucesso!</h2>
            <button
              onClick={() => {
                setSucesso(false);
                setCampeonato({
                  id: null,
                  nome: '',
                  descricao: '',
                  dataInicio: '',
                  dataFim: '',
                  premio: '',
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
