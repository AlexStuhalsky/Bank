var mssql = require('mssql');
var express = require('express');
var router = express.Router();

router.get('/info', function(req, res, next) {
  res.render('info', {
    req: req,
    title: 'Справка'
  });
});

router.post('/info', function(req, res, next) {
  var type = req.body.type;
  var request = new mssql.Request();

  console.log(type);
  if (type == "clients") {
    request.query('select surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, address, balance from clients')
    .then(function(records) {
      res.json(records.recordset);
    });
  }
  else if (type == "employees") {
    request.query('select surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, address, pos_name from employees_view')
    .then(function(records) {
      res.json(records.recordset);
    });
  }
  else if (type == "rates") {
    request.query('select abs(amount) as amount, cast((per_rate * 100) as varchar(3)) + \'%\' as per_rate, rate_name from rates')
    .then(function(records) {
      res.json(records.recordset);
    });
  }
  else if (type == "departments") {
    request.query('select dep_id, address from departments')
    .then(function(records) {
      res.json(records.recordset);
    });
  }
  else if (type == "positions") {
    request.query('select pos_name, salary from positions')
    .then(function(records) {
      res.json(records.recordset);
    });
  }
});

module.exports = router;
