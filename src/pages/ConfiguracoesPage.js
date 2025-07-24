// src/pages/ConfiguracoesPage.js
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.jsx";
import { Button } from '../components/ui/Button.jsx';
import { getConfiguracao, updateConfiguracao } from '../api/configuracaoApi.js';
import { useSearchParams } from 'react-router-dom'; // 1. Importar hook para ler URL

const ConfiguracoesPage = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ /* ... */ });
    const [searchParams, setSearchParams] = useSearchParams(); // 2. Inicializar o hook

    const { data: config, isLoading, error } = useQuery({
        queryKey: ['configuracao'],
        queryFn: getConfiguracao
    });

    // 3. Efeito para mostrar a mensagem de sucesso/erro após o redirecionamento
    useEffect(() => {
        const authStatus = searchParams.get('google_auth');
        if (authStatus === 'success') {
            toast.success("Google Calendar conectado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['configuracao'] }); // Atualiza os dados
            setSearchParams({}); // Limpa o parâmetro da URL
        } else if (authStatus === 'error') {
            toast.error("Falha ao conectar com o Google Calendar. Tente novamente.");
            setSearchParams({}); // Limpa o parâmetro da URL
        }
    }, [searchParams, setSearchParams, queryClient]);

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

    const updateMutation = useMutation({
        mutationFn: updateConfiguracao,
        onSuccess: () => {
            toast.success('Configurações guardadas com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['configuracao'] });
        },
        onError: (err) => toast.error(`Erro: ${err.message}`),
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Empresa</CardTitle>
                        <CardDescription>Esta informação será utilizada nos seus documentos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* ... (Os seus inputs para os dados da empresa) ... */}
                    </CardContent>
                </Card>

                {/* 👇 4. NOVA SECÇÃO DE INTEGRAÇÕES 👇 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Integrações</CardTitle>
                        <CardDescription>Conecte o Faz & Resolve com outras ferramentas que você usa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                                <h4 className="font-semibold">Google Calendar</h4>
                                <p className="text-sm text-muted-foreground">Sincronize seus agendamentos automaticamente.</p>
                            </div>
                            {/* O botão agora é um link `<a>` que aponta para a rota do backend */}
                            <a href="http://localhost:3000/api/auth/google">
                                <Button type="button">Conectar</Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'A guardar...' : 'Guardar Alterações'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ConfiguracoesPage;