// src/pages/AgendaPage.js

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function AgendaPage({ onPedidoClick }) {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/orcamentos/agendados');
                if (!response.ok) {
                    throw new Error('Não foi possível carregar os agendamentos.');
                }
                const data = await response.json();
                setEventos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEventos();
    }, []);

    const handleEventClick = async (clickInfo) => {
        const pedidoId = clickInfo.event.id;
        try {
            const response = await fetch(`http://localhost:3000/api/orcamentos/${pedidoId}`);
            if(!response.ok) throw new Error('Não foi possível carregar os detalhes do pedido.');
            const pedidoCompleto = await response.json();
            onPedidoClick(pedidoCompleto);
        } catch(err) {
            alert('Erro ao carregar detalhes do pedido.');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">A carregar agenda...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">Erro: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Agenda de Serviços</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={eventos}
                    locale="pt-br"
                    buttonText={{
                        today: 'Hoje',
                        month: 'Mês',
                        week: 'Semana',
                        day: 'Dia'
                    }}
                    height="auto"
                    eventClick={handleEventClick}
                    eventColor="#3b82f6"
                    eventDisplay="block"
                    dayMaxEvents={true}
                />
            </div>
        </div>
    );
}

export default AgendaPage;