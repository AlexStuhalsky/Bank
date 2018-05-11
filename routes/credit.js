var mssql = require('mssql');
var express = require('express');
var router = express.Router();

router.get('/credit/', function(req, res, next) {
  res.render('credit', {
    req: req,
    title: 'Кредиты'
  });
});

router.post('/credit/', function(req, res, next) {
  var request = new mssql.Request();
  var query = 'select contract_id, client_surname, client_name, client_patronymic, ' + 
              'emp_surname, emp_name, emp_patronymic, rate_name, rate_amount, per_rate, ' + 
              'balance, convert(varchar(10), date, 120) as date, address from contracts_view where rate_amount > 0';
  request.query(query)
  .then(function (records) {
      res.json(records.recordset);
  });
});

module.exports = router;
