import React, { useState } from 'react';
// 1. IMPORTAMOS O HOOK 'useNavigate' DO ROUTER
import { useNavigate } from 'react-router-dom';

const ClienteLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. INICIALIZAMOS O HOOK PARA PODERMOS USÁ-LO
  const navigate = useNavigate();

  // 3. ATUALIZAMOS A FUNÇÃO DE SUBMISSÃO DO FORMULÁRIO
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Fazemos a chamada POST para a nossa API de login
      const response = await fetch('http://localhost:3000/api/portal-cliente/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
         cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a resposta não for 2xx, lançamos um erro com a mensagem do backend
        throw new Error(data.message || 'Ocorreu um erro.');
      }
      
      // SUCESSO!
      // Guardamos o token no localStorage para o mantermos "logado"
      localStorage.setItem('clienteToken', data.token);

      // Redirecionamos o cliente para o seu dashboard (que criaremos a seguir)
      navigate('/cliente/dashboard');

    } catch (err) {
      // Em caso de erro, atualizamos o estado de erro para exibir a mensagem
      setError(err.message || 'Email ou senha inválidos. Tente novamente.');
    } finally {
      // Independentemente de sucesso ou erro, paramos o loading
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{maxWidth: '400px', margin: '100px auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px'}}>
      <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>Portal do Cliente</h2>
      <p style={{textAlign: 'center', color: '#666', marginBottom: '2rem'}}>Acesse seus pedidos e acompanhe o andamento.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}>
          <label htmlFor="email" style={{display: 'block', marginBottom: '0.5rem'}}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
          />
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <label htmlFor="password" style={{display: 'block', marginBottom: '0.5rem'}}>Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
          />
        </div>

        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
        
        <button type="submit" disabled={isLoading} style={{width: '100%', padding: '0.75rem', border: 'none', borderRadius: '4px', background: '#3b82f6', color: 'white', cursor: 'pointer', fontSize: '1rem'}}>
          {isLoading ? 'Aguarde...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default ClienteLoginPage;