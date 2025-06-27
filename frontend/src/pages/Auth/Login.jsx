import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  }); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', {
        email: formData.email,
        senha: formData.senha
      });

    
      const tokenRecebido = response.data.token;
      login(tokenRecebido);

      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[linear-gradient(to_top,_rgba(33,115,115,0.5)_23%,_rgba(83,145,77,0.5)_60%,_rgba(132,176,38,0.5)_100%)]  w-screen h-screen">
      <Card title="LOGIN">
        <form className="flex flex-col gap-4 text-[var(--preto)]" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            className="border-b border-black bg-transparent focus:outline-none"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Senha"
            className="border-b border-black bg-transparent focus:outline-none"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
          />

          <button className="bg-[var(--verde-claro)] text-white font-bold py-2 px-4 rounded-full self-end">
            LOGIN
          </button>

          <Link to="/Auth/Register" className="text-sm text-[var(--verde-claro)] hover:underline">
            Criar nova conta
          </Link>
        </form>
      </Card>
    </div>
  );
}

export default Login;
