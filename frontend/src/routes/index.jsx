import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Auth/Login.jsx'
import Register from '../pages/Auth/Register.jsx'
import Layout from '../components/Layout.jsx'
import Home from '../pages/Home/Home.jsx'
import MeusCampeonatos from '../pages/Campeonatos/MeusCampeonatos.jsx'
import Inscritos from '../pages/Campeonatos/Inscritos.jsx'
import MeusTimes from '../pages/Times/MeusTimes.jsx'
import Jogadores from '../pages/Times/Jogadores.jsx'
import JogoEmAndamento from '../pages/Partida/JogoEmAndamento.jsx'
import VerCampeonato from '../pages/Campeonatos/VerCampeonato.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/Auth/login" element={<Login />} />
        <Route path="/Auth/register" element={<Register />} />
        
        {/* Main Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/meus-campeonatos" element={<MeusCampeonatos />} />
          <Route path="/campeonatos-inscritos" element={<Inscritos />} />
          <Route path="/campeonato/:campeonatoId" element={<VerCampeonato />} />
          <Route path="/meus-times" element={<MeusTimes />} />
          <Route path="/meus-times/jogadores" element={<Jogadores />} />
          <Route path="/partida/:partidaId" element={<JogoEmAndamento />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}