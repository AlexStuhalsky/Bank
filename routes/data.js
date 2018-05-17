var mssql = require('mssql');
var express = require('express');
var router = express.Router();

router.get('/data', function(req, res, next) {
  res.render('data', {
    req: req,
    title: 'Справка'
  });
});

router.post('/data', function(req, res, next) {
  var type = req.body.type;
  var request = new mssql.Request();
  var query = "";

  switch (type) {
  case "clients":
    query = 'select surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, address, balance from clients';
    break;
  case "employees":
    query = 'select surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, address, pos_name from employees_view';
    break;
  case "deposits":
    query = "select rate_id as data_id, rate_name, abs(amount) as amount, cast((per_rate * 100) as varchar(3)) + '%' as per_rate from rates where amount < 0;";
    break;
  case "credits":
    query = "select rate_id as data_id, rate_name, amount, cast((per_rate * 100) as varchar(3)) + '%' as per_rate from rates where amount > 0;";
    break;
  case "departments":
    query = 'select dep_id, address from departments';
    break;
  case "positions":
    query = 'select pos_name, salary from positions';
    break;
  }

  request.query(query)
  .then(function(records) {
    res.json(records.recordset);
  });
});

module.exports = router;
