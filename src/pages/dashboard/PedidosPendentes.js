// src/pages/dashboard/PedidosPendentes.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SummaryCard from '../../components/ui/SummaryCard.js';
import { toast } from 'react-hot-toast';

const fetchPedidosPendentes = async () => {
    const response = await fetch('http://localhost:3000/api/dashboard/pedidos-pendentes');
    if (!response.ok) throw new Error('Falha ao buscar pedidos pendentes');
    return response.json();
}

const PedidosPendentes = ({ onPedidoClick }) => {
    const { data: pedidos, isLoading, error } = useQuery({ 
        queryKey: ['pedidosPendentes'], 
        queryFn: fetchPedidosPendentes 
    });

    return (
        <SummaryCard title="A Precisar de Atenção" isLoading={isLoading} error={error}>
            {pedidos && pedidos.length > 0 ? (
                <ul className="space-y-3">
                    {pedidos.map(pedido => (
                        <li
                            key={pedido._id}
                            onClick={() => onPedidoClick(pedido)}
                            className="text-sm p-3 rounded-lg border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition-colors"
                        >
                            <div className="flex justify-between">
                                <p className="font-semibold text-gray-800">{pedido.cliente?.nome || "Cliente não identificado"}</p>
                                <p className="text-xs text-gray-500">{new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <p className="text-gray-600 mt-1 truncate">{pedido.descricao}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 h-full flex items-center justify-center">Nenhum pedido pendente de orçamento.</p>
            )}
        </SummaryCard>
    );
}

export default PedidosPendentes;