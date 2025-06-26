import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// --- MOCK DATA ---
// Dados simulados para representar os diferentes estados do campeonato
const mockCampeonatos = {
  'suico-tabela': {
    id: 'suico-tabela',
    nome: 'Libertadores',
    formato: 'suico',
    view: 'tabela',
    local: 'Campo e Pista de Atletismo, UTFPR - Cornélio Procópio / PR',
    premioTotal: 'R$4.000,00',
    inscrito: false,
  },
  'suico-confrontos': {
    id: 'suico-confrontos',
    nome: 'Libertadores',
    formato: 'suico',
    view: 'confrontos',
    local: 'Campo e Pista de Atletismo, UTFPR - Cornélio Procópio / PR',
    premioTotal: 'R$4.000,00',
    inscrito: false,
  },
  'mata-mata-inicio': {
    id: 'mata-mata-inicio',
    nome: 'Libertadores',
    formato: 'mata-mata',
    view: 'inicio',
    local: 'Campo e Pista de Atletismo, UTFPR - Cornélio Procópio / PR',
    premioTotal: 'R$4.000,00',
    inscrito: true,
  },
   'mata-mata-chaveamento': {
    id: 'mata-mata-chaveamento',
    nome: 'Libertadores',
    formato: 'mata-mata',
    view: 'chaveamento',
    local: 'Campo e Pista de Atletismo, UTFPR - Cornélio Procópio / PR',
    premioTotal: 'R$4.000,00',
    inscrito: true,
  },
  // Dados compartilhados
  sharedData: {
      premios: [
        { lugar: '1º', premio: 'R$4.000,00', time: null },
        { lugar: '2º', premio: '-', time: null },
        { lugar: '3º', premio: '-', time: 'Tiger Fortune FC' },
        { lugar: '4º', premio: '-', time: 'Legacy' },
      ],
      times: [
        { id: 't1', nome: 'FC Lira', color: 'blue' },
        { id: 't2', nome: 'Rio do Taubaté', color: 'red' },
        { id: 't3', nome: 'Legacy', color: 'blue' },
        { id: 't4', nome: 'Tiger Fortune FC', color: 'red' },
        { id: 't5', nome: 'Blaze', color: 'red' },
        { id: 't6', nome: 'Betano', color: 'blue' },
        { id: 't7', nome: 'Jon Bet', color: 'blue' },
        { id: 't8', nome: 'FeFéca', color: 'red' },
      ],
      classificacao: [
        { pos: 1, equipe: 'Cruzeiro', pts: 9, j: 5, v: 3, e: 0, d: 2, sg: 5 },
        { pos: 2, equipe: 'Corinthians', pts: 8, j: 5, v: 2, e: 2, d: 1, sg: 3 },
        { pos: 3, equipe: 'Palmeiras', pts: 8, j: 5, v: 2, e: 2, d: 1, sg: 2 },
        { pos: 4, equipe: 'Santos', pts: 7, j: 5, v: 2, e: 1, d: 2, sg: 0 },
        { pos: 5, equipe: 'São Paulo', pts: 7, j: 5, v: 2, e: 1, d: 2, sg: -1 },
        { pos: 6, equipe: 'Flamengo', pts: 6, j: 5, v: 1, e: 3, d: 1, sg: 0 },
        { pos: 7, equipe: 'Vasco', pts: 5, j: 5, v: 1, e: 2, d: 2, sg: -2 },
        { pos: 8, equipe: 'Botafogo', pts: 5, j: 5, v: 1, e: 2, d: 2, sg: -3 },
      ],
      confrontos: [
        { timeA: 'Cruzeiro', timeB: 'FeFéca', placarA: 2, placarB: 0 },
        { timeA: 'Legacy', timeB: 'Betano', placarA: 0, placarB: 0 },
        { timeA: 'Blaze', timeB: 'Tiger Fortune FC', placarA: 0, placarB: 1 },
        { timeA: 'FC Lira', timeB: 'Rio do Taubaté', placarA: 1, placarB: 2 },
      ],
      chaveamento: [ // 4 partidas para as oitavas
        { timeA: 'FC Lira', timeB: 'Rio do Taubaté', placarA: null, placarB: null },
        { timeA: 'Legacy', timeB: 'Tiger Fortune FC', placarA: null, placarB: null },
        { timeA: 'Blaze', timeB: 'Betano', placarA: null, placarB: null },
        { timeA: 'Jon Bet', timeB: 'FeFéca', placarA: null, placarB: null },
      ]
  }
};

