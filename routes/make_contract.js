var mssql = require('mssql');
var express = require('express');
var router = express.Router();

var clients = [
  { surname: "Петров", name: "Иван", patronymic: "Анатолиевич" },
  { surname: "Сидоров", name: "Дмитрий", patronymic: "Владимирович" },
  { surname: "Успенская", name: "Анна", patronymic: "Петолвна" }
]
var employees = [
  { surname: "Романенко", name: "Роман", patronymic: "Александрович" },
  { surname: "Стухальский", name: "Алексей", patronymic: "Леонидович" },
  { surname: "Васильев", name: "Иван", patronymic: "Петрович" }
]
var rates = [
  { name: "Лёгкий", amount: "1000", per_rate: "0.05" },
  { name: "Средний", amount: "2000", per_rate: "0.03" },
  { name: "Тяжёлый", amount: "3000", per_rate: "0.01" }
]

router.get('/:type(credit|deposit)/new', function(req, res, next) {
  //var clients = null;
  //var employees = null;
  //var rates = null;
  var contract_type = req.url.indexOf("credit") != -1 ? "кредита" : "депозита";
  var failed = false;

  var on_success = function() {
    if (clients != null && employees != null && rates != null)
    {
      res.render('make_contract', {
        title: 'Договора',
        clients: clients,
        employees: employees,
        rates: rates,
        contract_type: contract_type
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
        rates: [],
        contract_type: contract_type
      });
      failed = true;
    }
  }
  
  on_success();
  //var request = new mssql.Request();
  //// request.query('select * from contracts_view where rate_amount < 0')
  //request.query('select surname, name, patronymic from clients')
  //.then(function(records) {
  //  clients = records.recordset
  //  on_success();
  //})
  //.catch(on_failed);

  //request.query('######### Get employees ############')
  //.then(function(records) {
  //  employees = records.recordset
  //  on_success();
  //})
  //.catch(on_failed);

  //request.query('############# Get rates #############')
  //.then(function(records) {
  //  rates = records.recordset
  //  on_success();
  //})
  //.catch(on_failed);
});

router.post('/:type(credit|deposit)/new', function(req, res, next) {
  res.send("еххехее");
});

module.exports = router;