import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ClienteDashboardPage = () => {
    const navigate = useNavigate();

    // Estados para guardar os pedidos, o estado de carregamento e erros
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Função para buscar os dados
        const fetchPedidos = async () => {
            // Pega o token do localStorage
            const token = localStorage.getItem('clienteToken');

            if (!token) {
                setError("Sessão inválida. Por favor, faça login novamente.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/portal-cliente/pedidos', {
                    headers: {
                        // Enviamos o token no cabeçalho para provar quem somos
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Não foi possível carregar os seus pedidos.');
                }

                const data = await response.json();
                setPedidos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPedidos();
    }, []); // O array vazio [] garante que isto só roda uma vez

    const handleLogout = () => {
        localStorage.removeItem('clienteToken');
        navigate('/cliente/login');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Painel do Cliente</h1>
                <button 
                    onClick={handleLogout} 
                    style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', background: '#6b7280', color: 'white', cursor: 'pointer' }}
                >
                    Sair
                </button>
            </div>
            <p>Bem-vindo ao seu portal de acompanhamento!</p>
            
            <div style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Meus Pedidos</h2>
                {isLoading && <p>A carregar os seus pedidos...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isLoading && !error && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pedidos.length > 0 ? (
                           pedidos.map(pedido => (
    <Link 
        key={pedido._id} 
        to={`/cliente/pedidos/${pedido._id}`}
        className="block p-4 bg-gray-100 rounded-lg border-l-4 border-blue-500 hover:bg-gray-200 transition-colors no-underline text-black"
    >
        <div className="flex justify-between items-center">
            <p style={{ fontWeight: 'bold' }}>Pedido #{pedido.shortId}</p>
            <span className="text-sm font-semibold bg-blue-200 text-blue-800 px-3 py-1 rounded-full">{pedido.status}</span>
        </div>
        <p className="mt-2 text-gray-600">{pedido.descricao.slice(0, 150)}...</p>
    </Link>
))
                        ) : (
                            <p>Você ainda não tem nenhum pedido registado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClienteDashboardPage;