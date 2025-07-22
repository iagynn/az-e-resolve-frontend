// src/pages/FinanceiroPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { formatCurrency } from '../lib/utils.js';

// Ícone
const Trash2 = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg> );

// Componente StatCard
function StatCard({ title, value, isLoading }) {
  if (isLoading) return <div className="animate-pulse"><Card><CardHeader><CardTitle className="h-4 bg-gray-200 rounded w-3/4"></CardTitle></CardHeader><CardContent><div className="h-8 bg-gray-300 rounded w-1/2"></div></CardContent></Card></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </CardContent>
    </Card>
  );
}

function FinanceiroPage() {
    const [despesas, setDespesas] = useState([]);
    const [resumo, setResumo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('Outro');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [resumoRes, despesasRes] = await Promise.all([
                fetch('http://localhost:3000/api/stats/resumo-financeiro'),
                fetch('http://localhost:3000/api/despesas')
            ]);

            if (!resumoRes.ok || !despesasRes.ok) {
                throw new Error('Falha ao carregar dados financeiros.');
            }

            const resumoData = await resumoRes.json();
            const despesasData = await despesasRes.json();

            setResumo(resumoData);
            setDespesas(despesasData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddDespesa = async (e) => {
        e.preventDefault();
        if (!descricao || !valor || parseFloat(valor) <= 0) {
            toast.error('Por favor, preencha a descrição e um valor válido.');
            return;
        }
        setIsSubmitting(true);
        try {
            await fetch('http://localhost:3000/api/despesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao, valor: parseFloat(valor), categoria }),
            });
            toast.success('Despesa adicionada!');
            setDescricao(''); setValor(''); setCategoria('Outro');
            await fetchData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDespesa = async (id) => {
        if (!window.confirm('Tem certeza que deseja apagar esta despesa?')) return;
        try {
            await fetch(`http://localhost:3000/api/despesas/${id}`, { method: 'DELETE' });
            toast.success('Despesa removida!');
            await fetchData();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão Financeira (Mês Atual)</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Faturamento (Pago)" value={formatCurrency(resumo?.faturamentoPago)} isLoading={isLoading} />
                <StatCard title="Total de Despesas" value={formatCurrency(resumo?.totalDespesas)} isLoading={isLoading} />
                <div className={`p-6 rounded-lg shadow-md ${resumo?.lucroLiquido >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-sm font-medium text-gray-500">Lucro Líquido</p>
                    <p className={`text-3xl font-bold ${resumo?.lucroLiquido >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                        {isLoading ? '...' : formatCurrency(resumo?.lucroLiquido)}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Adicionar Nova Despesa</h2>
                <form onSubmit={handleAddDespesa} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="descricao" className="text-sm font-medium text-gray-600 mb-1">Descrição</label>
                        <input id="descricao" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Compra de Tecido" className="p-2 border rounded-lg" />
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
                    <button type="submit" disabled={isSubmitting} className="md:col-span-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'A adicionar...' : 'Adicionar Despesa'}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700">Histórico de Despesas do Mês</h2>
                {isLoading ? <p>A carregar despesas...</p> : error ? <p className="text-red-500">{error}</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold">Descrição</th>
                                    <th className="px-4 py-2 text-left font-semibold">Categoria</th>
                                    <th className="px-4 py-2 text-left font-semibold">Data</th>
                                    <th className="px-4 py-2 text-right font-semibold">Valor</th>
                                    <th className="px-4 py-2 text-center font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {despesas.map(despesa => (
                                    <tr key={despesa._id} className="border-t">
                                        <td className="px-4 py-2">{despesa.descricao}</td>
                                        <td className="px-4 py-2">{despesa.categoria}</td>
                                        <td className="px-4 py-2">{new Date(despesa.data).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-4 py-2 text-right text-red-600">{formatCurrency(despesa.valor)}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button onClick={() => handleDeleteDespesa(despesa._id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {despesas.length === 0 && <p className="text-center text-gray-500 py-4">Nenhuma despesa registada este mês.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FinanceiroPage;