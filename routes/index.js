var express = require('express');
var router = express.Router();
var api = require('./api');

/* GET home page. */
router.use('/api', api);
router.get('/landing', function(req, res) {
  res.render('partials/landing');
});
router.get('/about', function(req, res) {
  res.render('partials/about');
});
router.get('/recipe', function(req, res) {
  res.render('partials/recipe');
});
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
