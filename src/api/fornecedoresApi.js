// src/api/fornecedoresApi.js

// --- FORNECEDORES ---
export const fetchFornecedores = async () => {
    const response = await fetch('http://localhost:3000/api/fornecedores');
    if (!response.ok) throw new Error('Não foi possível carregar a lista de fornecedores.');
    return response.json();
};

export const createFornecedor = async (novoFornecedor) => {
    const response = await fetch('http://localhost:3000/api/fornecedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoFornecedor),
    });

    // 👇 A LÓGICA EM FALTA ESTÁ AQUI 👇
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Não foi possível adicionar o fornecedor.');
    }

    return response.json();
}; // <-- E A CHAVE DE FECHO } ESTÁ AQUI

// --- PRODUTOS DE FORNECEDORES ---
export const fetchProdutosPorFornecedor = async (fornecedorId) => {
    if (!fornecedorId) return [];
    const response = await fetch(`http://localhost:3000/api/fornecedores/${fornecedorId}/produtos`);
    if (!response.ok) throw new Error('Não foi possível carregar os produtos deste fornecedor.');
    return response.json();
};

export const createProdutoFornecedor = async ({ fornecedorId, produtoData }) => {
    const response = await fetch(`http://localhost:3000/api/fornecedores/${fornecedorId}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Não foi possível adicionar o produto.');
    }
    return response.json();
};