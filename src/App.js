// src/App.js

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink as RouterNavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query'; 

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


// Componentes
import ClienteProtectedRoute from './components/ClienteProtectedRoute.js';
import PedidoModal from './components/PedidoModal/PedidoModal.js';

// Ícones (poderão ser movidos para um ficheiro de ícones no futuro)
const LayoutDashboard = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="3" y="15" rx="1" /><rect width="7" height="5" x="14" y="12" rx="1" /></svg> );
const List = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg> );
const Users = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> );
const Settings = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg> );
const Menu = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg> );
const Calendar = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg> );
const Wallet = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg> );
const Archive = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><line x1="10" x2="14" y1="9" y2="9" /></svg> );

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
                `w-full flex items-center space-x-3 px-4 py-3 transition-colors duration-200 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`
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
                    <div className="flex h-screen bg-gray-100 font-sans">
                        <aside className={`bg-white text-gray-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                            <div className="flex items-center justify-between p-4 border-b">
                                <h1 className={`text-xl font-bold text-blue-700 ${!isSidebarOpen && 'hidden'}`}>Faz&Resolve</h1>
                                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-200">{isSidebarOpen ? <LayoutDashboard className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
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
                            <div className="flex-1 p-6 overflow-y-auto">
                                <Routes>
                                    {/* 👇 AS ALTERAÇÕES ESTÃO AQUI 👇 */}
                                    <Route index element={<DashboardPage onPedidoClick={handlePedidoClick} />} />
                                    <Route path="pedidos" element={<PedidosPage onPedidoClick={handlePedidoClick} />} />
                                    <Route path="clientes" element={<ClientesPage />} />
                                    <Route path="agenda" element={<AgendaPage onPedidoClick={handlePedidoClick} />} />
                                    <Route path="financeiro" element={<FinanceiroPage />} />
                                    <Route path="estoque" element={<EstoquePage />} />
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
 