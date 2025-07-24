// src/App.js

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink as RouterNavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query'; 
import VisibilidadePage from './pages/VisibilidadePage.js'; 
import FornecedoresPage from './pages/FornecedoresPage.js';
import ConfiguracoesPage from './pages/ConfiguracoesPage.js';
// Páginas
import DashboardPage from './pages/DashboardPage.js';
import PedidosPage from './pages/PedidosPage.js';
import ClientesPage from './pages/ClientesPage.js';
import AgendaPage from './pages/AgendaPage.js';
import FinanceiroPage from './pages/FinanceiroPage.js';
import EstoquePage from './pages/EstoquePage.js';
import ClienteLoginPage from './pages/Cliente/ClienteLoginPage.js';
import ClienteDashboardPage from './pages/Cliente/ClienteDashboardPage.js';
import PedidoDetalheClientePage from './pages/Cliente/PedidoDetalheClientePage.js';
import AtivarContaPage from './pages/Public/AtivarContaPage.js';
import StatusPedidoPage from './pages/Public/StatusPedidoPage.js'; // Assumindo que você irá criar este
import TalentosPage from './pages/TalentosPage.js'; 


// Componentes
import ClienteProtectedRoute from './components/ClienteProtectedRoute.js';
import PedidoModal from './components/PedidoModal/PedidoModal.js';
import {
    LayoutDashboard, List, Users, Settings, Menu, Calendar, Wallet,
    Archive, MapPin, ShoppingCart, Briefcase
} from './components/ui/icons.js';
import { buttonVariants } from './components/ui/Button'; // Importe as variantes
import { cn } from './lib/utils'; // Importe a função cn

export default function App() {
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [updateTrigger, setUpdateTrigger] = useState(0);

     const queryClient = useQueryClient();

     const handleUpdateAndClose = () => {
        // Invalida todas as queries que dependem dos pedidos, forçando a atualização
        queryClient.invalidateQueries({ queryKey: ['pedidos'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        queryClient.invalidateQueries({ queryKey: ['proximosAgendamentos'] });
        // Adicione aqui outras queries que precisam ser atualizadas
        
        // Fecha o modal
        setSelectedPedido(null);
    };
    
    const handlePedidoClick = (pedido) => { setSelectedPedido(pedido); };
    const handleCloseModal = () => { setSelectedPedido(null); };
    const handleAddPagamento = async (pagamentoData) => { /* ... sua lógica de fetch ... */ };
    const handleRemovePagamento = async (pagamentoId) => { /* ... sua lógica de fetch ... */ };

    const NavLink = ({ to, label, icon: Icon }) => (
        <RouterNavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    buttonVariants({ variant: isActive ? "default" : "ghost", size: "default" }),
                    "w-full justify-start space-x-3 px-4 py-2.5"
                )
            }
        >
            <Icon className="h-5 w-5" />
            <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>{label}</span>
        </RouterNavLink>
    );

    return (
        <BrowserRouter>
            <Toaster position="top-right" toastOptions={{ success: { style: { background: '#22c55e', color: 'white' } }, error: { style: { background: '#ef4444', color: 'white' } } }} />
            <Routes>
                <Route path="/status/:publicId" element={<StatusPedidoPage />} />
                <Route path="/cliente/login" element={<ClienteLoginPage />} />
                <Route path="/ativar-conta/:token" element={<AtivarContaPage />} />
                <Route path="/cliente/dashboard" element={<ClienteProtectedRoute><ClienteDashboardPage /></ClienteProtectedRoute>} />
                <Route path="/cliente/pedidos/:id" element={<ClienteProtectedRoute><PedidoDetalheClientePage /></ClienteProtectedRoute>} />
                
                 <Route path="/*" element={
                <div className="flex h-screen bg-secondary font-sans"> {/* 1. Fundo cinza suave para toda a área */}
                    <aside className={`bg-background text-foreground transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}> {/* 2. Fundo branco para a sidebar */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h1 className={`text-xl font-bold text-primary ${!isSidebarOpen && 'hidden'}`}>Faz&Resolve</h1> {/* 3. Usando a cor primária para o título */}
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg text-muted-foreground hover:bg-accent">
                                {isSidebarOpen ? <LayoutDashboard className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                            <nav className="mt-6 px-4 space-y-2">
                                <NavLink to="/" label="Dashboard" icon={LayoutDashboard} />
                                <NavLink to="/pedidos" label="Pedidos" icon={List} />
                                <NavLink to="/agenda" label="Agenda" icon={Calendar} />
                                <NavLink to="/financeiro" label="Financeiro" icon={Wallet} />
                                <NavLink to="/estoque" label="Estoque" icon={Archive} />
                                 <NavLink to="/fornecedores" label="Fornecedores" icon={ShoppingCart} /> 
                                <NavLink to="/clientes" label="Clientes" icon={Users} />
                                <NavLink to="/talentos" label="Talentos" icon={Briefcase} />
                                 <NavLink to="/visibilidade" label="Mercado" icon={MapPin} />
                                <NavLink to="/configuracoes" label="Configurações" icon={Settings} />
                            </nav>
                        </aside>
                        <main className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 p-6 overflow-y-auto">
                                <Routes>
                                    {/* 👇 AS ALTERAÇÕES ESTÃO AQUI 👇 */}
                                    <Route index element={<DashboardPage onPedidoClick={handlePedidoClick} />} />
                                    <Route path="pedidos" element={<PedidosPage onPedidoClick={handlePedidoClick} />} />
                                    <Route path="clientes" element={<ClientesPage />} />
                                    <Route path="agenda" element={<AgendaPage onPedidoClick={handlePedidoClick} />} />
                                    <Route path="financeiro" element={<FinanceiroPage />} />
                                    <Route path="estoque" element={<EstoquePage />} />
                                     <Route path="talentos" element={<TalentosPage />} /> {/* 3. NOVA ROTA ADICIONADA */}
                                    <Route path="fornecedores" element={<FornecedoresPage />} /> 
                                     <Route path="visibilidade" element={<VisibilidadePage onPedidoClick={handlePedidoClick} />} />
                                    <Route path="configuracoes" element={<ConfiguracoesPage />} /> 
                                </Routes>
                            </div>
                        </main>
                        <PedidoModal
                            pedido={selectedPedido}
                            onClose={handleCloseModal}
                            onUpdate={handleUpdateAndClose}
                            onAddPagamento={handleAddPagamento}
                            onRemovePagamento={handleRemovePagamento}
                        />
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}
 