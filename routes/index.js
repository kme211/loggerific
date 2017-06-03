const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(sessionController.getSessions));
router.get('/add-session', sessionController.addSession);
router.post('/add-session', 
  sessionController.formatDate,
  catchErrors(sessionController.createSession)
);
router.get('/session/:id', catchErrors(sessionController.getSessionById));
router.get('/add-message/:sessionId', sessionController.addMessageToSession);
router.post('/add-message', 
  sessionController.addTimestamp, 
  catchErrors(sessionController.createMessage)
);
router.get('/delete-session/:id', catchErrors(sessionController.deleteSession));

module.exports = router;