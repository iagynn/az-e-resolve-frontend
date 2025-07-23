// src/pages/ConfiguracoesPage.js
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.jsx";
import { Button } from '../components/ui/Button.jsx';
import { getConfiguracao, updateConfiguracao } from '../api/configuracaoApi.js';

const ConfiguracoesPage = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        nomeEmpresa: '',
        documento: '',
        telefoneEmpresa: '',
        emailEmpresa: '',
    });

    // 1. Busca os dados da configuração quando a página carrega
    const { data: config, isLoading, error } = useQuery({
        queryKey: ['configuracao'],
        queryFn: getConfiguracao
    });

    // 2. Atualiza o formulário quando os dados chegam da API
    useEffect(() => {
        if (config) {
            setFormData({
                nomeEmpresa: config.nomeEmpresa || '',
                documento: config.documento || '',
                telefoneEmpresa: config.telefoneEmpresa || '',
                emailEmpresa: config.emailEmpresa || '',
            });
        }
    }, [config]);

    // 3. Cria a mutação para guardar as alterações
    const updateMutation = useMutation({
        mutationFn: updateConfiguracao,
        onSuccess: () => {
            toast.success('Configurações guardadas com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['configuracao'] });
        },
        onError: (err) => {
            toast.error(`Erro: ${err.message}`);
        }
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <p className="text-muted-foreground">A carregar configurações...</p>;
    if (error) return <p className="text-destructive">Erro: {error.message}</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Empresa</CardTitle>
                        <CardDescription>Esta informação será utilizada nos seus orçamentos e faturas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-muted-foreground mb-1">Nome da Empresa</label>
                            <input type="text" id="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
                        </div>
                        <div>
                            <label htmlFor="documento" className="block text-sm font-medium text-muted-foreground mb-1">NIF / CNPJ</label>
                            <input type="text" id="documento" value={formData.documento} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
                        </div>
                        <div>
                            <label htmlFor="telefoneEmpresa" className="block text-sm font-medium text-muted-foreground mb-1">Telefone de Contato</label>
                            <input type="tel" id="telefoneEmpresa" value={formData.telefoneEmpresa} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
                        </div>
                        <div>
                            <label htmlFor="emailEmpresa" className="block text-sm font-medium text-muted-foreground mb-1">Email de Contato</label>
                            <input type="email" id="emailEmpresa" value={formData.emailEmpresa} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'A guardar...' : 'Guardar Alterações'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ConfiguracoesPage;