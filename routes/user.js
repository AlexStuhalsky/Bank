var express = require('express');
var router = express.Router();

var clients = [
  { surname: "Петров", name: "Иван", patronymic: "Анатолиевич" },
  { surname: "Сидоров", name: "Дмитрий", patronymic: "Владимирович" },
  { surname: "Успенская", name: "Анна", patronymic: "Петолвна" }
]

router.get('/user', function(req, res, next) {
  res.render('user', {
    req: req,
    clients: clients,
    title: 'Личный кабинет'
  });
});

var contracts = [
  { surname: "Петров", name: "Иван", patronymic: "Анатолиевич", contract_type: "Лёкгий" },
  { surname: "Сидоров", name: "Дмитрий", patronymic: "Владимирович", contract_type: "Средний"  },
  { surname: "Успенская", name: "Анна", patronymic: "Петолвна", contract_type: "Тяжёлый" }
] 

router.post('/user', function(req, res, next) {
  var surname = req.body.surname;
  var name = req.body.name;
  var patronymic = req.body.patronymic;

  var result = [];
  for(var c of clients) {
    if (c.surname == surname && c.name == name && c.patronymic == patronymic) {
      result.push(c);
    }
  }

  res.json(result);
});

module.exports = router;
