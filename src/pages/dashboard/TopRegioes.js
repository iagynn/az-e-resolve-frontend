// src/pages/dashboard/TopRegioes.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SummaryCard from '../../components/ui/SummaryCard.js';

const fetchTopRegioes = async () => {
    const response = await fetch('http://localhost:3000/api/dashboard/top-regioes');
    if (!response.ok) throw new Error('Falha ao buscar top regiões');
    return response.json();
}

const TopRegioes = () => {
    const { data: regioes, isLoading, error } = useQuery({ 
        queryKey: ['topRegioes'], 
        queryFn: fetchTopRegioes 
    });

    return (
        <SummaryCard title="Regiões Mais Populares" isLoading={isLoading} error={error}>
            {regioes && regioes.length > 0 ? (
                <ul className="space-y-3">
                    {regioes.map((item, index) => (
                        <li key={index} className="text-sm flex justify-between items-center p-2 rounded-md hover:bg-accent">
                            <div>
                                <span className="font-bold text-gray-500 mr-3">{index + 1}.</span>
                                <span className="font-semibold text-foreground">{item.regiao}</span>
                            </div>
                            <span className="font-bold text-primary">{item.pedidos}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground h-full flex items-center justify-center">Não há dados de região suficientes.</p>
            )}
        </SummaryCard>
    );
}

export default TopRegioes;