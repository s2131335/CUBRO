let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');
const passport = require('passport')
require('dotenv').config({ path: `${__dirname}/.env` });

// Routers
let usersRouter = require('./routes/users');
let testingRouter = require('./routes/testing');

//
let app = express();



const bodyParser = require('body-parser')
const session = require('express-session')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET,
  resave: 'false',
  saveUninitialized: 'false'
}))

//Passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
//

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', usersRouter);
app.use('/api/testing', testingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  console.log(err)
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
