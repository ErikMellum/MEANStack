var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var http = require('http');


//require our models
require('../models/Composition');
require('../models/AbstractIngredient');
require('../models/PrimitiveIngredient');
require('../models/TmpRecipe');
require('../models/TmpIngredient');
require('../models/User');
require('../models/Review');
require('../models/Unit');

// define our objects
var Composition = mongoose.model('Composition');
var AbstractIngredient = mongoose.model('AbstractIngredient');
var PrimitiveIngredient = mongoose.model('PrimitiveIngredient');
var TmpRecipe = mongoose.model('TmpRecipe');
var TmpIngredient = mongoose.model('TmpIngredient');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Unit = mongoose.model('Unit');

/**
 * Fetch ingredients that start with query
 * @param {post} [ingredient] The ingredient to search for, searches match beginning of name
 * @return {matches} All ingredients that matched our query
 */
router.post('/', function(req, res, next){
  console.log(req.body.ingredient);
  var needle = req.body.ingredient;
  TmpIngredient.find({ name: { $regex: '(^| |\-|\/)'+needle+'.*', $options: 'i' }}).limit(10).exec(function(err, matches){
    res.json(matches);
  });
});

router.get('/primitiveIngredients', function(req,res) {
  PrimitiveIngredient.find(function(err, primitiveIngredients) {
    if (err)
      res.send(err);

    res.json(primitiveIngredients);
  });

});

router.get('/abstractIngredients', function(req,res) {
  AbstractIngredient.find(function(err, abstractIngredients) {
    if (err)
      res.send(err);

    res.json(abstractIngredients);
  });

});

router.delete('/abstractIngredients/:abstractIngredient_id', function(req, res){
  if(req.params.abstractIngredient_id > 0)
  {
    TmpIngredient.remove({
      id : req.body.abstractIngredient_id
    }, function(err, abstractIngredient){
      if(err)
        res.send(err);

        AbstractIngredient.find(function(err,abstractIngredients){
        if(err)
          res.send(err)
        
        res.json(abstractIngredients);
      });
    });
  }
});



module.exports = router;