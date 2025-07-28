import axios from 'axios';

// 1. Cria uma instância do Axios com a URL base da sua API.
const apiClient = axios.create({
  // Use uma variável de ambiente para a URL da API, ou o localhost como fallback.
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. (Opcional, mas recomendado) Adiciona um "interceptor" para incluir o token de autenticação
//    em todas as requisições, caso ele exista no localStorage.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ou de onde quer que você pegue o token
    if (token) {
      // Adiciona o cabeçalho de autorização
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Trata erros na configuração da requisição
    return Promise.reject(error);
  }
);

// 3. Exporta a instância configurada como padrão.
//    Esta é a linha mais importante para resolver os erros de importação.
export default apiClient;
