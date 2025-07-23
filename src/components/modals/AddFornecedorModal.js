// src/components/modals/AddFornecedorModal.js
import React, { useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query'; // 1. IMPORTAR useMutation
import { createFornecedor } from '../../api/fornecedoresApi.js'; // 2. IMPORTAR A FUNÇÃO DA API

const AddFornecedorModal = ({ isOpen, onClose, onFornecedorAdicionado }) => {
    const [nome, setNome] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [contato, setContato] = useState('');

    // 3. Criar a mutação
    const addFornecedorMutation = useMutation({
        mutationFn: createFornecedor,
        onSuccess: () => {
            toast.success("Fornecedor adicionado com sucesso!");
            onFornecedorAdicionado(); // Avisa a página para recarregar a lista
            onClose(); // Fecha o modal
            // Limpa o formulário
            setNome('');
            setEspecialidade('');
            setContato('');
        },
        onError: (error) => {
            toast.error(`Erro: ${error.message}`);
        }
    });

    // 4. Simplificar o handleSubmit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nome || !especialidade || !contato) {
            return toast.error("Por favor, preencha todos os campos obrigatórios.");
        }
        // Chama a mutação com os dados do formulário
        addFornecedorMutation.mutate({ nome, especialidade, contato });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100]">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Adicionar Novo Fornecedor</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-muted-foreground mb-1">Nome do Fornecedor</label>
                        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded-md bg-background" required />
                    </div>
                    <div>
                        <label htmlFor="especialidade" className="block text-sm font-medium text-muted-foreground mb-1">Especialidade</label>
                        <input type="text" id="especialidade" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} className="w-full p-2 border rounded-md bg-background" required />
                    </div>
                    <div>
                        <label htmlFor="contato" className="block text-sm font-medium text-muted-foreground mb-1">Contato (Telefone ou Email)</label>
                        <input type="text" id="contato" value={contato} onChange={(e) => setContato(e.target.value)} className="w-full p-2 border rounded-md bg-background" required />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={addFornecedorMutation.isPending}>Cancelar</Button>
                        <Button type="submit" disabled={addFornecedorMutation.isPending}>
                            {addFornecedorMutation.isPending ? 'A guardar...' : 'Guardar Fornecedor'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFornecedorModal;