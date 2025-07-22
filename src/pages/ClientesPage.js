// src/pages/ClientesPage.js

import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

// --- Funções Auxiliares ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

// --- Subcomponentes ---
function ClientOrdersTable({ pedidos }) {
    if (!pedidos || pedidos.length === 0) {
        return <p className="text-sm text-gray-500 px-6 py-4">Este cliente ainda não tem pedidos.</p>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold">ID</th>
                        <th className="px-4 py-2 text-left font-semibold">Descrição</th>
                        <th className="px-4 py-2 text-left font-semibold">Status</th>
                        <th className="px-4 py-2 text-left font-semibold">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido._id} className="border-t">
                            <td className="px-4 py-2">#{pedido.shortId}</td>
                            <td className="px-4 py-2">{pedido.descricao.slice(0, 40)}...</td>
                            <td className="px-4 py-2">{pedido.status}</td>
                            <td className="px-4 py-2">{formatCurrency(pedido.valorProposto)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Função de API ---
const fetchClientes = async () => {
    const response = await fetch('http://localhost:3000/api/clientes');
    if (!response.ok) {
        throw new Error('Não foi possível buscar os clientes.');
    }
    return response.json();
};


// --- Componente Principal ---
function ClientesPage() {
    const { data: clientes, isLoading, error, isSuccess } = useQuery({
        queryKey: ['clientes'],
        queryFn: fetchClientes
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClientId, setExpandedClientId] = useState(null);
    const [clientDetails, setClientDetails] = useState({});

    const handleRowClick = async (clienteId) => {
        if (expandedClientId === clienteId) {
            setExpandedClientId(null);
            return;
        }
        if (!clientDetails[clienteId]) {
            try {
                const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}/details`);
                if (!response.ok) throw new Error('Falha ao buscar detalhes do cliente.');
                const data = await response.json();
                setClientDetails(prevDetails => ({ ...prevDetails, [clienteId]: data.pedidos }));
            } catch (err) {
                toast.error("Não foi possível carregar o histórico deste cliente.");
            }
        }
        setExpandedClientId(clienteId);
    };

    const filteredClientes = useMemo(() => {
        if (!searchTerm) return clientes || [];
        const lowercasedFilter = searchTerm.toLowerCase();
        return (clientes || []).filter(c =>
            (c.nome && c.nome.toLowerCase().includes(lowercasedFilter)) ||
            (c.telefone && c.telefone.includes(searchTerm))
        );
    }, [searchTerm, clientes]);

    const handleEnviarConvite = async (clienteId, event) => {
        event.stopPropagation();
        if (!window.confirm('Tem a certeza que deseja enviar um convite de acesso ao portal para este cliente?')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}/enviar-convite`, { method: 'POST' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao enviar o convite.');
            }
            toast.success('Convite enviado com sucesso!');
        } catch (err) {
            console.error("Erro ao enviar convite:", err);
            toast.error(err.message);
        }
    };

    if (isLoading) return <div className="p-4 text-center text-gray-500">A carregar clientes...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Erro ao buscar dados: {error.message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestão de Clientes</h1>
                <input type="text" placeholder="Buscar por nome ou telefone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3 p-2 border rounded-lg" />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total de Pedidos</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredClientes.map((cliente) => (
                            <React.Fragment key={cliente._id}>
                                <tr onClick={() => handleRowClick(cliente._id)} className="cursor-pointer hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">{cliente.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{cliente.telefone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">{cliente.totalPedidos}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button onClick={(event) => handleEnviarConvite(cliente._id, event)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm" title="Enviar convite para o portal">
                                            Convidar
                                        </button>
                                    </td>
                                </tr>
                                {expandedClientId === cliente._id && (
                                    <tr>
                                        <td colSpan="4" className="p-0 bg-gray-50">
                                            <ClientOrdersTable pedidos={clientDetails[cliente._id]} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {isSuccess && filteredClientes.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhum cliente encontrado.</p>
                )}
            </div>
        </div>
    );
}

export default ClientesPage;