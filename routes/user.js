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

  var query = "";
  switch(type) {
  case "contracts": 
    query = "select contract_id, abs(amount) as amount from contracts where client_id = " + body.req.client_id + ";";
    break;
  }

  request.query(query)
  .then(function(records) {
    res.json(records.recordset);
  });
});

module.exports = router;
