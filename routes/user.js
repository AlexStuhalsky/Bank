var express = require('express');
var router = express.Router();
var mssql = require('mssql');

router.get('/user', function(req, res, next) {
  var request = new mssql.Request();
  request.query('select client_id, surname, name, patronymic from clients;')
  .then(function(records) {
    res.render('user', {
      req: req,
      clients: records.recordset,
      title: 'Личный кабинет'
    });
  });
});

router.post('/user', function(req, res, next) { 
  var request = new mssql.Request();
  var type = req.body.type;

  var client_id = req.body.client_id;
  var contract_id = req.body.contract_id;

  var query = "";
  switch(type) {
  case "contracts": 
    query += "select contract_id, rate_name, iif(rate_amount > 0, 'кредит', 'депозит') as rate_type from contracts_view where client_id = " + client_id;
    break;
  case "contract-info":
    query = "select emp_surname, emp_name, emp_patronymic, abs(balance) as balance, rate_name, abs(rate_amount) as rate_amount, per_rate, iif(rate_amount > 0, 'Кредит', 'Депозит') as rate_type from contracts_view where contract_id = " + contract_id;
    break;
  case "pay":
    query += "exec make_payment " + client_id + ", " + contract_id + ", " + req.body.cash + ";";
  case "payments":
    query += "select payment_id, amount, convert(varchar(10), date, 120) as date from payments where client_id = " + client_id + " and contract_id = " + contract_id + ";"; 
    break;
  }

  request.query(query)
  .then(function(records) {
    res.json(records.recordset);
  });
});

module.exports = router;
