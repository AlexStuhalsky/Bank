var mssql = require('mssql');
var express = require('express');
var router = express.Router();

router.get('/deposit/', function(req, res, next) {
  var request = new mssql.Request();
  request.query('select * from contracts_view where rate_amount < 0')
  .then(function (records) {
      res.render('deposit', {
        req: req,
        title: 'Депозиты',
        data: records.recordset
      });
  })
  .catch(function(err) {
      console.log(err);
      res.render('deposit', {
        req: req,
        title: 'Депозиты',
        data: []
      });
  });
});

module.exports = router;
