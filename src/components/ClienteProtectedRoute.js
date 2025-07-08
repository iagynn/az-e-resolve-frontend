import React from 'react';
import { Navigate } from 'react-router-dom';

const ClienteProtectedRoute = ({ children }) => {
    // Verificamos se o token do cliente está guardado no localStorage
    const token = localStorage.getItem('clienteToken');

    if (!token) {
        // Se NÃO houver token, redirecionamos para a página de login
        return <Navigate to="/cliente/login" />;
    }

    // Se houver um token, mostramos a página que está protegida (os children)
    return children;
};

export default ClienteProtectedRoute;