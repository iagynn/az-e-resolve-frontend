// src/pages/FornecedoresPage.js
import React, { useState } from 'react'; // O useState já está aqui, ótimo!
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from '../components/ui/Button.jsx';
import AddFornecedorModal from '../components/modals/AddFornecedorModal.js';
import ProdutosFornecedorModal from '../components/modals/ProdutosFornecedorModal.js';

const fetchFornecedores = async () => {
    const response = await fetch('http://localhost:3000/api/fornecedores');
    if (!response.ok) {
        throw new Error('Não foi possível carregar a lista de fornecedores.');
    }
    return response.json();
};

const FornecedoresPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFornecedor, setSelectedFornecedor] = useState(null); // <-- A LINHA QUE FALTAVA
    const queryClient = useQueryClient();

    const { data: fornecedores, isLoading, error, isSuccess } = useQuery({
        queryKey: ['fornecedores'],
        queryFn: fetchFornecedores
    });

    const handleFornecedorAdicionado = () => {
        queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Catálogo de Fornecedores</h1>
                    {/* Botão para abrir o modal de adicionar */}
                    <Button onClick={() => setIsAddModalOpen(true)}>Adicionar Fornecedor</Button>
                </div>
                
                {isLoading && (
                    <p className="text-center text-muted-foreground py-8">A carregar fornecedores...</p>
                )}

                {error && (
                    <p className="text-center text-destructive py-8">Erro: {error.message}</p>
                )}

                {isSuccess && fornecedores.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {fornecedores.map((fornecedor) => (
                            <Card key={fornecedor._id} className="hover:shadow-lg transition-shadow duration-200 flex flex-col">
                                <CardHeader className="flex flex-row items-center space-x-4">
                                    <img 
                                        src={fornecedor.logoUrl || `https://ui-avatars.com/api/?name=${fornecedor.nome}&background=random`} 
                                        alt={`Logo ${fornecedor.nome}`} 
                                        className="w-16 h-16 rounded-full border" 
                                    />
                                    <div>
                                        <CardTitle>{fornecedor.nome}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{fornecedor.especialidade}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow flex items-end">
                                    {/* Botão para abrir o modal de produtos */}
                                    <Button variant="outline" className="w-full" onClick={() => setSelectedFornecedor(fornecedor)}>
                                        Ver Produtos
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                
                {isSuccess && fornecedores.length === 0 && (
                     <div className="text-center text-muted-foreground py-16">
                        <p>Nenhum fornecedor encontrado.</p>
                        <p className="text-sm mt-2">Clique em "Adicionar Fornecedor" para criar o seu primeiro parceiro.</p>
                    </div>
                )}
            </div>

            <AddFornecedorModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onFornecedorAdicionado={handleFornecedorAdicionado}
            />
            
            <ProdutosFornecedorModal
                fornecedor={selectedFornecedor}
                onClose={() => setSelectedFornecedor(null)}
            />
        </>
    );
};

export default FornecedoresPage;