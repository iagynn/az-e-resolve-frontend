// src/pages/ClientesPage.js

import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card.jsx";
import { Button } from '../components/ui/Button.jsx';


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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestão de Clientes</h1>
                <input type="text" placeholder="Buscar por nome ou telefone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-sm p-2 border rounded-md" />
            </div>
            
            {isSuccess && filteredClientes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredClientes.map((cliente) => (
                        <div key={cliente._id}>
                            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <CardTitle>{cliente.nome}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-2 text-sm">
                                     <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pedidos Totais:</span>
                                    <span className="font-semibold">{cliente.totalPedidos}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Valor Gasto:</span>
                                    <span className="font-bold text-primary">{formatCurrency(cliente.valorTotalGasto)}</span>
                                </div>
                                    {/* Adicionar mais dados aqui no futuro, como "Total Gasto" */}
                                </CardContent>
                                <CardFooter className="flex flex-col items-stretch space-y-2">
                                    <Button variant="outline" onClick={() => handleRowClick(cliente._id)}>
                                        {expandedClientId === cliente._id ? 'Ocultar Pedidos' : 'Ver Pedidos'}
                                    </Button>
                                    <Button size="sm" onClick={(e) => handleEnviarConvite(cliente._id, e)}>
                                        Convidar para o Portal
                                    </Button>
                                </CardFooter>
                            </Card>
                            {expandedClientId === cliente._id && (
                                <div className="mt-2">
                                    <ClientOrdersTable pedidos={clientDetails[cliente._id]} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-16">
                    <p>Nenhum cliente encontrado.</p>
                </div>
            )}
        </div>
    );
}

export default ClientesPage;