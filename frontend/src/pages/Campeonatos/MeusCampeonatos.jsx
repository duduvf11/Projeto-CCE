import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function CriarCampeonato() {
  // Estados principais
  const [etapa, setEtapa] = useState(0);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [listaCampeonatos, setListaCampeonatos] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [erroFormulario, setErroFormulario] = useState('');
  
  // Estado do formulário
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

  // Constantes
  const formatos = [
    { valor: "MATA_MATA", nome: "Mata-Mata" },
    { valor: "GRUPO", nome: "Grupo" },
  ];

  const numerosTimes = ['8', '16', '32'];

  // Busca os campeonatos ao carregar o componente
  useEffect(() => {
    fetchCampeonatos();
  }, []);

  // Função para buscar campeonatos
  const fetchCampeonatos = async () => {
    try {
      const response = await api.get('/championship');
      setListaCampeonatos(response.data);
    } catch (error) {
      console.error('Erro ao buscar campeonatos:', error);
    }
  };

  // Manipulador de mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampeonato(prev => ({ ...prev, [name]: value }));
    // Limpa erros quando o usuário começa a digitar
    if (erroFormulario) setErroFormulario('');
  };

  // Verifica se os campos obrigatórios estão preenchidos
  const camposPreenchidos = 
    campeonato.nome &&
    campeonato.descricao &&
    campeonato.dataInicio &&
    campeonato.dataFim &&
    campeonato.premio;

  // Validação de datas
  const validarDatas = () => {
    if (new Date(campeonato.dataFim) < new Date(campeonato.dataInicio)) {
      setErroFormulario('A data final não pode ser anterior à data de início');
      return false;
    }
    return true;
  };

  // Abre o modal para criar novo campeonato (com reset completo)
  const abrirPopup = () => {
    setEtapa(1);
    setModoEdicao(false);
    setErroFormulario('');
    // Reset completo do estado
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
  };

  // Fecha o modal e reseta o estado
  const fecharModal = () => {
    setEtapa(0);
    setMensagemSucesso(null);
    setErroFormulario('');
  };

  // Avança entre as etapas ou finaliza o cadastro
  const avancarEtapa = async () => {
    // Validação específica para a etapa 1
    if (etapa === 1 && !validarDatas()) {
      return;
    }

    if (etapa === 3) {
      try {
        if (modoEdicao) {
          await api.put(`/championship/${campeonato.id}`, campeonato);
          setMensagemSucesso("Campeonato editado com sucesso!");
        } else {
          await api.post('/championship', campeonato);
          setMensagemSucesso("Campeonato criado com sucesso!");
        }
        
        // Atualiza a lista evitando duplicatas
        const campeonatosAtualizados = await api.get('/championship');
        setListaCampeonatos(campeonatosAtualizados.data);
        
        // Fecha o modal após 1.5 segundos
        setTimeout(() => {
          fecharModal();
        }, 1500);
      } catch (error) {
        console.error('Erro ao salvar campeonato:', error);
        setErroFormulario('Erro ao salvar. Verifique os dados ou o login.');
      }
    } else {
      setEtapa(etapa + 1);
    }
  };

  // Remove um campeonato
  const removerCampeonato = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este campeonato?')) {
      try {
        await api.delete(`/championship/${id}`);
        
        // Atualiza a lista removendo o item deletado
        setListaCampeonatos(prev => prev.filter(camp => camp.id !== id));
        
        setMensagemSucesso("Campeonato removido com sucesso!");
        setTimeout(() => setMensagemSucesso(null), 3000);
      } catch (error) {
        console.error('Erro ao remover:', error);
        setErroFormulario('Erro ao remover o campeonato.');
      }
    }
  };

  // Abre o modal para editar um campeonato existente
  const editarCampeonato = (camp) => {
    setCampeonato({ ...camp });
    setModoEdicao(true);
    setEtapa(1);
    setErroFormulario('');
  };

  // Formata data para exibição
  const formatarData = (dataString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-md max-w-4/5 w-full min-h-7/8 m-20 p-6">
      {/* Botão para criar novo campeonato */}
      <button
        onClick={abrirPopup}
        className="flex items-center justify-center bg-[var(--verde-claro)] text-white rounded-xl text-center font-bold text-lg p-4 hover:bg-[var(--verde)] h-1/12 max-h-full w-full md:w-1/3 shadow-md mb-8 transition-all duration-300"
      >
      Novo Campeonato
      </button>

      {/* Lista de campeonatos */}
      <div className="w-full max-w-5xl">
        {listaCampeonatos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Nenhum campeonato criado ainda</p>
            <button 
              onClick={abrirPopup}
              className="mt-4 bg-[var(--verde-claro)] text-white px-6 py-2 rounded-lg hover:bg-[var(--verde)] transition-colors"
            >
              Criar Primeiro Campeonato
            </button>
          </div>
        ) : (
          listaCampeonatos.map((camp) => (
            <div
              key={camp.id}
              className="flex flex-col justify-between md:flex-row items-start md:items-center w-full bg-gray-50 p-6 rounded-xl shadow mb-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-1/3 w-1/3 md:w-2/3">
                <h3 className="text-xl font-bold text-gray-800">{camp.nome}</h3>
                <p className="text-gray-600 mt-1">{camp.descricao}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <span className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatarData(camp.dataInicio)} - {formatarData(camp.dataFim)}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {camp.premio}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0 gap-3">
                <Link to={`/campeonato/${camp.id}`} className="flex items-center justify-center p-2 pr-4 pl-4 rounded-lg text-white font-bold bg-[var(--verde-claro)] hover:bg-[var(--verde)] transition-colors" title="Visualizar">
                  Ver Campeonato
                </Link>
                <button 
                  onClick={() => editarCampeonato(camp)}
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Editar"
                >
                  <img src="../src/assets/edit_Pen.svg" alt="Editar" />
                </button>
                <button 
                  onClick={() => removerCampeonato(camp.id)}
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-red-200 transition-colors"
                  title="Remover"
                >
                  <img src="../src/assets/delete.svg" alt="Remover" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de criação/edição */}
      {etapa > 0 && (
        <div className="fixed inset-0 bg-[rgba(58,58,58,0.7)] flex items-center justify-center z-10 p-4">
          <Card 
            title={modoEdicao ? "Editar Campeonato" : "Criação de Campeonato"}
            backButtonVariant="close"
            onBackClick={fecharModal}
          >
            {erroFormulario && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {erroFormulario}
              </div>
            )}

            {/* ETAPA 1 - Informações básicas */}
            {etapa === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome-campeonato" className="block text-gray-800 mb-1">
                    Nome do campeonato
                  </label>
                  <input
                    id="nome-campeonato"
                    type="text"
                    name="nome"
                    placeholder="Ex: Copa do Mundo 2023"
                    value={campeonato.nome}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-500 rounded-lg focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="descricao-campeonato" className="block text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="descricao-campeonato"
                    name="descricao"
                    placeholder="Descreva o campeonato..."
                    value={campeonato.descricao}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-gray-500 rounded-lg focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="data-inicio" className="block text-gray-700 mb-1">
                      Data de início
                    </label>
                    <input
                      id="data-inicio"
                      type="date"
                      name="dataInicio"
                      value={campeonato.dataInicio}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-500 rounded-lg focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="data-fim" className="block text-gray-700 mb-1">
                      Data de término
                    </label>
                    <input
                      id="data-fim"
                      type="date"
                      name="dataFim"
                      value={campeonato.dataFim}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-500 rounded-lg focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="premio-campeonato" className="block text-gray-700 mb-1">
                    Premiação
                  </label>
                  <input
                    id="premio-campeonato"
                    type="text"
                    name="premio"
                    placeholder="Ex: R$ 10.000,00"
                    value={campeonato.premio}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-[var(--verde-claro)] focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={fecharModal}
                    className="flex-1 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={avancarEtapa}
                    disabled={!camposPreenchidos}
                    className={`flex-1 py-3 rounded-lg text-white transition-colors ${
                      camposPreenchidos
                        ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Avançar
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 2 - Formato do campeonato */}
            {etapa === 2 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Formato do Campeonato:</h3>
                <div className="space-y-3">
                  {formatos.map((formato) => (
                    <button
                      key={formato.valor}
                      onClick={() => setCampeonato(prev => ({ ...prev, formato: formato.valor }))}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        campeonato.formato === formato.valor
                          ? 'border-[var(--verde)] bg-green-50'
                          : 'border-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          campeonato.formato === formato.valor 
                            ? 'border-[var(--verde)] bg-[var(--verde)]' 
                            : 'border-gray-900'
                        }`}>
                          {campeonato.formato === formato.valor && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium">{formato.nome}</span>
                      </div>
                      <p className="text-sm text-gray-500 ml-8 mt-1">
                        {formato.valor === "MATA_MATA" 
                          ? "Eliminação direta em partidas únicas" 
                          : formato.valor === "GRUPO" 
                            ? "Times divididos em grupos com fase classificatória" 
                            : "Fase de grupos seguida por eliminatórias"}
                      </p>
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEtapa(1)}
                    className="flex-1 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={avancarEtapa}
                    disabled={!campeonato.formato}
                    className={`flex-1 py-3 rounded-lg text-white transition-colors ${
                      campeonato.formato
                        ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Avançar
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3 - Número de times */}
            {etapa === 3 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Número de Times:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {numerosTimes.map((num) => (
                    <button
                      key={num}
                      onClick={() => setCampeonato(prev => ({ ...prev, numeroTimes: num }))}
                      className={`p-6 rounded-xl border-2 flex flex-col items-center transition-all ${
                        campeonato.numeroTimes === num
                          ? 'border-[var(--verde)] bg-green-50'
                          : 'border-gray-500 hover:border-gray-900'
                      }`}
                    >
                      <div className="text-2xl font-bold mb-2">{num}</div>
                      <div>Times</div>
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEtapa(2)}
                    className="flex-1 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={avancarEtapa}
                    disabled={!campeonato.numeroTimes}
                    className={`flex-1 py-3 rounded-lg text-white transition-colors ${
                      campeonato.numeroTimes
                        ? 'bg-[var(--verde-claro)] hover:bg-[var(--verde)]'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {modoEdicao ? 'Salvar Alterações' : 'Criar Campeonato'}
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Toast de sucesso */}
      {mensagemSucesso && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center animate-fadeInUp z-30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{mensagemSucesso}</span>
        </div>
      )}
    </div>
  );
}