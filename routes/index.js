var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    req: req,
    title: "Главная"
  });
});

module.exports = router;
