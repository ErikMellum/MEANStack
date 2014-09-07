var express = require('express');
var router = express.Router();
var api = require('./api');

/* GET home page. */
router.use('/api', api);

module.exports = router;
