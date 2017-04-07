const mongoose = require('mongoose');
const Session = mongoose.model('Session');

function getAll(callback) {
    Session.
    find().
    limit(10).
    sort({ date: -1 }).
    exec((err, sessions) => {
      if(err) return callback(err);
      callback(null, sessions.map((session) => {
          const getError = (message, index) => {
            const error = /error/i.test(message.body) ? { message: message.body.split('\n')[0], line: index + 1 } : null;
            return error;
          };
          const hasError = (message) => message.error;
          const getErrors = (messages) => messages.map(getError).filter((error) => error);
          const errors = getErrors(session.messages);
          return { id: session._id, date: session.date,  numMessages: session.messages.length, errors };
        }));
    });
}

function getById(id, callback) {
    Session.findById(id, (err, session) => {
        if(err) return callback(err);
        if(!session) if(err) return callback(`Session with id ${sessionId} not found`);
        callback(null, session);
    });
}

function getNew(callback) {
    var session = new Session;
    session.save((err, session) => {
        if(err) return callback(err);
        callback(null, session);
    });
}

module.exports = {
    getAll: getAll,
    getById: getById,
    getNew: getNew
};