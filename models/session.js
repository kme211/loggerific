const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    date: { type: Date, default: Date.now },
    messages: { type: Array, default: [] }
});

sessionSchema.virtual('errors').get(function() {
    return this.messages.filter((message) => /error/i.test(message.body));
});

module.exports = mongoose.model('Session', sessionSchema, 'sessions');