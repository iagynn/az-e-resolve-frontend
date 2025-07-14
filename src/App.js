
// ===============================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BrowserRouter, Routes, Route, NavLink as RouterNavLink, useParams } from 'react-router-dom';
import ClienteLoginPage from './pages/Cliente/ClienteLoginPage';
import ClienteDashboardPage from './pages/Cliente/ClienteDashboardPage';
import ClienteProtectedRoute from './components/ClienteProtectedRoute';
import PedidoDetalheClientePage from './pages/Cliente/PedidoDetalheClientePage';
import AtivarContaPage from './pages/Public/AtivarContaPage';
// ===============================================================
// ÍCONES SVG
// ===============================================================
const LayoutDashboard = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="3" y="15" rx="1" /><rect width="7" height="5" x="14" y="12" rx="1" /></svg> );
const List = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg> );
const Users = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> );
const Settings = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg> );
const Menu = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg> );
const X = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> );
const Trash2 = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg> );
const ClipboardList = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg> );
const History = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" /></svg> );
const DollarSign = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> );
const Link = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg> );
const Calendar = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg> );
const Wallet = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg> );
const Archive = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><line x1="10" x2="14" y1="9" y2="9" /></svg> );
// ===============================================================
// FUNÇÃO AUXILIAR
// ===============================================================
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

// ===============================================================
// COMPONENTES DO PAINEL
// ===============================================================

function StatCard({ title, value, isLoading }) {
  if (isLoading) return <div className="bg-white p-6 rounded-lg shadow-md animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div></div>;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

// ===============================================================
// === INÍCIO DAS MODIFICAÇÕES ====================================
// ===============================================================

// 1. NOVO COMPONENTE ADICIONADO AQUI
function RecentClientsCard({ clients, isLoading }) {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Clientes Recentes</h2>
            <div className="space-y-4">
                {clients && clients.length > 0 ? (
                    clients.map(client => (
                        <div key={client._id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                    {client.nome.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                    <p className="font-semibold text-gray-700">{client.nome}</p>
                                    <p className="text-sm text-gray-500">{client.telefone}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                Último Pedido: {new Date(client.ultimoPedido).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhum cliente recente encontrado.</p>
                )}
            </div>
        </div>
    );
}

// SUBSTITUA A SUA FUNÇÃO ANTIGA POR ESTA VERSÃO COMPLETA E CORRIGIDA
function DashboardPage() {
    // 1. ADICIONAMOS UM ESTADO PARA GUARDAR A MENSAGEM DE ERRO
    const [dashboardData, setDashboardData] = useState({ stats: {}, recentesClientes: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // <-- NOVO ESTADO DE ERRO

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null); // Limpa erros antigos a cada nova tentativa

            try {
                const response = await fetch('http://localhost:3000/api/dashboard', {
                    cache: 'no-store' // Força a busca por dados novos
                });

                // 2. ESTA É A LÓGICA DE CAPTURA DE ERRO QUE FALTAVA
                if (!response.ok) {
                    // Se a resposta não for 'OK' (ex: 500, 404), lemos como TEXTO
                    const errorText = await response.text(); 
                    // Guardamos o erro para ser exibido na tela
                    throw new Error(errorText || `Erro do servidor: ${response.status}`);
                }

                // Só tentamos ler como JSON se a resposta for 'OK'
                const data = await response.json();
                setDashboardData(data);

            } catch (err) {
                // Apanhamos o erro (seja da rede ou o que atiramos acima) e guardamos
                console.error("Erro ao buscar dados do dashboard:", err.message);
                setError(err.message); // Guarda a mensagem de erro para exibir na UI
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const { stats, recentesClientes } = dashboardData;

    // 3. SE HOUVER UM ERRO, MOSTRAMOS ELE EM VEZ DA PÁGINA NORMAL
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Ocorreu um erro no servidor!</strong>
                <span className="block sm:inline"> Não foi possível carregar os dados do dashboard.</span>
                <pre className="mt-4 p-2 bg-red-200 rounded text-xs" style={{ whiteSpace: 'pre-wrap' }}>
                    {/* Exibimos o erro real aqui */}
                    {error}
                </pre>
            </div>
        );
    }

    // O seu JSX original continua aqui
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Visão Geral do Negócio</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Novas Solicitações (Mês)" value={stats?.novasSolicitacoes || 0} isLoading={isLoading} />
                <StatCard title="Faturamento (Mês)" value={formatCurrency(stats?.faturamento)} isLoading={isLoading} />
                <StatCard title="Receitas Futuras" value={formatCurrency(stats?.receitasFuturas)} isLoading={isLoading} />
                <StatCard title="Satisfação Média" value={stats ? `${(stats.satisfacaoMedia || 0).toFixed(1)}/5` : 'N/A'} isLoading={isLoading} />
            </div>
            <GraficoFaturamento />
            <div className="mt-8">
                <RecentClientsCard clients={recentesClientes} isLoading={isLoading} />
            </div>
        </div>
    );
}
// Arquivo de Frontend (substitua estas duas funções)

function ScheduleForm({ onSchedule, onCancel, isSubmitting }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || !time) { alert("Por favor, preencha a data e a hora."); return; }
        onSchedule(`${date} às ${time}`);
    };
    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-700">Sugerir Nova Data</h4>
            <div className="flex items-center space-x-2 mt-2">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded-lg w-full" disabled={isSubmitting} />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-2 border rounded-lg w-full" disabled={isSubmitting} />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "A enviar..." : "Enviar Sugestão"}
                </button>
            </div>
        </form>
    );
}

