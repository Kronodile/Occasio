import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    date: '',
    description: ''
  });
  const [participantFormData, setParticipantFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventId: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingParticipant, setEditingParticipant] = useState(null);

  const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://occasio-c51z.onrender.com/api'
  : 'http://localhost:5000/api';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchParticipants = async (eventId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await handleUpdateEvent(e);
      } else {
        await axios.post(`${API_URL}/events`, eventFormData);
        setEventFormData({ name: '', date: '', description: '' });
        fetchEvents();
      }
    } catch (error) {
      console.error('Error with event:', error);
    }
  };

  const handleParticipantSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingParticipant) {
        await handleUpdateParticipant(e);
      } else {
        await axios.post(
          `${API_URL}/events/${participantFormData.eventId}/participants`,
          participantFormData
        );
        setParticipantFormData({ name: '', email: '', phone: '', eventId: '' });
        if (selectedEvent === participantFormData.eventId) {
          fetchParticipants(selectedEvent);
        }
      }
    } catch (error) {
      console.error('Error with participant:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventFormData({
      name: event.name,
      date: event.date.slice(0, 16),
      description: event.description
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/events/${editingEvent._id}`, eventFormData);
      setEditingEvent(null);
      setEventFormData({ name: '', date: '', description: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/events/${eventId}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEditParticipant = (participant) => {
    setEditingParticipant(participant);
    setParticipantFormData({
      name: participant.name,
      email: participant.email,
      phone: participant.phone,
      eventId: participant.eventId
    });
  };

  const handleUpdateParticipant = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/events/${participantFormData.eventId}/participants/${editingParticipant._id}`,
        participantFormData
      );
      setEditingParticipant(null);
      setParticipantFormData({ name: '', email: '', phone: '', eventId: '' });
      if (selectedEvent === participantFormData.eventId) {
        fetchParticipants(selectedEvent);
      }
    } catch (error) {
      console.error('Error updating participant:', error);
    }
  };

  const handleDeleteParticipant = async (eventId, participantId) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      try {
        await axios.delete(`${API_URL}/events/${eventId}/participants/${participantId}`);
        // Clear editing state if the deleted participant was being edited
        if (editingParticipant && editingParticipant._id === participantId) {
          setEditingParticipant(null);
          setParticipantFormData({ name: '', email: '', phone: '', eventId: '' });
        }
        fetchParticipants(eventId);
      } catch (error) {
        console.error('Error deleting participant:', error);
      }
    }
  };

  const handleEventChange = (e) => {
    setEventFormData({
      ...eventFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleParticipantChange = (e) => {
    setParticipantFormData({
      ...participantFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEventSelect = (eventId) => {
    if (selectedEvent === eventId) {
      setSelectedEvent(null);
      setParticipants([]);
    } else {
      setSelectedEvent(eventId);
      setParticipantFormData({ ...participantFormData, eventId });
      fetchParticipants(eventId);
    }
  };

  return (
    <div className="container">
      <h1>Event Manager</h1>
      <div className="content-wrapper">
      {/* Event Creation Form */}
      <div className="form-section">
        <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleEventSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={eventFormData.name}
              onChange={handleEventChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="datetime-local"
              name="date"
              value={eventFormData.date}
              onChange={handleEventChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="description"
              placeholder="Event Description"
              value={eventFormData.description}
              onChange={handleEventChange}
              required
            />
          </div>
          <button type="submit">{editingEvent ? 'Update Event' : 'Create Event'}</button>
        </form>
      </div>

      {/* Participant Registration Form */}
      <div className="form-section">
        <h2>{editingParticipant ? 'Edit Participant' : 'Register for Event'}</h2>
        <form onSubmit={handleParticipantSubmit}>
          <div className="form-group">
            <select 
              name="eventId" 
              value={participantFormData.eventId}
              onChange={handleParticipantChange}
              required
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Participant Name"
              value={participantFormData.name}
              onChange={handleParticipantChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={participantFormData.email}
              onChange={handleParticipantChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={participantFormData.phone}
              onChange={handleParticipantChange}
              required
            />
          </div>
          <button type="submit">{editingParticipant ? 'Update Participant' : 'Register'}</button>
        </form>
      </div>

      {/* Events and Participants Display */}
      <div className="events-section">
        <h2>Events</h2>
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p>{new Date(event.date).toLocaleString()}</p>
              <p>{event.description}</p>
              <div className="button-group">
                <button onClick={() => handleEventSelect(event._id)}>
                  {selectedEvent === event._id ? 'Hide Participants' : 'View Participants'}
                </button>
                <button onClick={() => handleEditEvent(event)}>Edit</button>
                <button onClick={() => handleDeleteEvent(event._id)} className="delete-btn">Delete</button>
              </div>
              {selectedEvent === event._id && (
                <div className="participants-list">
                  <h4>Registered Participants</h4>
                  {isLoading ? (
                    <p>Loading participants...</p>
                  ) : participants.length === 0 ? (
                    <p>No participants registered yet.</p>
                  ) : (
                    participants.map((participant) => (
                      <div key={participant._id} className="participant-item">
                        <p>Name: {participant.name}</p>
                        <p>Email: {participant.email}</p>
                        <p>Phone: {participant.phone}</p>
                        <div className="button-group">
                          <button onClick={() => handleEditParticipant(participant)}>Edit</button>
                          <button 
                            onClick={() => handleDeleteParticipant(event._id, participant._id)} 
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
