var express = require('express');
var router = express.Router();

router.get('/info', function(req, res, next) {
  res.render('info', {
    req: req,
    title: 'Справка'
  });
});

// var clients = [
//   { surname: "Сидоров", name: "Александр", patronymic: "Петрович", birth_date: "20-04-1987", address: "Минск", balance: "0" },
//   { surname: "Валерьянов", name: "Антон", patronymic: "Артёмович", birth_date: "13-07-1989", address: "Брест", balance: "0" },
//   { surname: "Куйбышев", name: "Эдуард", patronymic: "Эльжендович", birth_date: "31-12-1980", address: "Гомель", balance: "100" }
// ];

// var employees = [
//   { surname: 'Романенко', name: 'Роман', patronymic: 'Александрович', birth_date: '08-08-1997', address: 'Минск', pos_name: "Клерк" },
//   { surname: 'Стухальский', name: 'Алексей', patronymic: 'Леонидович', birth_date: '31-08-1998', address: 'Брест', pos_name: "Сисадмин" },
//   { surname: 'Васильев', name: 'Иван', patronymic: 'Петрович', birth_date: '19-01-1986', address: 'Гомель', pos_name: "Начальник отдела" }
// ];

// var rates = [
//   { amount: "1000", per_rate: "3%", rate_name: "Лёгкий" },
//   { amount: "2000", per_rate: "2%", rate_name: "Средний" },
//   { amount: "3000", per_rate: "1%", rate_name: "Тяжелый" }
// ];

// var departments = [
//   { address: "Минск" },
//   { address: "Брест" },
//   { address: "Гомель" }
// ];

// var positions = [
//   { pos_name: "Клерк", salary: "250" },
//   { pos_name: "Сисадмин", salary: "700" },
//   { pos_name: "Начальник отдела", salary: "900" }
// ];

router.post('/info', function(req, res, next) {
  var type = req.body.type;
  var request = new mssql.Request();
  var result = [];

  console.log(type);
  if (type == "clients") {
    // result = clients;
    request.query('select surname, name, patronymic, birth_date, address, balance from clients')
    .then(function(records) {
      result = records.recordset;
      console.log(result);
      res.json(result);
    });
  }
  else if (type == "employees") {
    // result = employees;
    request.query('select surname, name, patronymic, birth_date, address, pos_name from employees_view')
    .then(function(records) {
      result = records.recordset;
      console.log(result);
      res.json(result);
    });
  }
  else if (type == "rates") {
    // result = rates;
    request.query('select amount, per_rate, rate_name from rates')
    .then(function(records) {
      result = records.recordset;
      console.log(result);
      res.json(result);
    });
  }
  else if (type == "departments") {
    // result = departments;
    request.query('select dep_id, address from departments')
    .then(function(records) {
      result = records.recordset;
      console.log(result);
      res.json(result);
    });
  }
  else if (type == "positions") {
    // result = positions;
    request.query('select pos_name, salary from positions')
    .then(function(records) {
      result = records.recordset;
      console.log(result);
      res.json(result);
    });
  }
});

module.exports = router;
