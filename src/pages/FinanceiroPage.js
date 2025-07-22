// src/pages/FinanceiroPage.js

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { formatCurrency } from '../lib/utils.js';
import { Button } from '../components/ui/Button.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.js';

// --- Ícones (para manter o componente independente) ---
const Trash2 = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg> );

// --- Funções da API ---
const fetchFinanceiroData = async () => {
    const [resumoRes, despesasRes] = await Promise.all([
        fetch('http://localhost:3000/api/stats/resumo-financeiro'),
        fetch('http://localhost:3000/api/despesas')
    ]);
    if (!resumoRes.ok || !despesasRes.ok) {
        throw new Error('Falha ao carregar dados financeiros.');
    }
    const resumoData = await resumoRes.json();
    const despesasData = await despesasRes.json();
    return { resumo: resumoData, despesas: despesasData };
};

const addDespesa = async (novaDespesa) => {
    const response = await fetch('http://localhost:3000/api/despesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaDespesa),
    });
    if (!response.ok) throw new Error("Falha ao adicionar despesa.");
    return response.json();
};

const deleteDespesa = async (id) => {
    const response = await fetch(`http://localhost:3000/api/despesas/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error("Falha ao apagar despesa.");
    return response.json();
};

// --- Componente Principal ---
function FinanceiroPage() {
    const queryClient = useQueryClient();
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('Outro');
    const [confirmation, setConfirmation] = useState({ isOpen: false });

    const { data, isLoading, error } = useQuery({
        queryKey: ['financeiro'],
        queryFn: fetchFinanceiroData,
    });

    const addMutation = useMutation({
        mutationFn: addDespesa,
        onSuccess: () => {
            toast.success("Despesa adicionada!");
            queryClient.invalidateQueries({ queryKey: ['financeiro'] });
            setDescricao(''); setValor(''); setCategoria('Outro');
        },
        onError: (err) => toast.error(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDespesa,
        onSuccess: () => {
            toast.success("Despesa removida!");
            queryClient.invalidateQueries({ queryKey: ['financeiro'] });
        },
        onError: (err) => toast.error(err.message),
    });

    const handleAddDespesa = (e) => {
        e.preventDefault();
        if (!descricao || !valor || parseFloat(valor) <= 0) {
            return toast.error('Por favor, preencha a descrição e um valor válido.');
        }
        addMutation.mutate({ descricao, valor: parseFloat(valor), categoria });
    };

    const handleDeleteDespesa = (id) => {
        setConfirmation({
            isOpen: true,
            title: "Confirmar Exclusão",
            message: "Tem a certeza que deseja apagar esta despesa?",
            onConfirm: () => {
                deleteMutation.mutate(id);
                setConfirmation({ isOpen: false });
            }
        });
    };

    if (error) return <div className="p-4 text-center text-red-500">Erro: {error.message}</div>;

    return (
        <>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Gestão Financeira (Mês Atual)</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Faturamento (Pago)</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(data?.resumo?.faturamentoPago)}</p></CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total de Despesas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(data?.resumo?.totalDespesas)}</p></CardContent></Card>
                    <Card className={`${data?.resumo?.lucroLiquido >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Lucro Líquido</CardTitle></CardHeader>
                        <CardContent><p className={`text-2xl font-bold ${data?.resumo?.lucroLiquido >= 0 ? 'text-green-700' : 'text-red-700'}`}>{isLoading ? '...' : formatCurrency(data?.resumo?.lucroLiquido)}</p></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle>Adicionar Nova Despesa</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddDespesa} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="flex flex-col md:col-span-2">
                                <label htmlFor="descricao" className="text-sm font-medium text-gray-600 mb-1">Descrição</label>
                                <input id="descricao" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Compra de Ferramentas" className="p-2 border rounded-lg" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="valor" className="text-sm font-medium text-gray-600 mb-1">Valor (R$)</label>
                                <input id="valor" type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 150.50" className="p-2 border rounded-lg" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="categoria" className="text-sm font-medium text-gray-600 mb-1">Categoria</label>
                                <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="p-2 border rounded-lg bg-white h-[42px]">
                                    <option>Material</option>
                                    <option>Custo Fixo</option>
                                    <option>Imposto</option>
                                    <option>Marketing</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                            <Button type="submit" disabled={addMutation.isPending} className="md:col-span-4">
                                {addMutation.isPending ? 'A adicionar...' : 'Adicionar Despesa'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Histórico de Despesas do Mês</CardTitle></CardHeader>
                    <CardContent>
                        {isLoading ? <p className="text-center text-muted-foreground py-4">A carregar despesas...</p> : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold">Descrição</th>
                                            <th className="px-4 py-2 text-left font-semibold">Categoria</th>
                                            <th className="px-4 py-2 text-left font-semibold">Data</th>
                                            <th className="px-4 py-2 text-right font-semibold">Valor</th>
                                            <th className="px-4 py-2 text-center font-semibold">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.despesas.map(despesa => (
                                            <tr key={despesa._id} className="border-t">
                                                <td className="px-4 py-2">{despesa.descricao}</td>
                                                <td className="px-4 py-2">{despesa.categoria}</td>
                                                <td className="px-4 py-2">{new Date(despesa.data).toLocaleDateString('pt-BR')}</td>
                                                <td className="px-4 py-2 text-right text-destructive">{formatCurrency(despesa.valor)}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteDespesa(despesa._id)} disabled={deleteMutation.isPending}>
                                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {data?.despesas.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhuma despesa registada este mês.</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <ConfirmModal 
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={confirmation.onConfirm}
                onCancel={() => setConfirmation({ isOpen: false })}
                isSubmitting={deleteMutation.isPending}
            />
        </>
    );
}

export default FinanceiroPage;