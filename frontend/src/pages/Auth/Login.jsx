import {} from 'react'
import Card from '../../components/Card'
import { Link } from 'react-router-dom';


function Login() {
  return (
  <div className="flex justify-center items-center h-screen bg-[linear-gradient(to_top,_rgba(33,115,115,0.5)_23%,_rgba(83,145,77,0.5)_60%,_rgba(132,176,38,0.5)_100%)]  w-screen h-screen">
      <Card title="LOGIN">
        <form className="flex flex-col gap-4 text-[var(--preto)]">
          <input
            type="email"
            placeholder="E-mail"
            className="border-b border-black bg-transparent focus:outline-none"
          />
          <input
            type="password"
            placeholder="Senha"
            className="border-b border-black bg-transparent focus:outline-none"
          />

          <Link to="#" className="text-sm text-[var(--preto)] hover:underline">
            Esqueci a senha
          </Link>

          <button className="bg-[var(--verde-claro)] text-white font-bold py-2 px-4 rounded-full self-end">
            LOGIN
          </button>

          <Link to="/Auth/Register" className="text-sm text-[var(--verde-claro)] hover:underline">
            Criar nova conta
          </Link>
        </form>
      </Card>
    </div>
  )
}

export default Login;