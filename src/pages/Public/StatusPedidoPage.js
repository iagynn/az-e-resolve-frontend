// src/pages/Public/StatusPedidoPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

function StatusPedidoPage() {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { publicId } = useParams();

    useEffect(() => {
        if (publicId) {
            const fetchPedido = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/public/pedido/${publicId}`);
                    if (!response.ok) {
                        throw new Error('Pedido não encontrado ou ocorreu um erro.');
                    }
                    const data = await response.json();
                    setPedido(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchPedido();
        } else {
            setError('ID do pedido não fornecido.');
            setLoading(false);
        }
    }, [publicId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl">A carregar detalhes do pedido...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Erro: {error}</p></div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">Faz & Resolve</h1>
                <p className="text-center text-gray-500 mb-6">Acompanhamento do Pedido</p>

                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-500">Pedido Nº</p>
                    <p className="text-2xl font-bold text-gray-800">#{pedido.shortId}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold text-gray-700">Descrição do Serviço:</h2>
                        <p className="text-gray-600">{pedido.descricao}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-700">Estado Atual:</h2>
                        <p className="text-lg font-bold text-blue-600 bg-blue-100 rounded-full px-4 py-1 inline-block">{pedido.status}</p>
                    </div>
                    {pedido.dataAgendamento && (
                        <div>
                            <h2 className="font-semibold text-gray-700">Data Agendada:</h2>
                            <p className="text-gray-600">{new Date(pedido.dataAgendamento).toLocaleString('pt-BR')}</p>
                        </div>
                    )}
                    {pedido.valorProposto > 0 && (
                        <div>
                            <h2 className="font-semibold text-gray-700">Valor do Orçamento:</h2>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(pedido.valorProposto)}</p>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-400 text-center mt-8">Consulta de {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
    );
}

export default StatusPedidoPage;