// src/pages/dashboard/ProximosAgendamentos.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SummaryCard from '../../components/ui/SummaryCard.js';

const fetchProximosAgendamentos = async () => {
    const response = await fetch('http://localhost:3000/api/dashboard/proximos-agendamentos');
    if (!response.ok) throw new Error('Falha ao buscar agendamentos');
    return response.json();
}

const ProximosAgendamentos = () => {
    const { data: agendamentos, isLoading, error } = useQuery({ 
        queryKey: ['proximosAgendamentos'], 
        queryFn: fetchProximosAgendamentos 
    });

    return (
        <SummaryCard title="Próximos Agendamentos" isLoading={isLoading} error={error}>
            {agendamentos && agendamentos.length > 0 ? (
                <ul className="space-y-3">
                    {agendamentos.map(pedido => (
                        <li key={pedido._id} className="text-sm p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                            <p className="font-semibold">{pedido.cliente.nome}</p>
                            <p className="text-gray-600">{new Date(pedido.dataAgendamento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Nenhum serviço agendado para os próximos dias.</p>
            )}
        </SummaryCard>
    );
}

export default ProximosAgendamentos;