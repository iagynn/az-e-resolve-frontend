// src/pages/ClientesPage.js

import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'; // 1. IMPORTAR useQuery

// --- Funções Auxiliares (mantidas) ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

function ClientOrdersTable({ pedidos }) {
    // ... (componente mantido como está)
}


// --- Função de Busca de Dados ---
// 2. Criamos uma função async dedicada apenas a buscar os dados.
//    Isto pode ser movido para um ficheiro api/clientes.js no futuro.
const fetchClientes = async () => {
    const response = await fetch('http://localhost:3000/api/clientes');
    if (!response.ok) {
        throw new Error('A resposta da rede para buscar clientes não foi ok');
    }
    return response.json();
};


// --- Componente Principal da Página ---
function ClientesPage() {
    // 3. Substituímos 3 useStates por 1 useQuery
    const { data: clientes, isLoading, error } = useQuery({
        queryKey: ['clientes'], // Chave única para o cache desta busca
        queryFn: fetchClientes   // Função que será executada para buscar os dados
    });

    // Estados locais para a UI (filtros, etc.) são mantidos
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClientId, setExpandedClientId] = useState(null);
    const [clientDetails, setClientDetails] = useState({});

    // A lógica para buscar detalhes ao clicar na linha é mantida por enquanto
    const handleRowClick = async (clienteId) => {
        // ... (código mantido como está)
    };

    // O useMemo continua útil para a filtragem do lado do cliente
    const filteredClientes = useMemo(() => {
        if (!searchTerm) return clientes || []; // Garante que clientes não é undefined
        return clientes.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.telefone.includes(searchTerm));
    }, [searchTerm, clientes]);

    const handleEnviarConvite = async (clienteId, event) => {
        // ... (código mantido como está)
    };

    // 4. A renderização condicional fica muito mais limpa
    if (isLoading) {
        return <div className="p-4 text-center">A carregar clientes...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Erro: {error.message}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestão de Clientes</h1>
                <input type="text" placeholder="Buscar por nome ou telefone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3 p-2 border rounded-lg" />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        {/* ... (cabeçalho da tabela mantido) ... */}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredClientes.map((cliente) => (
                            <React.Fragment key={cliente._id}>
                                {/* ... (corpo da tabela mantido, usa filteredClientes) ... */}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClientesPage;