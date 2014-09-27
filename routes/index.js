var express = require('express');
var router = express.Router();
var api = require('./api');

/* GET home page. */
router.use('/api', api);
router.get('/search', function(req, res) {
  res.render('partials/search');
});
router.get('/about', function(req, res) {
  res.render('partials/about');
});
router.get('/recipe', function(req, res) {
  res.render('partials/recipe');
});
router.get('/details/:name', function(req, res) {
  res.render('partials/details');
});
router.get('/tmpIngredient', function(req, res) {
  res.render('partials/tempIngredient');
});
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
