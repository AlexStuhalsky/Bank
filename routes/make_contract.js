var mssql = require('mssql');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/make_contract', function(req, res, next) {
  var clients = null;
  var employees = null;
  var rates = null;
  var failed = false;

  var on_success = function() {
    if (clients != null && employees != null && rates != null)
    {
      res.render('make_contract', {
        title: 'Договора',
        clients: clients.recordset,
        employees: employees.recordset,
        rates: rates.recordset
      });
    }
  };

  var on_failed = function() {
    if (!failed)
    {
      res.render('make_contract', {
        title: 'Договора',
        clients: [],
        employees: [],
        rates: []
      });
      failed = true;
    }
  }

  var request = new mssql.Request();
  // request.query('select * from contracts_view where rate_amount < 0')
  request.query('select surname, name, patronymic from clients')
  .then(function(records) {
    clients = records.recordset
    on_success();
  })
  .catch(on_failed);

  request.query('select surname, name, patronymic from clients')
  .then(function(records) {
    clients = records.recordset
    on_success();
  })
  .catch(on_failed);

  request.query('select surname, name, patronymic from clients')
  .then(function(records) {
    clients = records.recordset
    on_success();
  })
  .catch(on_failed);
});

module.exports = router;
