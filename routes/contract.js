var mssql = require('mssql');
var express = require('express');
var router = express.Router();

router.get('/:type(credit|deposit)/contract', function(req, res, next) {
  var clients = null;
  var employees = null;
  var rates = null;
  var is_credit = req.url.indexOf("credit") != -1;
  var contract_type = is_credit ? "кредита" : "депозита";
  var failed = false;

  var on_success = function() {
    if (clients != null  && employees != null && rates != null)
    {
      res.render('contract', {
        req: req,
        title: 'Договора',
        clients: clients,
        employees: employees,
        rates: rates,
        contract_type: contract_type
      });
    }
  };

  var on_failed = function() {
    if (!failed) {
      res.render('contract', {
        req: req,
        title: 'Договора',
        clients: [],
        employees: [],
        rates: [],
        contract_type: contract_type
      });
      failed = true;
    }
  }
  
  var request = new mssql.Request();
  request.query('select client_id, surname, name, patronymic from clients')
  .then(function(records) {
    clients = records.recordset
    on_success();
  })
  .catch(on_failed);

  request.query('select emp_id, surname, name, patronymic from employees')
  .then(function(records) {
    employees = records.recordset
    on_success();
  })
  .catch(on_failed);

  var filter = is_credit ? '>' : '<';
  request.query('select rate_id, rate_name, amount, per_rate from rates where amount ' + filter + ' 0')
  .then(function(records) {
    rates = records.recordset
    on_success();
  })
  .catch(on_failed);
});

router.post('/:type(credit|deposit)/contract', function(req, res, next) {
  var url = req.url;
  var is_credit = url.indexOf("credit") != -1;
  var contract_type = is_credit ? "кредита" : "депозита";
  
  var client_id = req.body.client_id;
  var employee_id = req.body.employee_id;
  var rate_id = req.body.rate_id;

  if (!client_id || !employee_id || !rate_id) {
    next({status: 404, message: "Не выбран один или несколько необходимых пунктов"});
    return;
  }

  var request = new mssql.Request();
  request.input('client_id', mssql.Int, client_id);
  request.input('emp_id', mssql.Int, employee_id);
  request.input('rate_id', mssql.Int, rate_id);
  request.execute('make_contract', function (err) {
    console.log(err);
  });

  res.redirect('/' + (is_credit ? "credit/" : "deposit/"));
});

module.exports = router;