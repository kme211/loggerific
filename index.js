require('dotenv').config();
const fs = require('fs');
const path = require('path');
const join = require('path').join
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const models = join(__dirname, 'models');
const getFormattedDate = require('./getFormattedDate');
// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

const port = process.env.PORT || 3000;
var db = mongoose.connection;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

const ENV = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
mongoose.connect(process.env[`DATABASE_${ENV}`]);

app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

app.use('/', routes);

if (ENV === 'DEV') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// app.get('/', function(req, res) {
  
//   sessions.getAll({ pageSize: pageSize, startPage: 0 }).then((data) => {
//     const totalPages = Math.ceil(data.totalSessions / pageSize);
//     res.render('index.html', {
//       pageNum: 1,
//       totalPages: totalPages,
//       totalSessions: data.totalSessions,
//       sessions: data.sessions
//     });
//   });
// });

// app.get('/page/:page', function(req, res) {
//   const pageNum = req.params.page;
//   sessions.getAll({ pageSize: pageSize, startPage: +pageNum - 1 }).then((data) => {
//     const totalPages = Math.ceil(data.totalSessions / pageSize);
//     res.render('index.html', {
//       pageNum: pageNum,
//       totalPages: totalPages,
//       totalSessions: data.totalSessions,
//       sessions: data.sessions.map(session => {
//         return Object.assign({}, session, { date: getFormattedDate(session.date) });
//       })
//     });
//   });
// });

// app.get('/errors', function(req, res) {
//   sessions.getAllWithErrors().then((sessions) => {
//     res.render('errors.html', {
//       totalSessions: sessions.length,
//       sessions: sessions.map(session => {
//         return Object.assign({}, session, { date: getFormattedDate(session.date) });
//       })
//     });
//   });
// });

// app.get('/session/:id', function(req, res) {
//   const sessionId = req.params.id;
//   sessions.getById(sessionId, (err, session) => {
//     res.render('session.html', {
//       error: err,
//       messages: session.messages.map(message => {
//         return Object.assign({}, message, { date: getFormattedDate(message.date) });
//       }),
//       date: session.date
//     });
//   });
// });

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Connected to ${ENV} database`);
  app.listen(port, function () {
    console.log(`Loggerific listening on http://localhost:${port}/`);
  });
});
