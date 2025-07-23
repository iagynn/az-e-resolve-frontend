// src/pages/Cliente/ClienteLoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx'; // 1. Usar o nosso novo botão
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'; // 2. Usar o nosso novo cartão

const ClienteLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/portal-cliente/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro.');
      }
      
      localStorage.setItem('clienteToken', data.token);
      navigate('/cliente/dashboard');

    } catch (err) {
      setError(err.message || 'Email ou senha inválidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 3. Substituir o layout antigo por um novo, usando Tailwind
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Portal do Cliente</CardTitle>
          <CardDescription>Acesse seus pedidos e acompanhe o andamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>

            {error && <p className="text-sm text-center text-destructive">{error}</p>}
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Aguarde...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteLoginPage;