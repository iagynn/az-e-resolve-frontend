// src/components/pedidos/Checklist.js
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { adicionarTarefa, atualizarTarefa, removerTarefa } from '../../api/checklistApi.js';
import { Button } from '../ui/Button.jsx';

const TrashIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const Checklist = ({ pedido }) => {
    const queryClient = useQueryClient();
    const [novaTarefa, setNovaTarefa] = useState('');
    
    const tarefasConcluidas = pedido.checklist?.filter(t => t.concluida).length || 0;
    const totalTarefas = pedido.checklist?.length || 0;
    const progresso = totalTarefas > 0 ? (tarefasConcluidas / totalTarefas) * 100 : 0;

    // Função de callback genérica para o sucesso de uma mutação
    const onMutationSuccess = (successMessage) => {
        toast.success(successMessage);
        // A chave da reatividade: Invalida a query de pedidos, forçando a busca dos dados atualizados.
        queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    };

    const addMutation = useMutation({
        mutationFn: adicionarTarefa,
        onSuccess: () => {
            onMutationSuccess("Tarefa adicionada!");
            setNovaTarefa('');
        },
        onError: (err) => toast.error(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: atualizarTarefa,
        onSuccess: () => onMutationSuccess("Tarefa atualizada!"),
        onError: (err) => toast.error(err.message),
    });
    
    const deleteMutation = useMutation({
        mutationFn: removerTarefa,
        onSuccess: () => onMutationSuccess("Tarefa removida!"),
        onError: (err) => toast.error(err.message),
    });
    
    const handleAddTarefa = (e) => {
        e.preventDefault();
        if (!novaTarefa.trim()) return;
        addMutation.mutate({ pedidoId: pedido._id, descricao: novaTarefa });
    };

    const handleToggleTarefa = (tarefaId, concluidaAtual) => {
        updateMutation.mutate({ pedidoId: pedido._id, tarefaId, concluida: !concluidaAtual });
    };
    
    const handleDeleteTarefa = (tarefaId) => {
        if (window.confirm("Tem a certeza que deseja apagar esta tarefa?")) {
            deleteMutation.mutate({ pedidoId: pedido._id, tarefaId });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Progresso</span>
                    <span className="text-sm font-bold text-primary">{Math.round(progresso)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }}></div>
                </div>
            </div>

            <ul className="space-y-2">
                {pedido.checklist?.map(tarefa => (
                    <li key={tarefa._id} className="flex items-center p-2 bg-secondary rounded-md group">
                        <input
                            type="checkbox"
                            checked={tarefa.concluida}
                            onChange={() => handleToggleTarefa(tarefa._id, tarefa.concluida)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            disabled={updateMutation.isPending || deleteMutation.isPending}
                        />
                        <span className={`ml-3 text-sm flex-grow ${tarefa.concluida ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {tarefa.descricao}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteTarefa(tarefa._id)} disabled={deleteMutation.isPending || updateMutation.isPending}>
                            <TrashIcon className="text-muted-foreground hover:text-destructive"/>
                        </Button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddTarefa} className="flex space-x-2">
                <input
                    type="text"
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                    placeholder="Adicionar nova tarefa..."
                    className="flex-grow p-2 border rounded-md bg-background"
                    disabled={addMutation.isPending}
                />
                <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending ? '...' : 'Adicionar'}
                </Button>
            </form>
        </div>
    );
};

export default Checklist;