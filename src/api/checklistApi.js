// src/api/checklistApi.js

// Adicionar uma nova tarefa a um pedido
export const adicionarTarefa = async ({ pedidoId, descricao }) => {
    const response = await fetch(`http://localhost:3000/api/orcamentos/${pedidoId}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao }),
    });
    if (!response.ok) {
        throw new Error('Não foi possível adicionar a tarefa.');
    }
    return response.json();
};

// Atualizar o estado de uma tarefa (concluída/não concluída)
export const atualizarTarefa = async ({ pedidoId, tarefaId, concluida }) => {
    const response = await fetch(`http://localhost:3000/api/orcamentos/${pedidoId}/checklist/${tarefaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concluida }),
    });
    if (!response.ok) {
        throw new Error('Não foi possível atualizar a tarefa.');
    }
    return response.json();
};
// Remover uma tarefa de um pedido
export const removerTarefa = async ({ pedidoId, tarefaId }) => {
    const response = await fetch(`http://localhost:3000/api/orcamentos/${pedidoId}/checklist/${tarefaId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Não foi possível remover a tarefa.');
    }
    return response.json();
};