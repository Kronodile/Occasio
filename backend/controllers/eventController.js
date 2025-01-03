const Event = require('../models/eventModel');
const Participant = require('../models/participantModel');

// Event CRUD operations
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const newEvent = await Event.create(req.body);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await Participant.deleteMany({ eventId: req.params.id });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Participant CRUD operations
exports.getParticipants = async (req, res) => {
    try {
        const participants = await Participant.find({ eventId: req.params.eventId });
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerParticipant = async (req, res) => {
    try {
        const participant = await Participant.create({
            ...req.body,
            eventId: req.params.eventId
        });
        res.status(201).json(participant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateParticipant = async (req, res) => {
    try {
        const participant = await Participant.findByIdAndUpdate(
            req.params.participantId,
            req.body,
            { new: true }
        );
        if (!participant) return res.status(404).json({ message: 'Participant not found' });
        res.json(participant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteParticipant = async (req, res) => {
    try {
        const participant = await Participant.findByIdAndDelete(req.params.participantId);
        if (!participant) return res.status(404).json({ message: 'Participant not found' });
        res.json({ message: 'Participant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};