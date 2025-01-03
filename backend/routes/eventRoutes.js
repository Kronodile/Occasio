const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Event routes
router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Participant routes
router.get('/:eventId/participants', eventController.getParticipants);
router.post('/:eventId/participants', eventController.registerParticipant);
router.put('/:eventId/participants/:participantId', eventController.updateParticipant);
router.delete('/:eventId/participants/:participantId', eventController.deleteParticipant);

module.exports = router;