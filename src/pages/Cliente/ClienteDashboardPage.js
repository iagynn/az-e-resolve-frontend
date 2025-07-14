import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClienteDashboardPage = () => {
    const navigate = useNavigate();

    // Estados para guardar os pedidos, o estado de carregamento e erros
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
           // ==========================================================
    // ==> ADICIONE APENAS ESTA LINHA DE TESTE <==
    // ==========================================================
    alert('SE ESTA MENSAGEM APARECER, O USEEFFECT ESTÁ A FUNCIONAR!');
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
                                <div key={pedido._id} style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px', borderLeft: '5px solid #3b82f6' }}>
                                    <p style={{ fontWeight: 'bold' }}>Pedido #{pedido.shortId}</p>
                                    <p>{pedido.descricao}</p>
                                    <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Status: <span style={{ padding: '0.25rem 0.5rem', background: '#e0e7ff', color: '#3730a3', borderRadius: '99px', fontSize: '0.8rem' }}>{pedido.status}</span></p>
                                </div>
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