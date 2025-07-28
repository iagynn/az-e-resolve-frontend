import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import apiClient from '../api/apiClient';

const localizer = momentLocalizer(moment);

// --- COMPONENTE DO MODAL (sem alterações) ---
const EventModal = ({ isOpen, onClose, selectedSlot, onCreateEvent }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle) {
      setError('O título do evento é obrigatório.');
      return;
    }
    
    setError('');
    setMessage('');

    try {
      const successMessage = await onCreateEvent({ title: eventTitle, description: eventDesc });
      setMessage(successMessage);
      
      setTimeout(() => {
        setEventTitle('');
        setEventDesc('');
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Falha ao criar o evento.');
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h2>Criar Novo Evento</h2>
        <p>
          <strong>Início:</strong> {moment(selectedSlot?.start).format('DD/MM/YYYY HH:mm')}
        </p>
        <p>
          <strong>Fim:</strong> {moment(selectedSlot?.end).format('DD/MM/YYYY HH:mm')}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título do evento"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            style={modalStyles.input}
            autoFocus
            required
          />
          <textarea
            placeholder="Descrição do evento (opcional)"
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
            style={{...modalStyles.input, height: '80px'}}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <div>
            <button type="submit" style={{...modalStyles.button, backgroundColor: '#28a745', color: 'white'}}>
              Criar Evento
            </button>
            <button type="button" onClick={onClose} style={{...modalStyles.button, backgroundColor: '#6c757d', color: 'white'}}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const AgendaPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // --- CORREÇÃO: Adicionados estados para controlar o calendário ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  const handleCreateEvent = async ({ title, description }) => {
    if (!title || !selectedSlot) {
      throw new Error("Título ou horário não selecionado.");
    }

    const eventData = {
      summary: title,
      description: description,
      startDateTime: selectedSlot.start.toISOString(),
      endDateTime: selectedSlot.end.toISOString(),
    };

    try {
      const response = await apiClient.post('/google/create-event', eventData);
      
      const newEvent = {
          title: title,
          start: selectedSlot.start,
          end: selectedSlot.end,
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);

      return response.data.message || 'Evento criado com sucesso!';
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Falha ao criar o evento. Verifique se está autenticado com o Google.');
    }
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSlot={selectedSlot}
        onCreateEvent={handleCreateEvent}
      />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 20px)' }}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        
        // --- CORREÇÃO: Passando o estado e atualizando-o nos callbacks ---
        view={currentView}
        date={currentDate}
        onView={(view) => setCurrentView(view)}
        onNavigate={(date) => setCurrentDate(date)}
        
        messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
        }}
      />
    </div>
  );
};

// Estilos para o Modal
const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  content: {
    background: '#fff', padding: '2rem', borderRadius: '8px',
    width: '90%', maxWidth: '500px', color: '#333',
  },
  input: {
    width: '100%', padding: '8px', marginBottom: '1rem',
    borderRadius: '4px', border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px', border: 'none', borderRadius: '4px',
    cursor: 'pointer', marginRight: '10px',
  }
};

export default AgendaPage;
