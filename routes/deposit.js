var express = require('express');
var router = express.Router();

router.get('/deposit', function(req, res, next) {
  res.render('deposit', {
      title: 'Вклады',
      text: 'Выбирайте наши депозиты!'
    });
});

module.exports = router;
