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

router.get('/tmpIngredients', function(req,res) {
  TmpIngredient.find(function(err, tmpIngredients) {
    if (err)
      res.send(err);
    res.json(tmpIngredients);
  });
});

router.get('/compositions', function(req,res) {
  Composition.find(function(err, compositions) {
    if (err)
      res.send(err);
    res.json(compositions);
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

router.post('/primitives', function(req,res) {
    var primitive = new PrimitiveIngredient();
    primitive.name = req.body.name.toLowerCase();
    primitive.brand = req.body.brand;
    primitive.AbstractIngredientSchema_id = req.body.parent;
    primitive.save(function(err) {
    if (err)
      res.send(err);

    PrimitiveIngredient.find(function(err, primitives) {
      if (err)
        res.send(err);

      res.json(primitives);
    });
  });
});

router.post('/abstracts', function(req,res) {
  var abstract = new AbstractIngredient();
  console.log(req.body)
  abstract.name = req.body.name.toLowerCase();
  console.log(abstract);
  //schema doesn't support abstract parents yet? 10/4 EM for Saurdo
  //abstract.parent = req.body.parent;
  abstract.save(function(err) {
    if (err) {
      res.send(err);
      console.log(err);
    }
    else {
      AbstractIngredient.find(function(err, abstracts) {
        if (err)
          res.send(err);
        else {
          console.log(abstracts)
          res.json(abstracts);
        }
      });
    }
  }); 
});

router.post('/tmpIngredient', function(req,res) {
  var tmpIngredient = new TmpIngredient();
  tmpIngredient.name = req.body.name.toLowerCase();
  tmpIngredient.save(function(err) {
  if (err)
    res.send(err);

  TmpIngredient.find(function(err, tmpIngredients) {
    if (err)
      res.send(err);

    res.json(tmpIngredients);
    });
  }); 
});

router.delete('/tmpIngredients/:tmpIngredient_name', function(req, res){
  TmpIngredient.remove({
    name : req.body.tmpIngredient_name
  }, function(err, tmpIngredient){
    if(err)
      res.send(err);

      TmpIngredient.find(function(err,tmpIngredients){
      if(err)
        res.send(err)
      
      res.json(tmpIngredients);
    });
  });
});

module.exports = router;