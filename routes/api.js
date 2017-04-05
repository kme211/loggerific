const express = require('express');
const router = express.Router();
const handleError = require('../handleError');
const sessions = require('../controllers/sessions');

router.get('/session', function(req, res) {
  sessions.getNew((err, session) => {
    if(err) return handleError(res, err);
    res.json({ id: session._id });
  });
});

router.get('/session/:id', function(req, res) {
  const sessionId = req.params.id;
  sessions.getById(sessionId, (err, session) => {
    if(err) return handleError(res, err);
    if(!session) return handleError(res, `Session with id ${sessionId} not found`);
    res.json({
        id: session._id,
        messages: session.messages,
        date: session.date
    });
  });
});

router.get('/sessions', function(req, res) {
  sessions.getAll((err, sessions) => {
    if(err) return handleError(res, err);
    res.json({ sessions: sessions });
  });
});

router.post('/log', function (req, res) {
  if(!req.body.messages) return handleError(res, 'no messages found in body');
  if(!req.body.sessionId) return handleError(res, 'no sessionId found in body');
  const messages = req.body.messages;
  const sessionId = req.body.sessionId;

  sessions.getById(sessionId, (err, session) => {
    if(err) return handleError(res, err);
    if(!session) return handleError(res, `Session with id ${sessionId} not found`);
    session.messages = session.messages.concat(messages);
    session.save((err) => {
      if(err) return handleError(res, err);
      res.json({ message: 'messages saved successfully' });
    });
  });
});

module.exports = router;