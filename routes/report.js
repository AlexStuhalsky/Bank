var express = require('express');
var router = express.Router();

router.get('/report', function(req, res, next) {
  res.render('report', {
    req: req,
    title: 'Отчёт'
  });
});

module.exports = router;
