import React, {useState} from 'react'
import Card from '../../components/Card'
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    email: '',
    senha: '',
    confirmaSenha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmaSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    let dataNascimentoTimestamp = null;
    if (formData.dataNascimento) {
      const date = new Date(formData.dataNascimento);
      dataNascimentoTimestamp = date.getTime();
    }

    try {
      await api.post('/create', {
        nome: formData.nome,
        dataNascimento: dataNascimentoTimestamp,
        email: formData.email,
        senha: formData.senha
      }, console.log(formData));
      


      alert('Cadastro realizado com sucesso!');
      navigate('/');
      setFormData({
        nome: '',
        dataNascimento: '',
        email: '',
        senha: '',
        confirmaSenha: ''
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[linear-gradient(to_top,_rgba(33,115,115,0.5)_23%,_rgba(83,145,77,0.5)_60%,_rgba(132,176,38,0.5)_100%)] w-screen">
      <Card title="Cadastro">
        <form className="flex flex-col gap-4 text-[var(--preto)]" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={handleChange}
            className="border-b border-black bg-transparent focus:outline-none"
          />
          <input
            type="date"
            name="dataNascimento"
            placeholder="Data de Nascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            className="border-b border-black bg-transparent focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="border-b border-black bg-transparent focus:outline-none"
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            className="border-b border-black bg-transparent focus:outline-none"
          />
          <input
            type="password"
            name="confirmaSenha"
            placeholder="Confirme a Senha"
            value={formData.confirmaSenha}
            onChange={handleChange}
            className="border-b border-black bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[var(--verde-claro)] text-white font-bold py-2 px-4 rounded-full self-end"
          >
            Registre-se
          </button>

          <Link to="/Auth/Login" className="text-sm text-[var(--verde-claro)] hover:underline">
            Já tem uma conta? Faça login.
          </Link>
        </form>
      </Card>
    </div>
  );
}

export default Register;