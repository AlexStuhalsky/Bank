var mssql = require('mssql');
var pug = require('pug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var deposit = require('./routes/deposit');
var data = require('./routes/data');
var credit = require('./routes/credit');
var user = require('./routes/user');
var make_contract = require('./routes/contract');
var edit = require('./routes/edit');
var components = require('./routes/components');
var report = require('./routes/report');
var app = express();

//connection string
var config = {
  driver: 'msnodesqlv8',
  server: 'localhost',
  user: 'Alex',
  password: '12345',
  database: 'Bank'
};

mssql.connect(config).then(function () {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // uncomment after placing your favicon in /public
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', index);
  app.use('/', deposit);
  app.use('/', credit);
  app.use('/', data);
  app.use('/', user);
  app.use('/', make_contract);
  app.use('/', edit);
  app.use('/', components);
  app.use('/', report);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Не найдено');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
      req: req
    });
  });
})
.catch(function(err) {
  console.log(err);
});

module.exports = app;
