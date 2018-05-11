var mssql = require('mssql');
var express = require('express');
var router = express.Router();

router.post('/edit_components', function(req, res, next) {
  res.set({
    'Cache-Control': 'no-cache'
  });
  res.render("edit_components", { req: req });
});

module.exports = router;
