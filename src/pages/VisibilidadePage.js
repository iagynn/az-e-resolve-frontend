// src/pages/VisibilidadePage.js

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from '../components/ui/Button.jsx';
import { toast } from 'react-hot-toast';

// Função para buscar as coordenadas do seu backend
const fetchCoordenadas = async () => {
    const response = await fetch('http://localhost:3000/api/dashboard/pedidos-coordenadas');
    if (!response.ok) {
        throw new Error('Não foi possível carregar os dados do mapa.');
    }
    return response.json();
}

const MapaDeDemanda = ({ onPedidoClick }) => {
    const [selected, setSelected] = useState(null);
    
    // Ponto central inicial (pode ser ajustado para a sua região)
    const center = { lat: -23.55052, lng: -46.633308 }; 
    const containerStyle = {
        width: '100%',
        height: '60vh',
        borderRadius: 'var(--radius)'
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "SUA_CHAVE_DE_API_DO_Maps_AQUI" // Lembre-se de colocar a sua chave aqui
    });

    const { data: coordenadas, isLoading, error } = useQuery({
        queryKey: ['coordenadasPedidos'],
        queryFn: fetchCoordenadas,
    });

    // Função para buscar o pedido completo antes de abrir o modal
    const fetchPedidoCompleto = useCallback(async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${id}`);
            if (!response.ok) throw new Error("Não foi possível carregar os detalhes do pedido.");
            const data = await response.json();
            onPedidoClick(data);
        } catch (err) {
            toast.error(err.message);
        }
    }, [onPedidoClick]);


    if (error) return <p className="text-destructive text-center py-8">Erro: {error.message}</p>;
    if (!isLoaded || isLoading) return (
        <div style={containerStyle} className="flex items-center justify-center bg-secondary rounded-lg">
            <p className="text-muted-foreground">A carregar mapa e dados...</p>
        </div>
    );

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            options={{
                disableDefaultUI: true, // Remove controlos desnecessários para um visual mais limpo
                zoomControl: true,
            }}
        >
            {coordenadas && coordenadas.map((pedido) => (
                <Marker 
                    key={pedido._id} 
                    position={{ lat: pedido.lat, lng: pedido.lng }}
                    onClick={() => setSelected(pedido)}
                />
            ))}

            {selected && (
                <InfoWindow
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => setSelected(null)}
                >
                    <div className="p-1 text-center">
                        <h4 className="font-bold text-foreground">Pedido #{selected.shortId}</h4>
                        <Button 
                            size="sm" 
                            variant="link" 
                            className="p-0 h-auto mt-1" 
                            onClick={() => fetchPedidoCompleto(selected._id)}
                        >
                            Ver Detalhes
                        </Button>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

const VisibilidadePage = ({ onPedidoClick }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Visibilidade de Mercado</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Mapa de Atividade</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Visualize a concentração dos seus pedidos para identificar áreas de alta demanda. Clique num marcador para ver os detalhes.
                    </p>
                    <MapaDeDemanda onPedidoClick={onPedidoClick} />
                </CardContent>
            </Card>
        </div>
    );
};

export default VisibilidadePage;