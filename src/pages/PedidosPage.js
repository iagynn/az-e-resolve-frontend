// src/pages/PedidosPage.js

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Ícone usado nesta página
const DollarSign = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> );
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};


const statusOrdem = ['Pendente', 'Aceito', 'Agendado', 'Finalizado', 'Rejeitado'];

function PedidosPage({ onPedidoClick }) {
    const [colunas, setColunas] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filtroStatusPagamento, setFiltroStatusPagamento] = React.useState('todos');
    const [dataInicio, setDataInicio] = React.useState('');
    const [dataFim, setDataFim] = React.useState('');

    const fetchAllPedidos = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filtroStatusPagamento && filtroStatusPagamento !== 'todos') {
            params.append('statusPagamento', filtroStatusPagamento);
        }
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);

        const queryString = params.toString();
        const apiUrl = `http://localhost:3000/api/orcamentos?${queryString}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('A resposta da rede não foi ok');

            const data = await response.json();

            const pedidosPorStatus = statusOrdem.reduce((acc, status) => {
                acc[status] = data.filter(p => p.status === status);
                return acc;
            }, {});

            setColunas(pedidosPorStatus);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, filtroStatusPagamento, dataInicio, dataFim]);

    React.useEffect(() => {
        fetchAllPedidos();
    }, [fetchAllPedidos]);

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

    // O useMemo foi removido porque a filtragem agora é feita no backend
    const filteredColunas = colunas;

    return (
        <div>
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Gestão de Pedidos</h1>
                    <input
                        type="text"
                        placeholder="Buscar por cliente, telefone ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-1/3 p-2 border rounded-lg"
                    />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-end gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Status do Pagamento</label>
                        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                            {['todos', 'pendente', 'parcial', 'pago'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFiltroStatusPagamento(status)}
                                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                                        filtroStatusPagamento === status
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-gray-600 hover:bg-gray-300'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-end gap-2">
                        <div>
                            <label htmlFor="dataInicio" className="text-sm font-medium text-gray-600 mb-1 block">De</label>
                            <input id="dataInicio" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="p-2 border rounded-lg bg-white h-[42px]" />
                        </div>
                        <div>
                            <label htmlFor="dataFim" className="text-sm font-medium text-gray-600 mb-1 block">Até</label>
                            <input id="dataFim" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="p-2 border rounded-lg bg-white h-[42px]" />
                        </div>
                        <button onClick={() => { setDataInicio(''); setDataFim(''); }} className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg h-[42px] hover:bg-gray-600" title="Limpar datas">
                            Limpar
                        </button>
                    </div>
                </div>
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

export default PedidosPage;