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

const port = process.env.PORT || 3000;
var db = mongoose.connection;

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

const sessions = require('./controllers/sessions');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds151070.mlab.com:51070/${process.env.DB_HOST}`);

app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use('/api', require('./routes/api'));

app.get('/', function(req, res) {
  sessions.getAll((err, sessions) => {
    res.render('index.html', {
      error: err,
      sessions: sessions
    });
  });
});

app.get('/session/:id', function(req, res) {
  const sessionId = req.params.id;
  sessions.getById(sessionId, (err, session) => {
    res.render('session.html', {
      error: err,
      messages: session.messages.map(message => {
        const date = new Date(message.date);
        const leftPad = (num) => {
          num = num.toString();
          if(num.length === 1) {
            return '0' + num;
          } else {
            return num;
          }
        }
        const formattedDate = `${leftPad(date.getMonth() + 1)}/${leftPad(date.getDate())}/${date.getFullYear()} @ ${leftPad(date.getHours() + 1)}:${leftPad(date.getMinutes())}`
        return Object.assign({}, message, { date: formattedDate });
      }),
      date: session.date
    });
  });
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Connected to db ${process.env.DB_HOST}`);
  app.listen(port, function () {
    console.log(`Loggerific listening on port ${port}!`);
  });
});
