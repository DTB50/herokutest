//START WITH: SET DEBUG=helloworld: * | npm start

//require modules from useful node libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsonQuery = require('json-query');
var bodyParser = require("body-parser");

//require modules from routes files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//get body-parser working
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// view engine setup - i.e. specify template library
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//add middleware libraries into request handling chain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//this one serves all static files in the /public directory
app.use(express.static(path.join(__dirname, 'public')));

//define routes for different parts of the site
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//now that everything is fully configured, add it to the module exports
module.exports = app;
