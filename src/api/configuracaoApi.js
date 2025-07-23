// src/api/configuracaoApi.js

// Função para buscar a configuração atual
export const getConfiguracao = async () => {
    const response = await fetch('http://localhost:3000/api/configuracoes');
    if (!response.ok) {
        throw new Error('Não foi possível carregar as configurações.');
    }
    return response.json();
};

// Função para atualizar a configuração
export const updateConfiguracao = async (configData) => {
    const response = await fetch('http://localhost:3000/api/configuracoes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Não foi possível guardar as configurações.');
    }
    return response.json();
};