// --- SUB-COMPONENTES ---

const ShirtIcon = ({ color = '#2a6692' }) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3H15V2C15 1.45 14.55 1 14 1H10C9.45 1 9 1.45 9 2V3ZM20.5 5H16V4H8V5H3.5L3 7.5L5.5 11L6 20H18L18.5 11L21 7.5L20.5 5Z" />
    </svg>
);


const AwardsTable = ({ premios }) => (
    <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
            <button className="text-gray-700 flex items-center bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Regras <ChevronDown size={16} className="ml-1"/> </button>
        </div>
        <table className="w-full text-gray-800 text-center">
            <thead className="bg-gray-200">
                <tr>
                    <th className="p-2 font-normal">Lugar</th>
                    <th className="p-2 font-normal">Prêmio</th>
                    <th className="p-2 font-normal">Time</th>
                </tr>
            </thead>
            <tbody>
                {premios.map(p => (
                    <tr key={p.lugar}>
                        <td className="p-2 font-bold">{p.lugar}</td>
                        <td className="p-2 text-yellow-600 font-bold">{p.premio}</td>
                        <td className="p-2">{p.time || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="text-center mt-2">
            <button className="text-gray-500 hover:text-gray-800"><ChevronDown/></button>
        </div>
    </div>
);

const TeamsGrid = ({ times }) => (
  <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-lg">
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-center text-gray-800">
      {times.map(time => (
        <div key={time.id} className="flex flex-col items-center">
            <ShirtIcon color={time.color === 'red' ? '#c53a42' : '#2a6692'}/>
            <span className="text-sm mt-1">{time.nome}</span>
        </div>
      ))}
    </div>
    <div className="text-center mt-4">
        <button className="text-gray-500 hover:text-gray-800"><ChevronDown/></button>
    </div>
  </div>
);

const SwissTable = ({ classificacao }) => (
    <div className="mt-8 bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-gray-800 text-center text-sm">
            <thead className="bg-gray-100">
                <tr>
                    {['#', 'Equipe', 'PTS', 'J', 'V', 'E', 'D', 'SG'].map(h => <th key={h} className="p-2 font-normal">{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {classificacao.map((row, index) => (
                    <tr key={row.pos} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-2">{row.pos}</td>
                        <td className="p-2 text-left">{row.equipe}</td>
                        <td className="p-2 font-bold">{row.pts}</td>
                        <td className="p-2">{row.j}</td>
                        <td className="p-2">{row.v}</td>
                        <td className="p-2">{row.e}</td>
                        <td className="p-2">{row.d}</td>
                        <td className="p-2">{row.sg >= 0 ? `+${row.sg}` : row.sg}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const SwissMatches = ({ confrontos }) => (
    <div className="mt-8 bg-white shadow-md rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confrontos.map((match, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 p-3 rounded-md flex justify-between items-center">
                    <span className="text-gray-800 font-semibold text-right w-2/5">{match.timeA}</span>
                    <span className="bg-gray-800 text-white font-bold text-lg px-4 py-1 rounded">{`${match.placarA} - ${match.placarB}`}</span>
                    <span className="text-gray-800 font-semibold text-left w-2/5">{match.timeB}</span>
                </div>
            ))}
        </div>
    </div>
);

const KnockoutBracket = ({ chaveamento }) => {
    // Componente simplificado para o chaveamento
    const Match = ({ match }) => (
        <div className="flex flex-col space-y-1 w-48">
            <div className="bg-gray-100 border border-gray-200 text-gray-800 p-2 text-sm text-center rounded">{match.timeA}</div>
            <div className="bg-gray-100 border border-gray-200 text-gray-800 p-2 text-sm text-center rounded">{match.timeB}</div>
        </div>
    );
    return (
        <div className="mt-8 bg-white shadow-md rounded-lg p-4 flex justify-center overflow-x-auto">
            <div className="flex items-center space-x-8">
                {/* Oitavas */}
                <div className="flex flex-col space-y-8">
                    {chaveamento.map((match, i) => <Match key={i} match={match} />)}
                </div>
                {/* Quartas (placeholder) */}
                <div className="flex flex-col space-y-24 justify-around">
                    <div className="bg-gray-100 border border-gray-200 h-10 w-48 rounded"></div>
                    <div className="bg-gray-100 border border-gray-200 h-10 w-48 rounded"></div>
                </div>
                {/* Semi (placeholder) */}
                <div className="flex flex-col justify-center">
                     <div className="bg-gray-100 border border-gray-200 h-10 w-48 rounded"></div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function VerCampeonato() {
  const { campeonatoId } = useParams();
  const [campeonato, setCampeonato] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCampeonato = (id) => {
    setLoading(true);
    // TODO: Chamar API aqui com o ID
    console.log("Carregando dados para:", id);
    setTimeout(() => { // Simula delay da API
        const data = mockCampeonatos[id];
        setCampeonato({ ...data, ...mockCampeonatos.sharedData });
        setLoading(false);
    }, 300);
  }

  useEffect(() => {
    // Carrega a primeira view baseada na URL
    loadCampeonato(campeonatoId || 'suico-tabela');
  }, [campeonatoId]);

  if (loading || !campeonato) {
    return <div className="text-center p-10 text-gray-800">Carregando campeonato...</div>;
  }

  const renderContent = () => {
    if (campeonato.formato === 'suico') {
      return campeonato.view === 'tabela' 
        ? <SwissTable classificacao={campeonato.classificacao} />
        : <SwissMatches confrontos={campeonato.confrontos} />;
    }
    if (campeonato.formato === 'mata-mata') {
      // De acordo com as imagens, ambas as views de mata-mata mostram o chaveamento
      return <KnockoutBracket chaveamento={campeonato.chaveamento} />;
    }
    return null;
  }

  return (
    <div className="p-4 md:p-8 min-h-full">
        {/* Painel de Controle para teste */}
        <div className="bg-gray-200 p-2 rounded-lg mb-4 flex flex-wrap gap-2">
            <span className="font-bold self-center">Testar Views:</span>
            <button onClick={() => loadCampeonato('suico-tabela')} className="bg-blue-500 text-white px-2 py-1 text-xs rounded">Suíço - Tabela</button>
            <button onClick={() => loadCampeonato('suico-confrontos')} className="bg-blue-500 text-white px-2 py-1 text-xs rounded">Suíço - Confrontos</button>
            <button onClick={() => loadCampeonato('mata-mata-inicio')} className="bg-green-500 text-white px-2 py-1 text-xs rounded">Mata-Mata (Início)</button>
            <button onClick={() => loadCampeonato('mata-mata-chaveamento')} className="bg-green-500 text-white px-2 py-1 text-xs rounded">Mata-Mata (Chave)</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <header className="flex flex-col md:flex-row justify-between items-center text-gray-800">
                <div>
                    <h1 className="text-4xl font-bold">{campeonato.nome}</h1>
                    <p className="text-gray-600 mt-2">{campeonato.local}</p>
                    <p className="text-gray-600">Prêmio: <span className="font-bold text-gray-800">{campeonato.premioTotal}</span></p>
                </div>
                <div className="mt-6 md:mt-0">
                    <button disabled={campeonato.inscrito} className="bg-[#1f8c70] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#27ae8c] disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {campeonato.inscrito ? 'INSCRITO' : 'INSCREVA-SE'}
                    </button>
                </div>
            </header>

            <main className="mt-4">
                <AwardsTable premios={campeonato.premios} />
                <TeamsGrid times={campeonato.times} />
                {renderContent()}
            </main>
        </div>
    </div>
  );
}
