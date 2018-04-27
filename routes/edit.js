var mssql = require('mssql');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/edit', function(req, res, next) {
  var request = new mssql.Request();

  var rates = null;
  var clients = null;
  var employees = null;
  var departments = null;
  var positions = null;

  var on_success = function() {
    if (rates != null && clients != null && employees != null && departments != null && positions != null) {
      res.render('edit', {
        req: req,
        title: 'Редактирование записей',
        rates: rates,
        clients: clients,
        employees: employees,
        departments: departments,
        positions: positions
      });  
    }
  };

  var failed = false;
  var on_failed = function() {
    if (!failed) {
      res.render('edit', {
        req: req,
        title: 'Редактирование записей',
        rates: [],
        clients: [],
        employees: [],
        departments: [],
        positions: []
      });
      failed = true;
    }
  };

  request.query('select abs(amount) as amount, cast((per_rate * 100) as varchar(3)) + \'%\' as per_rate, rate_name from rates')
  .then(function (records) {
    rates = records.recordset;
    on_success();
  })
  .catch(on_failed);

  request.query('select surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, address from clients')
  .then(function (records) {
    clients = records.recordset;
    on_success();
  })
  .catch(on_failed);
  
  request.query('select surname, name, patronymic, convert(varchar(10), birth_date, 120) as birth_date, dep_id, address, pos_id, pos_name from employees_view')
  .then(function (records) {
    employees = records.recordset;
    on_success();
  })
  .catch(on_failed);
  
  request.query('select dep_id, address from departments')
  .then(function (records) {
    departments = records.recordset;
    on_success();
  })
  .catch(on_failed);

  request.query('select pos_name, salary from positions')
  .then(function (records) {
    positions = records.recordset;
    on_success();
  })
  .catch(on_failed);
});

module.exports = router;
