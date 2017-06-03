const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const promisify = require('es6-promisify');
const PAGE_SIZE = 15;

exports.getSessions = async (req, res) => {
  const pageNum = req.query.page || 1;
  const count = promisify(Session.count, Session)
  const totalSessionsPromise = count();
  let conditions = {};
  if(req.query.errorsOnly) conditions.hasError = true; // removed hasError so need to find where errors.length > 0
  const sessionsPromise = Session
    .find(conditions)
    .skip((pageNum - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .sort({ date: -1 });
  const [totalSessions, sessions] = await Promise.all([totalSessionsPromise, sessionsPromise]);
  const totalPages = Math.ceil(totalSessions / PAGE_SIZE);
  res.render('sessions', {
    title: 'Sessions',
    pageNum,
    totalPages,
    totalSessions,
    sessions
  });
};

exports.formatDate = (req, res, next) => {
  const [year, month, date] = req.body.date.split('-');
  req.body.date = new Date(+year, +month - 1, +date);
  next();
}

exports.addSession = (req, res) => {
  res.render('addSession', { title: 'Add session' });
}

exports.createSession = async (req, res) => {
  const session = await (new Session(req.body)).save();
  req.flash('success', 'Session created!');
  res.redirect(`/session/${session._id}`);
};

exports.getSessionById = async (req, res) => {
  const session = await Session.findById(req.params.id);
  res.render('session', { title: 'Session', session });
};

exports.addMessageToSession = (req, res) => {
  res.render('addMessage', { title: 'Add message', sessionId: req.params.sessionId });
}

exports.addTimestamp = (req, res, next) => {
  req.body.timestamp = new Date();
  next();
};

exports.createMessage = async (req, res, next) => {
  console.log('createMessage', req.body.sessionId)
  const session = await Session.find({ _id: req.body.sessionId });
  if(!session) {
    console.log('no session found!');
    req.flash('error', 'That session doesn\'t exist!');
    res.redirect('/');
    return;
  }
  console.log('ehh')
  req.body.line = session.messages.length + 1;
  session.messages = session.messages.concat(req.body);
  await session.save();
  res.redirect('/session/' + req.body.sessionId);
};

exports.deleteSession = async (req, res) => {
  const session = await Session.findByIdAndRemove(req.params.id);
  req.flash('success', 'Session removed!');
  res.redirect('/');
}