import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.jsx";
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx'; // Usando o seu componente de Input
import { getConfiguracao, updateConfiguracao } from '../api/configuracaoApi.js';
import { useSearchParams } from 'react-router-dom';

const ConfiguracoesPage = () => {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    // Estado para guardar todos os dados do formulário
    const [formData, setFormData] = useState({
        nomeEmpresa: '',
        documento: '', // Para CNPJ ou CPF
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        telefoneEmpresa: '',
        emailEmpresa: '',
        website: '',
        logoUrl: ''
    });

    // Query para buscar os dados de configuração existentes
    const { data: config, isLoading, error } = useQuery({
        queryKey: ['configuracao'],
        queryFn: getConfiguracao
    });

    // Efeito para tratar o redirecionamento do Google Auth
    useEffect(() => {
        const authStatus = searchParams.get('google_auth');
        if (authStatus === 'success') {
            toast.success("Google Calendar conectado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['configuracao'] });
            setSearchParams({});
        } else if (authStatus === 'error') {
            toast.error("Falha ao conectar com o Google Calendar. Tente novamente.");
            setSearchParams({});
        }
    }, [searchParams, setSearchParams, queryClient]);

    // Efeito para preencher o formulário quando os dados são carregados da API
    useEffect(() => {
        if (config) {
            // Preenche o estado do formulário com todos os dados recebidos
            setFormData({
                nomeEmpresa: config.nomeEmpresa || '',
                documento: config.documento || '',
                endereco: config.endereco || '',
                cidade: config.cidade || '',
                estado: config.estado || '',
                cep: config.cep || '',
                telefoneEmpresa: config.telefoneEmpresa || '',
                emailEmpresa: config.emailEmpresa || '',
                website: config.website || '',
                logoUrl: config.logoUrl || ''
            });
        }
    }, [config]);

    // Mutação para atualizar as configurações
    const updateMutation = useMutation({
        mutationFn: updateConfiguracao,
        onSuccess: () => {
            toast.success('Configurações guardadas com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['configuracao'] });
        },
        onError: (err) => toast.error(`Erro: ${err.message}`),
    });

    // Lida com a alteração de qualquer campo do formulário
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Submete o formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <p className="p-6 text-muted-foreground">A carregar configurações...</p>;
    if (error) return <p className="p-6 text-destructive">Erro ao carregar dados: {error.message}</p>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Empresa</CardTitle>
                        <CardDescription>Esta informação será utilizada nos seus orçamentos, recibos e outros documentos.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* --- CAMPOS DO FORMULÁRIO RESTAURADOS --- */}
                        <div className="space-y-1">
                            <label htmlFor="nomeEmpresa">Nome da Empresa / Prestador</label>
                            <Input id="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleInputChange} placeholder="Ex: Faz & Resolve Serviços" />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="documento">CNPJ ou CPF</label>
                            <Input id="documento" value={formData.documento} onChange={handleInputChange} placeholder="00.000.000/0001-00" />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="endereco">Endereço</label>
                            <Input id="endereco" value={formData.endereco} onChange={handleInputChange} placeholder="Rua Principal, 123" />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="cidade">Cidade</label>
                            <Input id="cidade" value={formData.cidade} onChange={handleInputChange} placeholder="São Paulo" />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="estado">Estado</label>
                            <Input id="estado" value={formData.estado} onChange={handleInputChange} placeholder="SP" />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="cep">CEP</label>
                            <Input id="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000" />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="telefoneEmpresa">Telefone de Contato</label>
                            <Input id="telefoneEmpresa" value={formData.telefoneEmpresa} onChange={handleInputChange} placeholder="(11) 99999-9999" />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="emailEmpresa">Email de Contato</label>
                            <Input id="emailEmpresa" type="email" value={formData.emailEmpresa} onChange={handleInputChange} placeholder="contato@suaempresa.com" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label htmlFor="website">Website (Opcional)</label>
                            <Input id="website" value={formData.website} onChange={handleInputChange} placeholder="www.suaempresa.com" />
                        </div>
                         <div className="space-y-1 md:col-span-2">
                            <label htmlFor="logoUrl">URL do Logo (Opcional)</label>
                            <Input id="logoUrl" value={formData.logoUrl} onChange={handleInputChange} placeholder="https://.../logo.png" />
                        </div>
                    </CardContent>
                </Card>

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
                            <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/google`}>
                                <Button type="button">
                                    {config?.googleCalendarConnected ? 'Reconectar' : 'Conectar'}
                                </Button>
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