function StatusPedidoPage() {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
     const { publicId } = useParams();

    useEffect(() => {
        // Pega o ID público da URL do navegador
        const pathParts = window.location.pathname.split('/');
        const publicId = pathParts[pathParts.length - 1];

        if (publicId) {
            const fetchPedido = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/public/pedido/${publicId}`);
                    if (!response.ok) {
                        throw new Error('Pedido não encontrado ou ocorreu um erro.');
                    }
                    const data = await response.json();
                    setPedido(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchPedido();
        } else {
            setError('ID do pedido não fornecido.');
            setLoading(false);
        }
    }, [publicId]);       

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl">A carregar detalhes do pedido...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Erro: {error}</p></div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">Faz & Resolve</h1>
                <p className="text-center text-gray-500 mb-6">Acompanhamento do Pedido</p>
                
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-500">Pedido Nº</p>
                    <p className="text-2xl font-bold text-gray-800">#{pedido.shortId}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold text-gray-700">Descrição do Serviço:</h2>
                        <p className="text-gray-600">{pedido.descricao}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-700">Estado Atual:</h2>
                        <p className="text-lg font-bold text-blue-600 bg-blue-100 rounded-full px-4 py-1 inline-block">{pedido.status}</p>
                    </div>
                    {pedido.dataAgendamento && (
                        <div>
                            <h2 className="font-semibold text-gray-700">Data Agendada:</h2>
                            <p className="text-gray-600">{pedido.dataAgendamento}</p>
                        </div>
                    )}
{pedido.valorProposto > 0 && (
    <div>
        <h2 className="font-semibold text-gray-700">Valor do Orçamento:</h2>
        <p className="text-lg font-bold text-green-600">{formatCurrency(pedido.valorProposto)}</p>
    </div>
)}
                </div>
                 <p className="text-xs text-gray-400 text-center mt-8">Consulta de {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
    );
}


function PedidoModal({ pedido, onClose, onUpdate }) {
    // =======================================================
    // ESTADOS (TODOS JUNTOS E CORRIGIDOS)
    // =======================================================
    const [notas, setNotas] = useState('');
    const [saveStatus, setSaveStatus] = useState('idle');
    const [valorProposto, setValorProposto] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingPagamento, setIsSubmittingPagamento] = useState(false);
// Adicione estes novos estados no topo da sua função PedidoModal
const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
const [quantidadeUsada, setQuantidadeUsada] = useState(1);
const [isAddingMaterial, setIsAddingMaterial] = useState(false);
const [anotacoes, setAnotacoes] = useState('');
const [lembreteNF, setLembreteNF] = useState('');
const [custoDescricao, setCustoDescricao] = useState('');
const [custoValor, setCustoValor] = useState('');
    
 // =================================================================
    // 1. O useMemo para calcular o lucro fica AQUI, no topo do componente.
    // =================================================================
    const lucroDoPedido = useMemo(() => {
        if (!pedido || !pedido.valorProposto) return 0;

        const totalCustos = pedido.custosMateriais?.reduce(
            (acc, custo) => acc + parseFloat(custo.valor.toString() || 0),
            0
        ) || 0;

        return parseFloat(pedido.valorProposto.toString()) - totalCustos;
    }, [pedido]);
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
                if (!response.ok) return; // Se falhar, não faz nada
                const data = await response.json();
                setProdutosDisponiveis(data);
                // Pré-seleciona o primeiro produto da lista, se houver
                if (data.length > 0) {
                    setProdutoSelecionadoId(data[0]._id);
                }
            } catch (error) {
                console.error("Erro ao buscar produtos para o modal:", error);
            }
        };
        
        
        fetchProdutos();
    }
}, [pedido]);

    if (!pedido) return null;

    const podeExecutarAcoes = !['Finalizado', 'Rejeitado'].includes(pedido.status);
    const podeEnviarOrcamento = pedido.status === 'Pendente';
    const podeAgendar = ['Aceito', 'Agendado'].includes(pedido.status);

    // =======================================================
    // FUNÇÕES DE LÓGICA (HANDLERS) - TODAS DEFINIDAS
    // =======================================================
    const handleSaveNotas = async () => {
        setSaveStatus('saving');
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/notas`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notasInternas: notas }),
            });
            if (!response.ok) throw new Error('Falha ao salvar notas.');
            setSaveStatus('saved');
            onUpdate();
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (err) {
            alert(err.message);
            setSaveStatus('idle');
        }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm('Você tem certeza que deseja excluir este pedido? Esta ação é IRREVERSÍVEL.');
        if (!isConfirmed) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao excluir o pedido no servidor.');
            alert('Pedido excluído com sucesso!');
            onUpdate();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleCopyPublicLink = () => {
    const publicUrl = `${window.location.origin}/status/${pedido.publicId}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
        alert('Link de acompanhamento copiado para a área de transferência!');
    }).catch(err => {
        console.error('Falha ao copiar o link: ', err);
        alert('Não foi possível copiar o link.');
    });

    };

    const handleUpdateStatus = async (newStatus) => {
        setIsSubmitting(true);
        try {
            await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            onUpdate();
            onClose();
        } catch (err) {
            alert("Falha ao atualizar o status do pedido.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitOrcamento = async (e) => {
        e.preventDefault();
        if (!valorProposto || parseFloat(valorProposto) <= 0) {
            alert("Por favor, insira um valor válido.");
            return;
        }
        setIsSubmitting(true);
        try {
            await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/submit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valorProposto }),
            });
            onUpdate();
            onClose();
        } catch (err) {
            alert("Falha ao enviar o orçamento.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSchedule = async (newDate) => {
        setIsSubmitting(true);
        try {
            await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/schedule`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataAgendamento: newDate }),
            });
            onUpdate();
            onClose();
        } catch (err) {
            alert("Falha ao agendar o pedido.");
        } finally {
            setIsSubmitting(false);
        }
        
    };
    const handleUpdatePagamento = async (novoStatus) => {
    if (novoStatus === pedido.statusPagamento) return;
    setIsSubmittingPagamento(true);
    try {
        const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/pagamento`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statusPagamento: novoStatus }),
        });
        if (!response.ok) throw new Error('Falha ao atualizar pagamento.');
        onUpdate(); // Para atualizar a UI com os novos dados
    } catch (err) {
        alert(err.message);
    } finally {
        setIsSubmittingPagamento(false);
    }
};
// Adicione esta nova função junto com as outras
const handleAdicionarMaterial = async (e) => {
    e.preventDefault();
    if (!produtoSelecionadoId || !quantidadeUsada || quantidadeUsada <= 0) {
        alert('Selecione um produto e uma quantidade válida.');
        return;
    }
    setIsAddingMaterial(true);
    try {
        const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/materiais`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ produtoId: produtoSelecionadoId, quantidade: quantidadeUsada }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao adicionar material.');
        }
        alert('Material adicionado com sucesso!');
        onUpdate(); // Força a atualização dos dados do pedido no painel principal
        setQuantidadeUsada(1); // Reseta a quantidade para a próxima adição
    } catch (err) {
        alert(err.message);
    } finally {
        setIsAddingMaterial(false);
    }
};
   const handleSalvarDetalhesOperacionais = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/operacional`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    anotacoesTecnicas: anotacoes,
                    lembreteNotaFiscal: lembreteNF 
                }),
            });
            if (!response.ok) throw new Error('Falha ao salvar detalhes.');
            alert('Detalhes operacionais salvos!');
            onUpdate(); // Atualiza a UI
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAdicionarCusto = async (e) => {
        e.preventDefault();
        if (!custoDescricao || !custoValor || parseFloat(custoValor) <= 0) {
            alert('Preencha a descrição e um valor válido para o custo.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedido._id}/custos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: custoDescricao, valor: parseFloat(custoValor) }),
            });
            if (!response.ok) throw new Error('Falha ao adicionar custo.');
            setCustoDescricao('');
            setCustoValor('');
            onUpdate(); // Atualiza a UI
        } catch (err) {
            alert(err.message);
        }
    };

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
    {/* Botão novo adicionado */}
    <button 
        onClick={handleCopyPublicLink} 
        disabled={isSubmitting} 
        className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50"
        title="Copiar link de acompanhamento para o cliente"
    >
        <Link className="h-5 w-5" />
    </button>

    {/* Botões antigos mantidos */}
    <button onClick={handleDelete} disabled={isSubmitting} className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 disabled:opacity-50" title="Excluir este pedido"><Trash2 className="h-5 w-5" /></button>
    <button onClick={onClose} disabled={isSubmitting} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"><X className="h-6 w-6 text-gray-600" /></button>
  </div>
</header>

                <div className="flex flex-grow overflow-hidden">
                    {/* Coluna Esquerda */}
                    <main className="w-2/3 p-6 overflow-y-auto border-r">
                        <StatusBanner />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div><h3 className="font-semibold text-gray-700">Cliente</h3><p>{pedido.cliente?.nome || 'N/A'}</p><p className="text-sm text-gray-500">{pedido.cliente?.telefone}</p></div>
                            <div><h3 className="font-semibold text-gray-700">Endereço</h3><p>{pedido.address || 'N/A'}</p></div>
                            <div className="mt-6 pt-6 border-t">
    <h3 className="font-semibold text-gray-700 mb-2">Status do Pagamento</h3>
    <div className="flex space-x-2">
        {['Pendente', 'Pago Parcial', 'Pago'].map(status => (
            <button 
                key={status}
                onClick={() => handleUpdatePagamento(status)}
                disabled={isSubmittingPagamento}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    (pedido.statusPagamento || 'Pendente') === status
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                {status}
            </button>
        ))}
    </div>
</div>
<div className="mt-6 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalhes Operacionais</h3>
                            
                            {/* Anotações Técnicas */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Anotações Técnicas (Medidas, etc.)</label>
                                <textarea 
                                    value={anotacoes} 
                                    onChange={(e) => setAnotacoes(e.target.value)}
                                    className="w-full h-24 p-2 border rounded-lg"
                                    placeholder="Ex: Parede 3.5m x 2.8m. Usar tinta acrílica."
                                ></textarea>
                            </div>

                            {/* Lembrete de Nota Fiscal */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Lembrete para Nota Fiscal</label>
                                <input 
                                    type="text"
                                    value={lembreteNF}
                                    onChange={(e) => setLembreteNF(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Ex: Emitir NF-e até dia 25."
                                />
                            </div>

                            <button 
                                onClick={handleSalvarDetalhesOperacionais}
                                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                            >
                                Salvar Anotações e Lembrete
                            </button>
                        </div>
                            <div><h3 className="font-semibold text-gray-700">Data da Solicitação</h3><p>{new Date(pedido.data).toLocaleDateString('pt-BR')}</p></div>
                            {pedido.valorProposto > 0 && <div><h3 className="font-semibold text-gray-700">Valor do Orçamento</h3><p className="text-lg font-bold text-green-600">{formatCurrency(pedido.valorProposto)}</p></div>}
                        </div>
                        <div className="mt-4"><h3 className="font-semibold text-gray-700">Descrição do Serviço</h3><p className="mt-1 text-gray-600 whitespace-pre-wrap">{pedido.descricao}</p></div>
                        {pedido.media && pedido.media.length > 0 && (
                            <div className="mt-6"><h3 className="font-semibold text-gray-700">Mídia Enviada</h3><div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">{pedido.media.map((m) => (<a key={m.sid || m.url} href={m.url} target="_blank" rel="noopener noreferrer"><img src={m.url} alt="Mídia do cliente" className="rounded-lg object-cover h-32 w-full" /></a>))}</div></div>
                        )}
                        <div className="mt-6 border-t pt-6">
    <h3 className="font-semibold text-gray-700 mb-3">Materiais Utilizados</h3>
    
    {/* Lista de materiais que já foram usados neste pedido */}
    {pedido.materiaisUsados && pedido.materiaisUsados.length > 0 ? (
        <ul className="space-y-2 mb-4 pl-2">
            {pedido.materiaisUsados.map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex justify-between border-b pb-1">
                    <span>{item.quantidade}x {item.produto?.nome || 'Produto Removido'}</span>
                    <span className="font-mono">{formatCurrency(item.custoNoMomento * item.quantidade)}</span>
                </li>
            ))}
        </ul>
    ) : (
        <p className="text-sm text-gray-500 italic mb-4">Nenhum material adicionado a este pedido.</p>
    )}

    {/* Formulário para adicionar novo material ao pedido */}
    <form onSubmit={handleAdicionarMaterial} className="bg-gray-100 p-3 rounded-lg flex items-end space-x-2">
        <div className="flex-grow">
            <label className="text-xs font-medium text-gray-600">Adicionar Produto</label>
            <select value={produtoSelecionadoId} onChange={(e) => setProdutoSelecionadoId(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                {produtosDisponiveis.length > 0 ? (
                    produtosDisponiveis.map(p => (
                        <option key={p._id} value={p._id}>
                            {p.nome} ({p.quantidadeEmEstoque} disp.)
                        </option>
                    ))
                ) : (
                    <option disabled>Nenhum produto em estoque</option>
                )}
            </select>
        </div>
        <div className="w-24">
             <label className="text-xs font-medium text-gray-600">Qtd.</label>
             <input type="number" min="1" value={quantidadeUsada} onChange={(e) => setQuantidadeUsada(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>
        <button type="submit" disabled={isAddingMaterial} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 h-[42px] disabled:bg-blue-300">
            {isAddingMaterial ? '...' : 'Adicionar'}
        </button>
    </form>
</div>
{podeAgendar && (
    <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold text-gray-700 mb-2">Agendamento</h3>
        
        {
        pedido.dataAgendamento && !isScheduling ? (
            <div>
                <p className="mt-1">Sugestão do cliente: <span className="font-medium">{pedido.dataAgendamento}</span></p>
                <div className="flex space-x-3 mt-2">
                    
                    {/* ===== O BOTÃO QUE FALTAVA ESTÁ AQUI ===== */}
                    <button 
                        onClick={() => handleSchedule(pedido.dataAgendamento)} 
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        disabled={isSubmitting}
                    >
                        Confirmar Sugestão
                    </button>

                    <button 
                        onClick={() => setIsScheduling(true)} 
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        disabled={isSubmitting}
                    >
                        Reagendar
                    </button>
                </div>
            </div>
        ) : (
        // Caso 2: Se você está reagendando OU se o cliente não sugeriu uma data inicial
            <div>
                {isScheduling && pedido.dataAgendamento && <p className="text-sm text-gray-600 mb-2">Por favor, insira a nova data e hora.</p>}
                {!pedido.dataAgendamento && <p className="text-sm text-gray-600 mb-2">Cliente não sugeriu data. Agende um dia e horário.</p>}
                <ScheduleForm 
                    onSchedule={handleSchedule} 
                    onCancel={() => setIsScheduling(false)} 
                    isSubmitting={isSubmitting} 
                />
            </div>
        )}
    </div>
)}
                        {podeEnviarOrcamento && (
                            <form onSubmit={handleSubmitOrcamento} className="mt-6 border-t pt-6">
                                <h3 className="font-semibold text-gray-700">Enviar Orçamento</h3>
                                <div className="flex items-center space-x-4 mt-2">
                                    <input type="number" step="0.01" placeholder="Ex: 350.50" value={valorProposto} onChange={(e) => setValorProposto(e.target.value)} className="flex-1 p-2 border rounded-lg" disabled={isSubmitting} />
                                    <button type="submit" disabled={isSubmitting || !valorProposto} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                        {isSubmitting ? "A enviar..." : "Enviar e Aceitar"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </main>

                    {/* Coluna Direita */}
                    <aside className="w-1/3 p-6 bg-gray-50 overflow-y-auto">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2"><ClipboardList className="h-5 w-5 mr-2" />Notas Internas</h3>
                            <textarea className="w-full h-32 p-2 border rounded-lg" placeholder="Anote detalhes aqui..." value={notas} onChange={(e) => { setNotas(e.target.value); setSaveStatus('idle'); }} disabled={saveStatus === 'saving'}></textarea>
                            <button onClick={handleSaveNotas} disabled={saveStatus !== 'idle'} className="mt-2 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {saveStatus === 'idle' && 'Salvar Notas'}
                                {saveStatus === 'saving' && 'Salvando...'}
                                {saveStatus === 'saved' && 'Salvo!'}
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3"><History className="h-5 w-5 mr-2" />Histórico</h3>
                            <ul className="space-y-3">
                                {pedido.historico && pedido.historico.length > 0 ? (
                                    pedido.historico.slice(0).reverse().map((item, index) => (
                                        <li key={index} className="text-sm text-gray-600 border-l-2 pl-3 border-gray-200">
                                            <p className="font-medium text-gray-800">{item.evento}</p>
                                            <p className="text-xs text-gray-400">{new Date(item.data).toLocaleString('pt-BR')}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Nenhum evento registrado.</p>
                                )}
                            </ul>
                        </div>
                         {/* ======================================================= */}
                        {/* ==> NOVA SECÇÃO DE CUSTOS ADICIONADA AQUI <== */}
                        {/* ======================================================= */}
                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Custos com Materiais</h3>
                            
                            {/* Lista de custos já adicionados */}
                            <ul className="space-y-2 mb-4">
                                {pedido.custosMateriais && pedido.custosMateriais.map((custo, index) => (
                                    <li key={index} className="text-sm flex justify-between border-b pb-1">
                                        <span>{custo.descricao}</span>
                                        <span className="font-mono text-red-600">{formatCurrency(custo.valor)}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Formulário para adicionar novo custo */}
                            <form onSubmit={handleAdicionarCusto} className="bg-gray-100 p-3 rounded-lg space-y-2">
                                <input 
                                    type="text" 
                                    value={custoDescricao} 
                                    onChange={(e) => setCustoDescricao(e.target.value)}
                                    placeholder="Descrição do material" 
                                    className="w-full p-2 border rounded-md" 
                                />
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    value={custoValor} 
                                    onChange={(e) => setCustoValor(e.target.value)}
                                    placeholder="Valor (R$)" 
                                    className="w-full p-2 border rounded-md" 
                                />
                                <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                                    Adicionar Custo
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>

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

function ClientOrdersTable({ pedidos }) {
    if (!pedidos || pedidos.length === 0) return <p className="text-sm text-gray-500 px-6 py-4">Este cliente ainda não tem pedidos.</p>;
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

const statusOrdem = ['Pendente', 'Aceito', 'Agendado', 'Finalizado', 'Rejeitado'];
// SUBSTITUA TODA A SUA FUNÇÃO PedidosPage por esta:

function PedidosPage({ onPedidoClick }) { 
    const [colunas, setColunas] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const fetchAllPedidos = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/orcamentos');
            if (!response.ok) throw new Error('A resposta da rede não foi ok');
            const data = await response.json();
            const pedidosPorStatus = statusOrdem.reduce((acc, status) => {
                acc[status] = data.filter(p => p.status === status);
                return acc;
            }, {});
            setColunas(pedidosPorStatus);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchAllPedidos(); }, [fetchAllPedidos]);

    const filteredColunas = useMemo(() => {
        if (!searchTerm) return colunas;
        const lowercasedFilter = searchTerm.toLowerCase();
        const newColunas = {};
        for (const status in colunas) {
            newColunas[status] = colunas[status].filter(pedido => {
                const clientName = pedido.cliente?.nome?.toLowerCase() || '';
                const clientPhone = pedido.cliente?.telefone || '';
                return clientName.includes(lowercasedFilter) || clientPhone.slice(-4).includes(searchTerm);
            });
        }
        return newColunas;
    }, [searchTerm, colunas]);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;
        
        const startColumn = colunas[source.droppableId];
        const movedPedido = startColumn.find(p => p._id === draggableId);
        
        const newColunas = { ...colunas };
        newColunas[source.droppableId].splice(source.index, 1);
        newColunas[destination.droppableId].splice(destination.index, 0, movedPedido);
        setColunas(newColunas);
        
        try {
            await fetch(`http://localhost:3000/api/orcamentos/${draggableId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: destination.droppableId }),
            });
        } catch (err) {
            alert("Não foi possível atualizar o pedido. A página será recarregada.");
            fetchAllPedidos();
        }
    };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestão de Pedidos</h1>
            <input type="text" placeholder="Buscar por nome ou telefone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3 p-2 border rounded-lg" />
        </div>
        {isLoading && <p className="text-center text-gray-500">A carregar...</p>}
        {error && <p className="text-center text-red-500">Erro: {error}</p>}
        {!isLoading && !error && (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {statusOrdem.map((colunaId) => (
                        <Droppable key={colunaId} droppableId={colunaId}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
                                    <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">{colunaId}<span className="ml-2 bg-gray-300 text-gray-600 text-sm font-semibold px-2 py-1 rounded-full">{filteredColunas[colunaId]?.length || 0}</span></h2>
                                    <div className="space-y-4 h-full">
                                        {(filteredColunas[colunaId] || []).map((pedido, index) => (
                                            <Draggable key={pedido._id} draggableId={pedido._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => onPedidoClick(pedido)}
                                                        className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg relative"
                                                    >
                                                        <div className="absolute top-2 right-2" title={`Pagamento: ${pedido.statusPagamento || 'Pendente'}`}>
                                                            <DollarSign className={`h-4 w-4 ${
                                                                pedido.statusPagamento === 'Pago' ? 'text-green-500' :
                                                                pedido.statusPagamento === 'Pago Parcial' ? 'text-blue-500' :
                                                                'text-yellow-500'
                                                            }`} />
                                                        </div>
                                                        <p className="font-bold text-gray-800">Pedido #{pedido.shortId}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{pedido.cliente?.nome || 'Cliente não identificado'}</p>
                                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{pedido.descricao}</p>
                                                        {pedido.valorProposto > 0 && (
                                                            <div className="mt-3 pt-2 border-t flex justify-end">
                                                                <span className={`text-sm font-bold ${pedido.lucro >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                                    Lucro: {formatCurrency(pedido.lucro)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        )}
    </div>
);
}
function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClientId, setExpandedClientId] = useState(null);
    const [clientDetails, setClientDetails] = useState({});
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/clientes');
                if (!response.ok) throw new Error('A resposta da rede não foi ok');
                const data = await response.json();
                setClientes(data);
            } catch (err) { setError(err.message); } 
            finally { setIsLoading(false); }
        };
        fetchClientes();
    }, []);
    const handleRowClick = async (clienteId) => {
        if (expandedClientId === clienteId) { setExpandedClientId(null); return; }
        if (!clientDetails[clienteId]) {
            try {
                const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}/details`);
                if (!response.ok) throw new Error('Falha ao buscar detalhes do cliente.');
                const data = await response.json();
                setClientDetails(prevDetails => ({ ...prevDetails, [clienteId]: data.pedidos }));
            } catch (err) { alert("Não foi possível carregar o histórico deste cliente."); }
        }
        setExpandedClientId(clienteId);
    };
    const filteredClientes = useMemo(() => {
        if (!searchTerm) return clientes;
        return clientes.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.telefone.includes(searchTerm));
    }, [searchTerm, clientes]
);
 const handleEnviarConvite = async (clienteId) => {
        // O event.stopPropagation() evita que o clique no botão
        // também acione o clique na linha da tabela (que abre os detalhes).
        window.event.stopPropagation(); 
        
        if (!window.confirm('Tem a certeza que deseja enviar um convite de acesso ao portal para este cliente?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}/enviar-convite`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao enviar o convite.');
            }
            
            alert('Convite enviado com sucesso!');
        } catch (err) {
            console.error("Erro ao enviar convite:", err);
            alert(err.message);
        }
    };
   return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestão de Clientes</h1>
                <input type="text" placeholder="Buscar por nome ou telefone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3 p-2 border rounded-lg" />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {!isLoading && !error && (
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total de Pedidos</th>
                                {/* ==> 2. ADICIONAMOS A NOVA COLUNA NO CABEÇALHO <== */}
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
                                        {/* ==> 3. ADICIONAMOS A CÉLULA COM O BOTÃO <== */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button 
                                                onClick={(event) => handleEnviarConvite(cliente._id, event)}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                                title="Enviar convite para o portal"
                                            >
                                                Convidar
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedClientId === cliente._id && (
                                        <tr>
                                            {/* Corrigido o colSpan para 4 para alinhar com a nova coluna */}
                                            <td colSpan="4" className="p-0 bg-gray-50">
                                                <ClientOrdersTable pedidos={clientDetails[cliente._id]} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
function GraficoFaturamento() {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDadosGrafico = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/stats/faturamento-mensal');
                if (!response.ok) {
                    throw new Error('Não foi possível carregar os dados do gráfico.');
                }
                const data = await response.json();
                
                // Formata o nome do mês para exibição
                const dadosFormatados = data.map(item => {
                    const [ano, mes] = item.mes.split('-');
                    const nomeMes = new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long' });
                    return {
                        ...item,
                        // Deixa o nome do mês com a primeira letra maiúscula
                        mes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)
                    };
                });

                setDados(dadosFormatados);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDadosGrafico();
    }, []);

    if (loading) {
        return <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-center">A carregar dados do gráfico...</div>;
    }

    if (error) {
        return <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Faturamento Mensal (Últimos 6 Meses)</h2>
            {/* O ResponsiveContainer faz o gráfico se adaptar ao tamanho do card */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dados} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `R$${value}`} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                    <Legend />
                    <Bar dataKey="faturamento" fill="#3b82f6" name="Faturamento" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
function AgendaPage() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/orcamentos/agendados');
                const data = await response.json();
                setEventos(data);
            } catch (error) {
                console.error("Erro ao buscar eventos do calendário:", error);
                alert("Não foi possível carregar os agendamentos.");
            } finally {
                setLoading(false);
            }
        };
        fetchEventos();
    }, []);

    if (loading) {
        return <div className="p-6 text-center">A carregar agenda...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Agenda de Serviços</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={eventos}
                    locale="pt-br"
                    buttonText={{
                        today: 'Hoje',
                        month: 'Mês',
                        week: 'Semana',
                        day: 'Dia'
                    }}
                    height="auto"
                />
            </div>
        </div>
    );
}
// Adicione este novo componente completo ao seu arquivo

// Substitua toda a sua função FinanceiroPage por esta versão completa:

function FinanceiroPage() {
    // --- ESTADOS ---
    // Mantemos o estado para a lista de despesas
    const [despesas, setDespesas] = useState([]);
    // ADICIONAMOS um novo estado para os dados de resumo (cards)
    const [resumo, setResumo] = useState(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para o formulário (sem alteração)
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('Outro');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LÓGICA DE DADOS ---
    // Modificamos a função para buscar OS DOIS conjuntos de dados
    const fetchData = useCallback(async () => {
        // Não resetamos o loading principal aqui para a tela não piscar ao adicionar/deletar
        try {
            // Usamos Promise.all para buscar os dados do resumo e das despesas em paralelo
            const [resumoRes, despesasRes] = await Promise.all([
                fetch('http://localhost:3000/api/stats/resumo-financeiro'),
                fetch('http://localhost:3000/api/despesas')
            ]);

            if (!resumoRes.ok || !despesasRes.ok) {
                throw new Error('Falha ao carregar dados financeiros.');
            }

            const resumoData = await resumoRes.json();
            const despesasData = await despesasRes.json();
            
            // Atualizamos os dois estados com os novos dados
            setResumo(resumoData);
            setDespesas(despesasData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false); // Desativa o loading principal apenas no final
        }
    }, []);

    // Busca os dados quando o componente é montado (sem alteração)
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Função para adicionar despesa (agora chama fetchData para atualizar tudo)
    const handleAddDespesa = async (e) => {
        e.preventDefault();
        if (!descricao || !valor || parseFloat(valor) <= 0) {
            alert('Por favor, preencha a descrição e um valor válido.');
            return;
        }
        setIsSubmitting(true);
        try {
            await fetch('http://localhost:3000/api/despesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao, valor: parseFloat(valor), categoria }),
            });
            setDescricao(''); setValor(''); setCategoria('Outro');
            await fetchData(); // Recarrega TODOS os dados da página
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Função para deletar despesa (agora chama fetchData para atualizar tudo)
    const handleDeleteDespesa = async (id) => {
        if (!window.confirm('Tem certeza que deseja apagar esta despesa?')) return;
        try {
            await fetch(`http://localhost:3000/api/despesas/${id}`, { method: 'DELETE' });
            await fetchData(); // Recarrega TODOS os dados da página
        } catch (err) {
            alert(err.message);
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão Financeira (Mês Atual)</h1>

            {/* === CARDS DE RESUMO ADICIONADOS AQUI === */}
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

            {/* O resto do seu componente (Formulário e Tabela) continua igual ao que você já tinha */}
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
// Substitua toda a sua função App por esta versão


// Adicione este novo componente completo ao seu arquivo

function EstoquePage() {
    // Estados para a lista de produtos, carregamento e erros
    const [produtos, setProdutos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [produtoEmAjuste, setProdutoEmAjuste] = useState(null);

    // Estados para o formulário de novo produto
    const [formState, setFormState] = useState({
        nome: '',
        descricao: '',
        unidade: 'Unidade',
        quantidadeEmEstoque: 0,
        custoUnitario: 0,
        fornecedor: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Função para buscar todos os produtos da API
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

    // Busca os produtos quando o componente é montado
    useEffect(() => {
        fetchProdutos();
    }, [fetchProdutos]);
    
    // Handler para mudar os campos do formulário
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    // Função para adicionar um novo produto
    const handleAddProduto = async (e) => {
        e.preventDefault();
        if (!formState.nome) {
            alert('O nome do produto é obrigatório.');
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
            
            // Limpa o formulário e recarrega a lista
            setFormState({ nome: '', descricao: '', unidade: 'Unidade', quantidadeEmEstoque: 0, custoUnitario: 0, fornecedor: '' });
            fetchProdutos(); 
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Função para deletar um produto
    const handleDeleteProduto = async (id) => {
        if (!window.confirm('Tem certeza que deseja apagar este produto? Todos os movimentos de estoque associados serão mantidos, mas o produto será removido.')) return;
        try {
            await fetch(`http://localhost:3000/api/produtos/${id}`, { method: 'DELETE' });
            fetchProdutos(); // Recarrega a lista
        } catch (err) {
            alert(err.message);
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
                                           {/* Botão de Ajustar Estoque */}
                                               <button 
                                         onClick={() => {
                                         console.log('[DEBUG] Botão Ajustar clicado para o produto:', produto);
                                         setProdutoEmAjuste(produto);
                                          }} 
                                         className="text-blue-500 hover:text-blue-700" 
                                        title="Ajustar Estoque"
                                          >
                                         <Settings className="h-4 w-4" />
                                           </button>

    {/* Botão de Apagar Produto */}
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
// Adicione este novo componente completo ao seu arquivo
function AjusteEstoqueModal({ produto, onClose, onSuccess }) {
    // Estados para o formulário de ajuste
    const [tipo, setTipo] = useState('Saída');
    const [quantidade, setQuantidade] = useState(1);
    const [motivo, setMotivo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reseta o formulário quando o modal abre para um novo produto
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
            alert('Por favor, preencha a quantidade e o motivo do ajuste.');
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
            
            alert('Estoque ajustado com sucesso!');
            onSuccess(); // Chama a função para recarregar os dados na página principal
            onClose();   // Fecha o modal
        } catch (err) {
            alert(err.message);
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
// Substitua toda a sua função App por esta:
export default function App() {
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleUpdate = () => { console.log("Atualização global solicitada."); };
    const handlePedidoClick = (pedido) => { setSelectedPedido(pedido); };
    const handleCloseModal = () => { setSelectedPedido(null); };
    
    const NavLink = ({ to, label, icon: Icon }) => (
        <RouterNavLink
            to={to}
            className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 transition-colors duration-200 rounded-lg ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`
            }
        >
            <Icon className="h-5 w-5" />
            <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>{label}</span>
        </RouterNavLink>
    );

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PÚBLICAS E DO CLIENTE (sem a sidebar do admin) */}
        <Route path="/status/:publicId" element={<StatusPedidoPage />} />
        <Route path="/cliente/login" element={<ClienteLoginPage />} />
        <Route path="/ativar-conta/:token" element={<AtivarContaPage />} />
          {/* ROTAS PROTEGIDAS DO CLIENTE */}
    <Route path="/cliente/dashboard" element={<ClienteProtectedRoute>...</ClienteProtectedRoute>} />
    <Route path="/cliente/pedidos/:id" element={<ClienteProtectedRoute>...</ClienteProtectedRoute>} />
        <Route 
            path="/cliente/dashboard" 
            element={
                <ClienteProtectedRoute>
                    <ClienteDashboardPage />
                </ClienteProtectedRoute>
            } 
        />
<Route 
        path="/cliente/pedidos/:id" 
        element={<ClienteProtectedRoute><PedidoDetalheClientePage /></ClienteProtectedRoute>} 
    />
        {/* ROTA "APANHA-TUDO" PARA O PAINEL DE ADMINISTRAÇÃO */}
        {/* Qualquer URL que não seja as de cima, vai cair aqui */}
        <Route path="/*" element={
            // O layout principal do painel vai aqui dentro do "element"
            <div className="flex h-screen bg-gray-100 font-sans">
              <aside className={`bg-white text-gray-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                  {/* ...código da sua sidebar... */}
                  {/* PROVAVELMENTE O SEU CÓDIGO ATUAL ESTÁ ASSIM: */}
{/* CÓDIGO CORRIGIDO */}
<div className="flex items-center justify-between p-4 border-b">
  <h1 className={`text-xl font-bold text-blue-700 ${!isSidebarOpen && 'hidden'}`}>Faz&Resolve</h1>
  
  <button 
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}  // <-- ADICIONADO
      className="p-2 rounded-lg hover:bg-gray-200"
  >
      {/* LÓGICA DO ÍCONE ADICIONADA */}
      {isSidebarOpen ? <LayoutDashboard className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
  </button>
</div>
                  <nav className="mt-6 px-4 space-y-2">
                      <NavLink to="/" label="Dashboard" icon={LayoutDashboard} />
                      <NavLink to="/pedidos" label="Pedidos" icon={List} />
                      <NavLink to="/agenda" label="Agenda" icon={Calendar} />
                      <NavLink to="/financeiro" label="Financeiro" icon={Wallet} />
                      <NavLink to="/estoque" label="Estoque" icon={Archive} />
                      <NavLink to="/clientes" label="Clientes" icon={Users} />
                      <NavLink to="/configuracoes" label="Configurações" icon={Settings} />
                  </nav>
              </aside>
              <main className="flex-1 flex flex-col overflow-hidden">
                  {/* ...código do seu header... */}
                  <div className="flex-1 p-6 overflow-y-auto">
                      {/* ROTAS ANINHADAS - Só para as páginas DENTRO do painel */}
                      <Routes>
                          {/* CORRIGIDO: A rota para o Dashboard é path="/" */}
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/pedidos" element={<PedidosPage onPedidoClick={handlePedidoClick} />} />
                          <Route path="/clientes" element={<ClientesPage />} />
                          <Route path="/agenda" element={<AgendaPage />} />
                          <Route path="/financeiro" element={<FinanceiroPage />} />
                          <Route path="/estoque" element={<EstoquePage />} />
                          {/* Adicione a rota de configurações aqui se necessário */}
                      </Routes>
                  </div>
              </main>
              <PedidoModal pedido={selectedPedido} onClose={handleCloseModal} onUpdate={handleUpdate} />
            </div>
        } />
      </Routes>
    </BrowserRouter>
);
}
