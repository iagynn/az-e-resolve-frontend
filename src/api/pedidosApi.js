// src/api/pedidosApi.js

// Função para apagar um pedido (já existente)
export const deletePedido = async (pedidoId) => {
    // ...
};

// --- ADICIONE ESTAS NOVAS FUNÇÕES ---

// Função para atualizar o status de um pedido
export const updatePedidoStatus = async ({ pedidoId, newStatus }) => {
    const response = await fetch(`http://localhost:3000/api/orcamentos/${pedidoId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
        throw new Error('Falha ao atualizar o status do pedido.');
    }
    return response.json();
};

// Função para submeter/atualizar um orçamento
export const submitOrcamento = async ({ pedidoId, valorProposto }) => {
    const response = await fetch(`http://localhost:3000/api/orcamentos/${pedidoId}/submit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valorProposto }),
    });
    if (!response.ok) {
        throw new Error("Falha ao enviar o orçamento.");
    }
    return response.json();
};
export const marcarComoPago = async (pedidoId) => {
    const response = await fetch(`http://localhost:3000/api/orcamentos/${pedidoId}/marcar-pago`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Não foi possível marcar o pedido como pago.');
    }
    return response.json();
};

// Pode adicionar aqui outras funções de API (schedule, addMaterial, etc.) no futuro