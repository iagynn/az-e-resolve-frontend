// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import Chart from 'react-apexcharts';
import { formatCurrency } from '../lib/utils.js';

// Componente StatCard (agora local para o Dashboard)
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

// Componente GraficoFinanceiroApex
function GraficoFinanceiroApex() {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDadosGrafico = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/stats/historico-financeiro');
                if (!response.ok) throw new Error('Não foi possível carregar os dados.');
                const data = await response.json();
                if (data.length === 0) {
                  setLoading(false);
                  return;
                }

                setSeries([
                    { name: 'Faturamento', data: data.map(item => item.faturamento) },
                    { name: 'Despesas', data: data.map(item => item.despesas) },
                    { name: 'Lucro', data: data.map(item => item.lucro) }
                ]);
                setOptions({
                    chart: { type: 'area', height: '100%', toolbar: { show: true, tools: { download: false } } },
                    stroke: { curve: 'smooth', width: 2 },
                    colors: ['#3b82f6', '#ef4444', '#22c55e'],
                    xaxis: { categories: data.map(item => item.mes) },
                    yaxis: { labels: { formatter: (value) => `R$ ${value}` } },
                    tooltip: { y: { formatter: (value) => formatCurrency(value) } },
                    dataLabels: { enabled: false }
                });
            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        };
        fetchDadosGrafico();
    }, []);

    if (loading) return <Card className="flex items-center justify-center h-full"><CardContent><p>A carregar...</p></CardContent></Card>;
    if (error) return <Card className="flex items-center justify-center h-full"><CardContent><p className="text-red-500">{error}</p></CardContent></Card>;

    return (
        <Card>
            <CardHeader><CardTitle>Análise Financeira (Últimos 6 Meses)</CardTitle></CardHeader>
            <CardContent>
                {series.length > 0 ? (
                    <Chart options={options} series={series} type="area" width="100%" height="300" />
                ) : (
                    <div className="flex justify-center items-center h-[300px]"><p className="text-gray-500">Não há dados para exibir.</p></div>
                )}
            </CardContent>
        </Card>
    );
}

// Componente GraficoTopServicosApex
function GraficoTopServicosApex() {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTopServicos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/stats/top-servicos');
                if (!response.ok) throw new Error('Não foi possível carregar os dados.');
                const data = await response.json();
                if (data.length === 0) {
                    setLoading(false);
                    return;
                }

                setSeries(data.map(item => item.value));
                setOptions({
                    chart: { type: 'donut', height: '100%' },
                    labels: data.map(item => item.name),
                    legend: { position: 'bottom' },
                    tooltip: { y: { formatter: (value) => `${value} pedidos` } }
                });
            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        };
        fetchTopServicos();
    }, []);

     if (loading) return <Card className="flex items-center justify-center h-full"><CardContent><p>A carregar...</p></CardContent></Card>;
    if (error) return <Card className="flex items-center justify-center h-full"><CardContent><p className="text-red-500">{error}</p></CardContent></Card>;

    return (
        <Card>
            <CardHeader><CardTitle>Serviços Mais Realizados</CardTitle></CardHeader>
            <CardContent>
                {series.length > 0 ? (
                    <Chart options={options} series={series} type="donut" width="100%" height="300" />
                ) : (
                    <div className="flex justify-center items-center h-[300px]"><p className="text-gray-500">Nenhum serviço finalizado.</p></div>
                )}
            </CardContent>
        </Card>
    );
}

// Componente RankingTopClientes
function RankingTopClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTopClientes = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/stats/top-clientes');
                if (!response.ok) {
                    throw new Error('Não foi possível carregar o ranking de clientes.');
                }
                const data = await response.json();
                setClientes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTopClientes();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div className="text-center text-gray-500">A carregar...</div>;
        }
        if (error) {
            return <div className="text-center text-red-500">{error}</div>;
        }
        if (clientes.length === 0) {
            return <div className="text-center text-gray-500">Nenhum dado de faturamento de clientes encontrado.</div>;
        }
        return (
            <ul className="space-y-4">
                {clientes.map((cliente, index) => (
                    <li key={cliente.clienteId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <span className="font-bold text-gray-500 w-6">{index + 1}.</span>
                            <span className="font-medium text-gray-800">{cliente.nome}</span>
                        </div>
                        <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                            {formatCurrency(cliente.valor)}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 5 Clientes (por Faturamento)</CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}

// Componente Principal da Página
const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState({ stats: {}, recentesClientes: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:3000/api/dashboard');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `Erro do servidor: ${response.status}`);
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                console.error("Erro ao buscar dados do dashboard:", err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Ocorreu um erro no servidor!</strong>
                <pre className="mt-2 text-xs">{error}</pre>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Visão Geral do Negócio</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Novas Solicitações (Mês)" value={dashboardData.stats?.novasSolicitacoes || 0} isLoading={isLoading} />
                <StatCard title="Faturamento (Mês)" value={formatCurrency(dashboardData.stats?.faturamento)} isLoading={isLoading} />
                <StatCard title="Receitas Futuras" value={formatCurrency(dashboardData.stats?.receitasFuturas)} isLoading={isLoading} />
                <StatCard title="Satisfação Média" value={dashboardData.stats ? `${(dashboardData.stats.satisfacaoMedia || 0).toFixed(1)}/5` : 'N/A'} isLoading={isLoading} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <GraficoFinanceiroApex />
                <GraficoTopServicosApex />
            </div>

            <div className="grid gap-6">
                <RankingTopClientes />
            </div>
        </div>
    );
};

export default DashboardPage;