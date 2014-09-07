var express = require('express');
var router = express.Router();
var Sandwich = require('../models/sandwich');

router.use(function(req, res, next) {
  console.log('API Request is happening.');
  next(); // make sure we go to the next routes and don't stop here
});


router.post('/sandwiches', function(req, res){
  var sandwich = new Sandwich();
  sandwich.name = "sandwich";

  sandwich.save(function(err) {
    if (err)
      res.send(err);

    Sandwich.find(function(err, sandwiches) {
      if (err)
        res.send(err);

      res.json(sandwiches);
    });
  });
});

module.exports = router;