var express = require('express');
var router = express.Router();

router.get('/info', function(req, res, next) {
  res.render('info', { title: 'Справка' });
});

module.exports = router;
