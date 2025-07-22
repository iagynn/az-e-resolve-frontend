// src/components/PedidoModal/PedidoModal.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../lib/utils.js';

// --- Ícones ---
const X = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> );
const Trash2 = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg> );
const Link = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg> );
const History = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" /></svg> );
const ClipboardList = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg> );

// --- Subcomponentes ---

function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(children[0].props.label);
    return (
        <div>
            <div className="border-b border-gray-200"><nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">{children.map((child) => (<button key={child.props.label} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${activeTab === child.props.label ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab(child.props.label)}>{child.props.label}</button>))} </nav></div>
            <div className="pt-6">{children.map((child) => child.props.label === activeTab ? <div key={child.props.label}>{child.props.children}</div> : null)}</div>
        </div>
    );
}

function TabPane({ children }) {
    return <div>{children}</div>;
}

function ScheduleForm({ onSchedule, onCancel, isSubmitting }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || !time) { toast.error("Por favor, preencha a data e a hora."); return; }
        const dataISO = `${date}T${time}:00`;
        const dataObjeto = new Date(dataISO);
        onSchedule(dataObjeto);
    };
    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-700">Agendar Data e Hora</h4>
            <div className="flex items-center space-x-2 mt-2"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded-lg w-full" disabled={isSubmitting} /><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-2 border rounded-lg w-full" disabled={isSubmitting} /></div>
            <div className="flex justify-end space-x-2 mt-4"><button type="button" onClick={onCancel} className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300" disabled={isSubmitting}>Cancelar</button><button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={isSubmitting}>{isSubmitting ? "A agendar..." : "Salvar Agendamento"}</button></div>
        </form>
    );
}

// --- Componente Principal ---

