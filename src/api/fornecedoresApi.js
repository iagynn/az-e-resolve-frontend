// src/api/fornecedoresApi.js

export const createFornecedor = async (novoFornecedor) => {
    const response = await fetch('http://localhost:3000/api/fornecedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoFornecedor),
    });

    if (!response.ok) {
        // Se o servidor devolver um erro, tentamos ler a mensagem de erro
        const errorData = await response.json();
        throw new Error(errorData.message || 'Não foi possível adicionar o fornecedor.');
    }

    return response.json();
};