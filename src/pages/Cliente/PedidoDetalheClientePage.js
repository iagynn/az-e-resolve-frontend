// src/pages/Cliente/PedidoDetalheClientePage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const PedidoDetalheClientePage = () => {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate(); // Hook para navegação

    const fetchPedido = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('clienteToken');
        if (!token) {
            setError("Sessão inválida.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/portal-cliente/pedidos/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Não foi possível encontrar os detalhes deste pedido.');
            }
            const data = await response.json();
            setPedido(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPedido();
    }, [fetchPedido]);

    const handleDecision = async (action) => {
        if (!window.confirm(`Você tem certeza que deseja ${action} este orçamento?`)) {
            return;
        }

        const token = localStorage.getItem('clienteToken');
        try {
            const response = await fetch(`http://localhost:3000/api/portal-cliente/pedidos/${id}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Falha ao ${action} o pedido.`);
            }
            
            alert(`Orçamento foi ${action} com sucesso!`);
            fetchPedido(); // Recarrega os dados do pedido para mostrar o novo status
        } catch (err) {
            alert(err.message);
        }
    };
    const handleSugerirAgendamento = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    const dataSugerida = e.target.elements.dataSugerida.value;

    if (!dataSugerida) {
        alert('Por favor, selecione uma data e hora.');
        return;
    }

    const token = localStorage.getItem('clienteToken');
    try {
        const response = await fetch(`http://localhost:3000/api/portal-cliente/pedidos/${id}/sugerir-agendamento`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ dataSugerida: dataSugerida })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao enviar sugestão.');
        }
        
        alert('Sugestão de agendamento enviada com sucesso!');
        fetchPedido(); // Recarrega os dados do pedido para mostrar a sugestão na tela
    } catch (err) {
        alert(err.message);
    }
};

    if (loading) {
        return <div className="p-8 text-center">A carregar detalhes...</div>;
    }

    if (error || !pedido) {
        return <div className="p-8 text-center text-red-500">Erro: {error || "Pedido não encontrado."}</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <div className='flex justify-between items-center'>
                <Link to="/cliente/dashboard" className="text-blue-600 hover:underline">&larr; Voltar para Meus Pedidos</Link>
                <button onClick={() => { localStorage.removeItem('clienteToken'); navigate('/cliente/login'); }} className="text-sm text-gray-500 hover:underline">Sair</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Detalhes do Pedido #{pedido.shortId}</h1>
                        <p className="text-sm text-gray-500">Solicitado em: {new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className="text-lg font-semibold bg-blue-100 text-blue-800 px-4 py-1 rounded-full">{pedido.status}</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold text-gray-700">Descrição do Serviço:</h2>
                        <p className="text-gray-600 whitespace-pre-wrap">{pedido.descricao}</p>
                    </div>

                    {pedido.valorProposto > 0 && (
                         <div>
                            <h2 className="font-semibold text-gray-700">Valor do Orçamento:</h2>
                            <p className="text-xl font-bold text-green-700">{formatCurrency(pedido.valorProposto)}</p>
                        </div>
                    )}

                    {pedido.dataAgendamento && (
                        <div>
                            <h2 className="font-semibold text-gray-700">Data Agendada:</h2>
                            <p className="text-gray-600">{pedido.dataAgendamento}</p>
                        </div>
                    )}
                </div>
                
                {pedido.status === 'Pendente' && pedido.valorProposto > 0 && (
                    <div className="mt-6 pt-6 border-t">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Ações do Orçamento</h2>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => handleDecision('aprovar')}
                                className="flex-1 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                            >
                                Aprovar Orçamento
                            </button>
                            <button 
                                onClick={() => handleDecision('rejeitar')}
                                className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                            >
                                Rejeitar Orçamento
                            </button>
                        </div>
                        {pedido.status === 'Aceito' && (
    <div className="mt-6 pt-6 border-t">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Sugerir Data para o Serviço</h2>
        
        {pedido.sugestaoAgendamentoCliente ? (
            <p className="p-4 bg-green-100 text-green-800 rounded-lg">
                Sua sugestão de agendamento para **{pedido.sugestaoAgendamentoCliente}** foi enviada. Aguarde a confirmação do prestador.
            </p>
        ) : (
            <form onSubmit={handleSugerirAgendamento} className="flex items-end space-x-2">
                <input type="datetime-local" required className="flex-1 p-2 border rounded-lg" />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Enviar Sugestão
                </button>
            </form>
        )}
    </div>
)}
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default PedidoDetalheClientePage;