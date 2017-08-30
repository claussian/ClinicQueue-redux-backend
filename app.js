import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import lessMiddleware from 'less-middleware';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import cloudinary from 'cloudinary';
import passportSocketIo from "passport.socketio";

/* import routes to make them available to app */
import auth from './routes/auth';
import index from './routes/index';
import queueRoutes from './routes/queueRoutes';

// Configure .env path
dotenv.load({path: '.env'});

// Configure twilio
export const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

/*
* Setting up database
*/
mongoose.Promise = global.Promise;
mongoose.connect(process.env.REMOTEDB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const app = express();

/*
* Port setup
*/
app.set('port', process.env.PORT || 80);

/*
* Sockect.io initialize
*/
const server = require('http').Server(app);
const io = require('socket.io')(server);

const debug = Debug('clinic-queue-redux-backend:app');

/**
 * Passport configuration.
 */
const passportConfig = require('./config/passport');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/* Setting up session collection in mongodb */
const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({
  url: process.env.REMOTEDB_URI,
  autoReconnect: true,
  clear_interval: 3600
});

const Session = session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  cookieParser: cookieParser
});

app.use(Session);

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       process.env.SESSION_SECRET,    // the session_secret to parse the cookie
  store:        sessionStore,
  success:      onAuthorizeSuccess,  // callback on success
  fail:         onAuthorizeFail,     // callback on fail/error
}));

function onAuthorizeFail(data, message, error, accept) {
  console.log('Connection Failed to socket.io ', error, message);
  accept(null, false);
}

/**
 * Function: onAuthorizeSuccess
 * Purpose: if authorization succeeds, console log success message
 * Used in: io.use(passportSocketIo.authorize()) function
 */
function onAuthorizeSuccess(data, accept) {
  console.log('Successful connection to socket.io with user');
  accept(null, true);
}

/* Make passport available to app. Passport will update user session with user info on authentication */
app.use(passport.initialize());
app.use(passport.session());

/* routes are made available to app */
app.use('/auth', auth);
app.use('/queue', queueRoutes);

/* setting up socketio connection in routes */
const socketIO = require('./routes/websocket')(io);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});

/**
 * Start Express server.
 */
server.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:' + app.get('port')); 
});

export default app;
