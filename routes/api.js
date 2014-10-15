var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var http = require('http');
var compositionRoutes = require('./compositions');
var ingredientRoutes = require('./ingredients');

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

router.use('/compositions', compositionRoutes);
router.use('/ingredients', ingredientRoutes);

router.use(function(req, res, next) {
  console.log('API Request is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

router.get('/tmpIngredients', function(req,res) {
  TmpIngredient.find(function(err, tmpIngredients) {
    if (err)
      res.send(err);

    res.json(tmpIngredients);
  });

});

router.post('/tmpIngredients', function(req,res) {
  console.log(req.body);
  //unique means primitive
  if(req.body.unique == true)
  {
    var primitive = new PrimitiveIngredient();
    primitive.name = req.body.name;
    primitive.brand = req.body.brand;
    primitive.AbstractIngredientSchema_id = req.body.parent;
    primitive.save(); 
  }
  else
  {
    var abstract = new AbstractIngredient();
    abstract.name = req.body.name;
    //schema doesn't support abstract parents yet? 10/4 EM for Saurdo
    //abstract.parent = req.body.parent;
    abstract.save();
    console.log("New Abstract: " + abstract);
  }
  TmpIngredient.find(function(err,tmpIngredients){
    if(err)
      res.send(err)

    AbstractIngredient.find(function(err,abstractIngredients){
      if(err)
        res.send(err)
      res.json({abstracts : abstractIngredients, temps : tmpIngredients});
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