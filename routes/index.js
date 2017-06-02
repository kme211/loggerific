const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/', sessionController.getSessions);
router.get('/add-session', sessionController.addSession);
router.post('/add-session', 
  sessionController.formatDate,
  sessionController.createSession
);
router.get('/session/:id', sessionController.getSessionById);
router.get('/add-message/:sessionId', sessionController.addMessageToSession);
router.post('/add-message', 
  sessionController.addTimestamp, 
  sessionController.createMessage
);

module.exports = router;