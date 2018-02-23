var express = require('express');
var router = express.Router();

router.get('/credit', function(req, res, next) {
  res.render('credit', { title: 'Кредиты' });
});

module.exports = router;
