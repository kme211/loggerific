const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    date: { type: Date, default: Date.now },
    messages: { type: Array, default: [] },
    hasError: { type: Boolean, default: false }
});

module.exports = mongoose.model('Session', sessionSchema, 'sessions');