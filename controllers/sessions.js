const mongoose = require('mongoose');
const Session = mongoose.model('Session');

function getAll({ pageSize, startPage }) {
    return new Promise((resolve, reject) => {
        const count = countAll();
        const sessions = getAllSessions({ pageSize, startPage });
        Promise.all([count, sessions]).then((values) => {
            resolve({
                totalSessions: values[0],
                sessions: values[1]
            });
        })
    });
}

function getAllSessions({ pageSize, startPage }) {
    return new Promise((resolve, reject) => {
        Session
            .find()
            .skip(startPage * pageSize )
            .limit(pageSize)
            .sort({ date: -1 })
            .exec((err, data) => {
                if(err) reject(err);
                const sessions = data.map((session) => {
                    const getError = (message, index) => {
                        const error = /error/i.test(message.body) ? { message: message.body.split('\n')[0], line: index + 1 } : null;
                        return error;
                    };
                    const hasError = (message) => message.error;
                    const getErrors = (messages) => messages.map(getError).filter((error) => error);
                    const errors = getErrors(session.messages);
                    return { id: session._id, date: session.date,  numMessages: session.messages.length, errors };
                });
                resolve(sessions);
            });
    });
}

function countAll() {
    return new Promise((resolve, reject) => {
        Session.count(function(err, count) {
            if(err) reject(err);
            resolve(count);
        });
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