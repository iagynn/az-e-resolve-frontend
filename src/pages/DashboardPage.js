// src/pages/DashboardPage.js

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import Chart from 'react-apexcharts';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "../components/ui/Skeleton.jsx"; // 1. Importar o Skeleton
import { formatCurrency } from '../lib/utils.js';
import ProximosAgendamentos from './dashboard/ProximosAgendamentos.js';
import PedidosPendentes from './dashboard/PedidosPendentes.js';
import PagamentosAtrasados from './dashboard/PagamentosAtrasados.js';
import TopRegioes from './dashboard/TopRegioes.js';

// --- Funções de Busca de Dados ---
// Criamos funções separadas e exportáveis para cada busca de dados.

const fetchDashboardStats = async () => {
    const response = await fetch('http://localhost:3000/api/dashboard');
    if (!response.ok) throw new Error('Falha ao buscar dados do dashboard');
    return response.json();
};

const fetchHistoricoFinanceiro = async () => {
    const response = await fetch('http://localhost:3000/api/stats/historico-financeiro');
    if (!response.ok) throw new Error('Falha ao carregar histórico financeiro');
    return response.json();
};

const fetchTopServicos = async () => {
    const response = await fetch('http://localhost:3000/api/stats/top-servicos');
    if (!response.ok) throw new Error('Falha ao carregar top serviços');
    return response.json();
};

const fetchTopClientes = async () => {
    const response = await fetch('http://localhost:3000/api/stats/top-clientes');
    if (!response.ok) throw new Error('Falha ao carregar top clientes');
    return response.json();
};


// --- Subcomponentes Refatorados ---

function StatCard({ title, value, isLoading }) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                </CardContent>
            </Card>
        );
    }
    return (
        <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-foreground">{value}</p></CardContent>
        </Card>
    );
}

function GraficoFinanceiroApex() {
    const { data, isLoading, error } = useQuery({ queryKey: ['historicoFinanceiro'], queryFn: fetchHistoricoFinanceiro });

    if (isLoading) return <Skeleton className="h-[360px] w-full" />;
    if (error) return <Card className="flex items-center justify-center h-full min-h-[360px]"><CardContent><p className="text-red-500">{error.message}</p></CardContent></Card>;

    const series = [
        { name: 'Faturamento', data: data?.map(item => item.faturamento) || [] },
        { name: 'Despesas', data: data?.map(item => item.despesas) || [] },
        { name: 'Lucro', data: data?.map(item => item.lucro) || [] }
    ];
     const options = {
        chart: { type: 'area', height: '100%', toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 2 },
        // 👇 CORES ATUALIZADAS AQUI 👇
        colors: ['hsl(var(--primary))', 'hsl(var(--destructive))', '#22c55e'], // Azul, Vermelho e um Verde para o lucro
        xaxis: { categories: data?.map(item => item.mes) || [] },
        yaxis: { labels: { formatter: (value) => formatCurrency(value) } },
        tooltip: { y: { formatter: (value) => formatCurrency(value) } },
        dataLabels: { enabled: false }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Análise Financeira (Últimos 6 Meses)</CardTitle></CardHeader>
            <CardContent>
                {data && data.length > 0 ? (
                    <Chart options={options} series={series} type="area" width="100%" height="300" />
                ) : (
                    <div className="flex justify-center items-center h-[300px]"><p className="text-gray-500">Não há dados para exibir.</p></div>
                )}
            </CardContent>
        </Card>
    );
}

function GraficoTopServicosApex() {
    const { data, isLoading, error } = useQuery({ queryKey: ['topServicos'], queryFn: fetchTopServicos });

    if (isLoading) return <Skeleton className="h-[360px] w-full" />;
    if (error) return <Card className="flex items-center justify-center h-full min-h-[360px]"><CardContent><p className="text-red-500">{error.message}</p></CardContent></Card>;

    const series = data?.map(item => item.value) || [];
 const options = {
        chart: { type: 'donut', height: '100%' },
        labels: data?.map(item => item.name) || [],
        legend: { position: 'bottom' },
        // 👇 CORES ATUALIZADAS AQUI 👇
        colors: ['hsl(var(--primary))', 'hsl(var(--secondary-foreground))', 'hsl(var(--muted-foreground))', '#3b82f6', '#64748b'],
        tooltip: { y: { formatter: (value) => `${value} pedidos` } }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Serviços Mais Realizados</CardTitle></CardHeader>
            <CardContent>
                {data && data.length > 0 ? (
                    <Chart options={options} series={series} type="donut" width="100%" height="300" />
                ) : (
                    <div className="flex justify-center items-center h-[300px]"><p className="text-gray-500">Nenhum serviço finalizado.</p></div>
                )}
            </CardContent>
        </Card>
    );
}

function RankingTopClientes() {
    const { data: clientes, isLoading, error } = useQuery({ queryKey: ['topClientes'], queryFn: fetchTopClientes });

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    ))}
                </div>
            );
        }
        if (error) return <div className="text-center text-red-500">{error.message}</div>;
        if (!clientes || clientes.length === 0) return <div className="text-center text-muted-foreground">Nenhum dado de faturamento de clientes encontrado.</div>;
        
        return (
            <ul className="space-y-4">{clientes.map((cliente, index) => (
                <li key={cliente.clienteId} className="flex items-center justify-between text-sm">
                    <div className="flex items-center"><span className="font-bold text-muted-foreground w-6">{index + 1}.</span><span className="font-medium text-foreground">{cliente.nome}</span></div>
                    <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">{formatCurrency(cliente.valor)}</span>
                </li>))}
            </ul>
        );
    };

    return (
        <Card>
            <CardHeader><CardTitle>Top 5 Clientes (por Faturamento)</CardTitle></CardHeader>
            <CardContent>{renderContent()}</CardContent>
        </Card>
    );
}

// --- Componente Principal da Página ---
const DashboardPage = ({ onPedidoClick }) => { 
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats
    });
    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Ocorreu um erro no servidor!</strong><pre className="mt-2 text-xs">{error.message}</pre></div>;
    }

    return (
        <div className="space-y-6">
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Visão Geral do Negócio</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Novas Solicitações (Mês)" value={dashboardData?.stats?.novasSolicitacoes || 0} isLoading={isLoading} />
                <StatCard title="Faturamento (Mês)" value={formatCurrency(dashboardData?.stats?.faturamento)} isLoading={isLoading} />
                <StatCard title="Receitas Futuras" value={formatCurrency(dashboardData?.stats?.receitasFuturas)} isLoading={isLoading} />
                <StatCard title="Satisfação Média" value={dashboardData ? `${(dashboardData.stats.satisfacaoMedia || 0).toFixed(1)}/5` : 'N/A'} isLoading={isLoading} />
            </div>
             <div className="grid gap-6 lg:grid-cols-2">
                <ProximosAgendamentos onPedidoClick={onPedidoClick} />
                <PedidosPendentes onPedidoClick={onPedidoClick} />
            </div>
            
             <div className="grid gap-6 lg:grid-cols-2">
                <GraficoFinanceiroApex />
                <GraficoTopServicosApex />
            </div>
            
             {/* 👇 NOVA LINHA PARA OS PAINÉIS FINAIS 👇 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <PagamentosAtrasados onPedidoClick={onPedidoClick} />
                <RankingTopClientes />
                 <TopRegioes />
            </div>
        </div>
    );
};

export default DashboardPage;