export default function PedidoModal({ pedido, onClose, onUpdate, onAddPagamento, onRemovePagamento }) {
    // Todos os estados do componente
    const [notas, setNotas] = useState('');
    const [saveStatus, setSaveStatus] = useState('idle');
    const [valorProposto, setValorProposto] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [novoValor, setNovoValor] = useState('');
    const [novoMetodo, setNovoMetodo] = useState('Pix');
    const [novaObservacao, setNovaObservacao] = useState('');
    const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
    const [quantidadeUsada, setQuantidadeUsada] = useState(1);
    const [isAddingMaterial, setIsAddingMaterial] = useState(false);
    const [anotacoes, setAnotacoes] = useState('');
    const [lembreteNF, setLembreteNF] = useState('');
    const [custoDescricao, setCustoDescricao] = useState('');
    const [custoValor, setCustoValor] = useState('');

    useEffect(() => {
        if (pedido) {
            setValorProposto(pedido.valorProposto ? String(pedido.valorProposto) : '');
            setNotas(pedido.notasInternas || '');
            setIsScheduling(false);
            setSaveStatus('idle');
            setAnotacoes(pedido.anotacoesTecnicas || '');
            setLembreteNF(pedido.lembreteNotaFiscal || '');
            const fetchProdutos = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/produtos');
                    if (!response.ok) return;
                    const data = await response.json();
                    setProdutosDisponiveis(data);
                    if (data.length > 0) { setProdutoSelecionadoId(data[0]._id); }
                } catch (error) { console.error("Erro ao buscar produtos para o modal:", error); }
            };
            fetchProdutos();
        }
    }, [pedido]);

    // Todas as funções de manipulação de eventos
    const handleSaveNotas = async () => {
        setSaveStatus('saving');
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/notas`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notasInternas: notas }), });
            if (!response.ok) { throw new Error('Falha ao salvar as notas. Tente novamente.'); }
            toast.success('Notas salvas com sucesso!');
            setSaveStatus('saved');
            onUpdate();
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (err) {
            toast.error(err.message);
            setSaveStatus('idle');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Você tem certeza que deseja excluir este pedido? Esta ação é IRREVERSÍVEL.')) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao excluir o pedido no servidor.');
            toast.success('Pedido excluído com sucesso!');
            onUpdate();
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyPublicLink = async () => {
        const publicUrl = `${window.location.origin}/status/${pedido.publicId}`;
        try {
            await navigator.clipboard.writeText(publicUrl);
            toast.success('Link de acompanhamento copiado!');
        } catch (err) {
            console.error('Falha ao copiar o link: ', err);
            toast.error('Não foi possível copiar o link.');
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (newStatus === 'Finalizado' && !window.confirm('Tem a certeza que deseja finalizar este pedido?')) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }), });
            if (!response.ok) { throw new Error('Falha ao atualizar o status do pedido.'); }
            toast.success(`Pedido movido para "${newStatus}"!`);
            onUpdate();
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitOrcamento = async (e) => {
        e.preventDefault();
        if (!valorProposto || parseFloat(valorProposto) <= 0) { toast.error("Por favor, insira um valor de orçamento válido."); return; }
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/submit`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ valorProposto }), });
            if (!response.ok) { throw new Error("Falha ao enviar o orçamento."); }
            toast.success('Orçamento enviado com sucesso!');
            onUpdate();
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSchedule = async (newDate) => {
        setIsSubmitting(true);
        try {
            const dataParaEnviar = newDate instanceof Date ? newDate.toISOString() : newDate;
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/schedule`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dataAgendamento: dataParaEnviar }), });
            if (!response.ok) { throw new Error("Falha ao agendar o pedido."); }
            toast.success('Agendamento salvo com sucesso!');
            onUpdate();
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAdicionarMaterial = async (e) => {
        e.preventDefault();
        if (!produtoSelecionadoId || !quantidadeUsada || quantidadeUsada <= 0) { toast.error('Selecione um produto e uma quantidade válida.'); return; }
        setIsAddingMaterial(true);
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/materiais`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ produtoId: produtoSelecionadoId, quantidade: quantidadeUsada }), });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao adicionar material.');
            }
            toast.success('Material adicionado com sucesso!');
            onUpdate();
            setQuantidadeUsada(1);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsAddingMaterial(false);
        }
    };

    const handleSalvarDetalhesOperacionais = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/operacional`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ anotacoesTecnicas: anotacoes, lembreteNotaFiscal: lembreteNF }), });
            if (!response.ok) throw new Error('Falha ao salvar detalhes.');
            toast.success('Detalhes operacionais salvos!');
            onUpdate();
        } catch (err) {
            toast.error(err.message);
        }
    };
    
    const handleAdicionarCusto = async (e) => {
        e.preventDefault();
        if (!custoDescricao || !custoValor || parseFloat(custoValor) <= 0) { toast.error('Preencha a descrição e um valor válido para o custo.'); return; }
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/custos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ descricao: custoDescricao, valor: parseFloat(custoValor) }), });
            if (!response.ok) throw new Error('Falha ao adicionar custo.');
            toast.success('Custo adicionado!');
            setCustoDescricao('');
            setCustoValor('');
            onUpdate();
        } catch (err) {
            toast.error(err.message)
        }
    };

    const handleFotoSubmit = async (e) => {
        e.preventDefault();
        const file = e.target.foto.files[0];
        const descricao = e.target.descricao.value;
        if (!file) { toast.error('Por favor, selecione um ficheiro.'); return; }
        const formData = new FormData();
        formData.append('foto', file);
        formData.append('descricao', descricao);
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/upload-foto`, { method: 'POST', body: formData, });
            if (!response.ok) { throw new Error('Falha no upload da foto.'); }
            toast.success('Foto enviada com sucesso!');
            e.target.reset();
            onUpdate();
        } catch (err) {
            toast.error(err.message)
        }
    };

    const handleAddPagamentoSubmit = (e) => {
        e.preventDefault();
        onAddPagamento({ valor: novoValor, metodo: novoMetodo, observacao: novaObservacao });
        setNovoValor('');
        setNovoMetodo('Pix');
        setNovaObservacao('');
    };

    if (!pedido) return null;

    const podeExecutarAcoes = !['Finalizado', 'Rejeitado'].includes(pedido.status);
    const podeEnviarOrcamento = pedido.status === 'Pendente';
    const podeAgendar = ['Aceito', 'Agendado'].includes(pedido.status);
    const totalPago = pedido.pagamentos?.reduce((acc, p) => acc + p.valor, 0) || 0;
    const saldoDevedor = (pedido.valorProposto || 0) - totalPago;

    const StatusBanner = () => {
        if (pedido.status === 'Finalizado') return <div className="p-3 mb-6 bg-green-100 text-green-800 rounded-lg text-center">Este pedido foi finalizado.</div>;
        if (pedido.status === 'Rejeitado') return <div className="p-3 mb-6 bg-red-100 text-red-800 rounded-lg text-center">Este pedido foi rejeitado.</div>;
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Detalhes do Pedido #{pedido.shortId}</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleCopyPublicLink} disabled={isSubmitting} className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50" title="Copiar link de acompanhamento para o cliente"><Link className="h-5 w-5" /></button>
                        <button onClick={handleDelete} disabled={isSubmitting} className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 disabled:opacity-50" title="Excluir este pedido"><Trash2 className="h-5 w-5" /></button>
                        <button onClick={onClose} disabled={isSubmitting} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"><X className="h-6 w-6 text-gray-600" /></button>
                    </div>
                </header>

                <main className="flex-grow p-6 overflow-y-auto">
                    <StatusBanner />
                    <Tabs>
                        <TabPane label="Geral">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div><h3 className="font-semibold text-gray-700">Cliente</h3><p>{pedido.cliente?.nome || 'N/A'}</p><p className="text-sm text-gray-500">{pedido.cliente?.telefone}</p></div>
                                <div><h3 className="font-semibold text-gray-700">Endereço</h3><p>{pedido.address || 'N/A'}</p></div>
                                <div><h3 className="font-semibold text-gray-700">Data da Solicitação</h3><p>{new Date(pedido.data).toLocaleDateString('pt-BR')}</p></div>
                            </div>
                            <div className="mt-4"><h3 className="font-semibold text-gray-700">Descrição do Serviço</h3><p className="mt-1 text-gray-600 whitespace-pre-wrap">{pedido.descricao}</p></div>
                            {pedido.media && pedido.media.length > 0 && (
                                <div className="mt-6"><h3 className="font-semibold text-gray-700">Mídia Enviada</h3><div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">{pedido.media.map((m) => (<a key={m.sid || m.url} href={m.url} target="_blank" rel="noopener noreferrer"><img src={m.url} alt="Mídia do cliente" className="rounded-lg object-cover h-32 w-full" /></a>))}</div></div>
                            )}
                        </TabPane>

                        <TabPane label="Financeiro">
                            {podeEnviarOrcamento && (
                                <form onSubmit={handleSubmitOrcamento} className="pb-6 mb-6 border-b">
                                    <h3 className="text-lg font-semibold text-gray-800">Enviar Orçamento</h3>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <input type="number" step="0.01" placeholder="Ex: 350.50" value={valorProposto} onChange={(e) => setValorProposto(e.target.value)} className="flex-1 p-2 border rounded-lg" disabled={isSubmitting} />
                                        <button type="submit" disabled={isSubmitting || !valorProposto} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                            {isSubmitting ? "A enviar..." : "Enviar e Aceitar"}
                                        </button>
                                    </div>
                                </form>
                            )}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Controle de Pagamentos</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                <div><p className="text-sm text-gray-500">Valor Total</p><p className="text-xl font-bold text-blue-600">{formatCurrency(pedido.valorProposto)}</p></div>
                                <div><p className="text-sm text-gray-500">Total Pago</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalPago)}</p></div>
                                <div><p className="text-sm text-gray-500">Saldo Devedor</p><p className={`text-xl font-bold ${saldoDevedor > 0 ? 'text-red-600' : 'text-gray-700'}`}>{formatCurrency(saldoDevedor)}</p></div>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-2">Histórico de Pagamentos</h4>
                                {pedido.pagamentos && pedido.pagamentos.length > 0 ? (
                                    <ul className="space-y-2">{pedido.pagamentos.map(p => (<li key={p._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg text-sm"><div><span className="font-semibold">{formatCurrency(p.valor)}</span><span className="text-gray-600 mx-2">|</span><span>{p.metodo}</span><span className="block text-xs text-gray-500 italic">{p.observacao}</span></div><div className="flex items-center space-x-3"><span className="text-xs text-gray-400">{new Date(p.data).toLocaleDateString('pt-BR')}</span><button onClick={() => onRemovePagamento(p._id)} className="text-red-500 hover:text-red-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div></li>))}</ul>
                                ) : (<p className="text-sm text-gray-500 italic text-center p-4 bg-gray-50 rounded-lg">Nenhum pagamento registrado.</p>)}
                            </div>
                            {saldoDevedor > 0 && (
                                <form onSubmit={handleAddPagamentoSubmit} className="bg-blue-50 p-4 rounded-lg space-y-3">
                                    <h4 className="font-semibold text-gray-700">Adicionar Novo Pagamento</h4>
                                    <div className="flex flex-col md:flex-row gap-3"><input type="number" placeholder="Valor" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} className="flex-grow p-2 border rounded-lg" step="0.01" required /><select value={novoMetodo} onChange={(e) => setNovoMetodo(e.target.value)} className="p-2 border rounded-lg bg-white"><option>Pix</option><option>Dinheiro</option><option>Cartão de Crédito</option><option>Cartão de Débito</option><option>Transferência</option></select></div>
                                    <input type="text" placeholder="Observação (opcional)" value={novaObservacao} onChange={(e) => setNovaObservacao(e.target.value)} className="w-full p-2 border rounded-lg" />
                                    <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSubmitting ? 'Adicionando...' : 'Adicionar Pagamento'}</button>
                                </form>
                            )}
                        </TabPane>

                        <TabPane label="Operacional">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalhes Técnicos e Fiscais</h3>
                                    <div className="mb-4"><label className="block text-sm font-medium text-gray-600 mb-1">Anotações Técnicas (Medidas, etc.)</label><textarea value={anotacoes} onChange={(e) => setAnotacoes(e.target.value)} className="w-full h-24 p-2 border rounded-lg" placeholder="Ex: Parede 3.5m x 2.8m. Usar tinta acrílica."></textarea></div>
                                    <div className="mb-4"><label className="block text-sm font-medium text-gray-600 mb-1">Lembrete para Nota Fiscal</label><input type="text" value={lembreteNF} onChange={(e) => setLembreteNF(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ex: Emitir NF-e até dia 25." /></div>
                                    <button onClick={handleSalvarDetalhesOperacionais} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Salvar Detalhes</button>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Agendamento</h3>
                                    {podeAgendar && (
                                        <div> {pedido.sugestaoAgendamentoCliente && !isScheduling ? (<div><p className="p-3 bg-blue-100 text-blue-800 rounded-lg">O cliente sugeriu: <span className="font-bold">{new Date(pedido.sugestaoAgendamentoCliente).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span></p><div className="flex space-x-3 mt-2"><button onClick={() => handleSchedule(pedido.sugestaoAgendamentoCliente)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" disabled={isSubmitting}>Confirmar Sugestão</button><button onClick={() => setIsScheduling(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" disabled={isSubmitting}>Propor Outra Data</button></div></div>) : pedido.dataAgendamento && !isScheduling ? (<div><p>Serviço agendado para: <span className="font-medium">{new Date(pedido.dataAgendamento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span></p><button onClick={() => setIsScheduling(true)} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" disabled={isSubmitting}>Reagendar</button></div>) : (<div><p className="text-sm text-gray-600 mb-2">{isScheduling ? "Por favor, insira a nova data e hora." : "Cliente não sugeriu data. Agende um dia e horário."}</p><ScheduleForm onSchedule={handleSchedule} onCancel={() => setIsScheduling(false)} isSubmitting={isSubmitting} /></div>)}</div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Controle de Materiais e Custos</h3>
                                {pedido.materiaisUsados && pedido.materiaisUsados.length > 0 ? (<ul className="space-y-2 mb-4 pl-2">{pedido.materiaisUsados.map((item, index) => (<li key={index} className="text-sm text-gray-700 flex justify-between border-b pb-1"><span>{item.quantidade}x {item.produto?.nome || 'Produto Removido'}</span><span className="font-mono">{formatCurrency(item.custoNoMomento * item.quantidade)}</span></li>))}</ul>) : (<p className="text-sm text-gray-500 italic mb-4">Nenhum material do estoque adicionado a este pedido.</p>)}
                                <form onSubmit={handleAdicionarMaterial} className="bg-gray-100 p-3 rounded-lg flex items-end space-x-2 mb-6"><div className="flex-grow"><label className="text-xs font-medium text-gray-600">Adicionar Produto do Estoque</label><select value={produtoSelecionadoId} onChange={(e) => setProdutoSelecionadoId(e.target.value)} className="w-full p-2 border rounded-md bg-white">{produtosDisponiveis.length > 0 ? (produtosDisponiveis.map(p => (<option key={p._id} value={p._id}>{p.nome} ({p.quantidadeEmEstoque} disp.)</option>))) : (<option disabled>Nenhum produto em estoque</option>)}</select></div><div className="w-24"><label className="text-xs font-medium text-gray-600">Qtd.</label><input type="number" min="1" value={quantidadeUsada} onChange={(e) => setQuantidadeUsada(e.target.value)} className="w-full p-2 border rounded-md" /></div><button type="submit" disabled={isAddingMaterial} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 h-[42px] disabled:bg-blue-300">{isAddingMaterial ? '...' : 'Adicionar'}</button></form>
                                <ul className="space-y-2 mb-4">{pedido.custosMateriais && pedido.custosMateriais.map((custo, index) => (<li key={index} className="text-sm flex justify-between border-b pb-1"><span>{custo.descricao}</span><span className="font-mono text-red-600">{formatCurrency(custo.valor)}</span></li>))}</ul>
                                <form onSubmit={handleAdicionarCusto} className="bg-gray-100 p-3 rounded-lg space-y-2"><input type="text" value={custoDescricao} onChange={(e) => setCustoDescricao(e.target.value)} placeholder="Descrição do custo avulso" className="w-full p-2 border rounded-md" /><input type="number" step="0.01" value={custoValor} onChange={(e) => setCustoValor(e.target.value)} placeholder="Valor (R$)" className="w-full p-2 border rounded-md" /><button type="submit" className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">Adicionar Custo Avulso</button></form>
                            </div>
                        </TabPane>

                        <TabPane label="Documentos e Histórico">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3"><History className="h-5 w-5 mr-2" />Histórico do Pedido</h3>
                                    <ul className="space-y-3">{pedido.historico && pedido.historico.length > 0 ? (pedido.historico.slice(0).reverse().map((item, index) => (<li key={index} className="text-sm text-gray-600 border-l-2 pl-3 border-gray-200"><p className="font-medium text-gray-800">{item.evento}</p><p className="text-xs text-gray-400">{new Date(item.data).toLocaleString('pt-BR')}</p></li>))) : (<p className="text-sm text-gray-500 italic">Nenhum evento registrado.</p>)}</ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2"><ClipboardList className="h-5 w-5 mr-2" />Notas Internas</h3>
                                    <textarea className="w-full h-32 p-2 border rounded-lg" placeholder="Anote detalhes aqui..." value={notas} onChange={(e) => { setNotas(e.target.value); setSaveStatus('idle'); }} disabled={saveStatus === 'saving'}></textarea>
                                    <button onClick={handleSaveNotas} disabled={saveStatus !== 'idle'} className="mt-2 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{saveStatus === 'idle' ? 'Salvar Notas' : saveStatus === 'saving' ? 'Salvando...' : 'Salvo!'}</button>
                                </div>
                            </div>
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Fotos do Serviço</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <form onSubmit={handleFotoSubmit}>
                                        <div className="space-y-2"><input type="file" name="foto" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /><input type="text" name="descricao" placeholder="Descrição da foto (opcional)" className="w-full p-2 border rounded-md" /></div>
                                        <button type="submit" className="mt-2 w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">Enviar Foto</button>
                                    </form>
                                    <div className="grid grid-cols-3 gap-2">{pedido.fotosServico && pedido.fotosServico.map((foto, index) => (<div key={index}><a href={foto.url} target="_blank" rel="noopener noreferrer"><img src={foto.url} alt={foto.descricao} className="rounded-lg object-cover h-24 w-full" /></a><p className="text-xs text-center text-gray-500 mt-1 truncate">{foto.descricao}</p></div>))}</div>
                                </div>
                            </div>
                            {pedido.status === 'Finalizado' && (
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Documentos</h3>
                                    <a href={`http://localhost:3000/api/orcamentos/${pedido._id}/fatura-pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors no-underline"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Gerar Fatura (PDF)</a>
                                    {pedido.statusPagamento !== 'Pago' && (<p className="text-xs text-center text-yellow-700 mt-2 bg-yellow-100 p-2 rounded-md">Atenção: O pagamento ainda está como '{pedido.statusPagamento}'.</p>)}
                                </div>
                            )}
                        </TabPane>
                    </Tabs>
                </main>

                {podeExecutarAcoes && (
                    <footer className="p-4 bg-gray-100 border-t flex justify-end space-x-3">
                        <button onClick={() => handleUpdateStatus('Rejeitado')} disabled={isSubmitting} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Rejeitar Pedido</button>
                        <button onClick={() => handleUpdateStatus('Finalizado')} disabled={isSubmitting || !podeAgendar} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300">Marcar como Finalizado</button>
                    </footer>
                )}
            </div>
        </div>
    );
}