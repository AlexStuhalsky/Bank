var express = require('express');
var router = express.Router();

router.get('/user', function(req, res, next) {
  res.render('user', { title: 'Личный кабинет' });
});

module.exports = router;
