const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ColorHash = require('color-hash');
const passport = require('passport');
const webSocket = require('./socket');

require('dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const mainRouter = require('./routes/main');
const testRouter = require('./routes/test');

var connect = require('./schemas');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
connect();

const sessionMiddleware = session(
{
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: 
  {
    httpOnly: true,
    secure: false,
  },
});

sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>
{
  if(!req.session.color)
  {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/main', mainRouter);
app.use('/test', testRouter);


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => 
{
  console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server, app, sessionMiddleware);


