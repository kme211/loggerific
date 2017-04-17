require('dotenv').config();
const fs = require('fs')
const join = require('path').join
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const models = join(__dirname, 'models');
const nunjucks = require('nunjucks');
const getFormattedDate = require('./getFormattedDate');

const port = process.env.PORT || 3000;
var db = mongoose.connection;

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

const sessions = require('./controllers/sessions');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`);

app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use('/api', require('./routes/api'));

const pageSize = 15;

app.get('/', function(req, res) {
  
  sessions.getAll({ pageSize: pageSize, startPage: 0 }).then((data) => {
    const totalPages = Math.ceil(data.totalSessions / pageSize);
    res.render('index.html', {
      pageNum: 1,
      totalPages: totalPages,
      totalSessions: data.totalSessions,
      sessions: data.sessions.map(session => {
        return Object.assign({}, session, { date: getFormattedDate(session.date) });
      })
    });
  });
});

app.get('/page/:page', function(req, res) {
  const pageNum = req.params.page;
  sessions.getAll({ pageSize: pageSize, startPage: +pageNum - 1 }).then((data) => {
    const totalPages = Math.ceil(data.totalSessions / pageSize);
    res.render('index.html', {
      pageNum: pageNum,
      totalPages: totalPages,
      totalSessions: data.totalSessions,
      sessions: data.sessions.map(session => {
        return Object.assign({}, session, { date: getFormattedDate(session.date) });
      })
    });
  });
});

app.get('/errors', function(req, res) {
  sessions.getAllWithErrors().then((sessions) => {
    res.render('errors.html', {
      totalSessions: sessions.length,
      sessions: sessions.map(session => {
        return Object.assign({}, session, { date: getFormattedDate(session.date) });
      })
    });
  });
});

app.get('/session/:id', function(req, res) {
  const sessionId = req.params.id;
  sessions.getById(sessionId, (err, session) => {
    res.render('session.html', {
      error: err,
      messages: session.messages.map(message => {
        return Object.assign({}, message, { date: getFormattedDate(message.date) });
      }),
      date: session.date
    });
  });
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Connected to db ${process.env.DB_HOST}`);
  app.listen(port, function () {
    console.log(`Loggerific listening on http://localhost:${port}/`);
  });
});
