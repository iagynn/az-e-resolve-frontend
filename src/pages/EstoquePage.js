// src/pages/EstoquePage.js

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../lib/utils.js';

// Ícones
const Settings = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg> );
const Trash2 = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg> );
const X = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> );

function AjusteEstoqueModal({ produto, onClose, onSuccess }) {
    const [tipo, setTipo] = useState('Saída');
    const [quantidade, setQuantidade] = useState(1);
    const [motivo, setMotivo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (produto) {
            setTipo('Saída');
            setQuantidade(1);
            setMotivo('');
        }
    }, [produto]);

    if (!produto) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!quantidade || quantidade <= 0 || !motivo) {
            toast.error('Por favor, preencha a quantidade e o motivo do ajuste.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/produtos/${produto._id}/estoque`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipo, quantidade, motivo }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao ajustar estoque.');
            }

            toast.success('Estoque ajustado com sucesso!');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Ajustar Estoque: {produto.nome}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X className="h-6 w-6 text-gray-600" /></button>
                </header>
                <main className="p-6">
                    <p className="text-sm mb-4">Estoque Atual: <span className="font-bold">{produto.quantidadeEmEstoque} {produto.unidade}(s)</span></p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Tipo de Movimento</label>
                            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                                <option>Saída</option>
                                <option>Entrada</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Quantidade</label>
                            <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Motivo</label>
                            <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: Uso no pedido #123, Compra de material" className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {isSubmitting ? 'A salvar...' : 'Salvar Ajuste'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

function EstoquePage() {
    const [produtos, setProdutos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [produtoEmAjuste, setProdutoEmAjuste] = useState(null);
    const [formState, setFormState] = useState({
        nome: '', descricao: '', unidade: 'Unidade', quantidadeEmEstoque: 0, custoUnitario: 0, fornecedor: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProdutos = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/produtos');
            if (!response.ok) throw new Error('Falha ao carregar produtos.');
            const data = await response.json();
            setProdutos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProdutos();
    }, [fetchProdutos]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddProduto = async (e) => {
        e.preventDefault();
        if (!formState.nome) {
            toast.error('O nome do produto é obrigatório.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:3000/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao adicionar produto.');
            }
            toast.success('Produto adicionado!');
            setFormState({ nome: '', descricao: '', unidade: 'Unidade', quantidadeEmEstoque: 0, custoUnitario: 0, fornecedor: '' });
            fetchProdutos();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduto = async (id) => {
        if (!window.confirm('Tem certeza que deseja apagar este produto?')) return;
        try {
            await fetch(`http://localhost:3000/api/produtos/${id}`, { method: 'DELETE' });
            toast.success('Produto removido!');
            fetchProdutos();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão de Estoque</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Adicionar Novo Produto</h2>
                <form onSubmit={handleAddProduto} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="nome" value={formState.nome} onChange={handleFormChange} placeholder="Nome do Produto*" className="p-2 border rounded-lg md:col-span-2" />
                    <input name="fornecedor" value={formState.fornecedor} onChange={handleFormChange} placeholder="Fornecedor (Opcional)" className="p-2 border rounded-lg" />
                    <input name="descricao" value={formState.descricao} onChange={handleFormChange} placeholder="Descrição (Opcional)" className="p-2 border rounded-lg md:col-span-3" />
                    <select name="unidade" value={formState.unidade} onChange={handleFormChange} className="p-2 border rounded-lg bg-white h-[42px]">
                        <option>Unidade</option> <option>Metro</option> <option>Litro</option> <option>Kg</option> <option>Caixa</option>
                    </select>
                    <input name="quantidadeEmEstoque" type="number" value={formState.quantidadeEmEstoque} onChange={handleFormChange} placeholder="Qtd. Inicial" className="p-2 border rounded-lg" />
                    <input name="custoUnitario" type="number" step="0.01" value={formState.custoUnitario} onChange={handleFormChange} placeholder="Custo Unitário (R$)" className="p-2 border rounded-lg" />
                    <button type="submit" disabled={isSubmitting} className="md:col-span-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'A adicionar...' : 'Adicionar Produto'}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Itens em Estoque</h2>
                {isLoading ? <p>A carregar produtos...</p> : error ? <p className="text-red-500">{error}</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold">Produto</th>
                                    <th className="px-4 py-2 text-left font-semibold">Qtd. em Estoque</th>
                                    <th className="px-4 py-2 text-left font-semibold">Unidade</th>
                                    <th className="px-4 py-2 text-right font-semibold">Custo Unitário</th>
                                    <th className="px-4 py-2 text-center font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map(produto => (
                                    <tr key={produto._id} className="border-t">
                                        <td className="px-4 py-2 font-medium">{produto.nome}</td>
                                        <td className="px-4 py-2">{produto.quantidadeEmEstoque}</td>
                                        <td className="px-4 py-2">{produto.unidade}</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(produto.custoUnitario)}</td>
                                        <td className="px-4 py-2 text-center flex justify-center items-center space-x-2">
                                            <button
                                                onClick={() => setProdutoEmAjuste(produto)}
                                                className="text-blue-500 hover:text-blue-700"
                                                title="Ajustar Estoque"
                                            >
                                                <Settings className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduto(produto._id)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Apagar Produto"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {produtos.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum produto registado.</p>}
                    </div>
                )}
            </div>
            <AjusteEstoqueModal
                produto={produtoEmAjuste}
                onClose={() => setProdutoEmAjuste(null)}
                onSuccess={fetchProdutos}
            />
        </div>
    );
}

export default EstoquePage;