var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Sandwich = require('../models/sandwich');

require('../models/Composition');
require('../models/AbstractIngredient');
require('../models/PrimitiveIngredient');
require('../models/Ingredient');

var Composition = mongoose.model('Composition');
var AbstractIngredient = mongoose.model('AbstractIngredient');
var PrimitiveIngredient = mongoose.model('PrimitiveIngredient');
var Ingredient = mongoose.model('Ingredient');

router.use(function(req, res, next) {
  console.log('API Request is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

router.get('/sandwiches', function(req, res){
    Sandwich.find(function(err, sandwiches) {
      if (err)
        res.send(err);

      res.json(sandwiches);
    });
})

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

router.get('/composition/:id', function(req, res, next) {
  Composition.findById(req.params.id).exec(function(err, composition){

    if(err){ return next(err); }
    AbstractIngredient.populate(composition.IngredientChildren, {path: 'AbstractIngredient'}, function(err, abst){
      if(err){ return next(err);}
      res.json(composition);
      // Composition.populate(composition.IngredientChildren, {path: 'AbstractIngredient.CompositionChildren'}, function(err, compositionChildren){
      //   if(err){ return next(err);}
      //   Ingredient.populate(composition.IngredientChildren, {path: 'AbstractIngredient.CompositionChildren.IngredientChildren'}, function(err, ingredients){
      //     //console.log(composition);
      //     //console.log(compositionChildren);
      //     //composition.IngredientChildren = AbstractIngredient;
          
      //   });
      // });
    });
    
  });
});

router.post('/composition', function(req, res, next) {
  // This is just to put some data in the database, obviously this will have to be removed
  // Also this should only be ran once so we don't muck up our database
  var pizza = new Composition()
  pizza.name = "Cheese Pizza"
  
  var pizzaDough = new AbstractIngredient();
  pizzaDough.name = "Pizza Dough";
  pizzaDough.CompositionParents.push(pizza);

  var pizzaDoughIngredient = {};
  pizzaDoughIngredient.AbstractIngredient = pizzaDough;
  pizzaDoughIngredient.quantity = 1;
  pizzaDoughIngredient.units = "lb"
  pizza.IngredientChildren.push(pizzaDoughIngredient);

  var pizzaSauce = new AbstractIngredient();
  pizzaSauce.name = "Pizza Sauce";
  pizzaSauce.CompositionParents.push(pizza);

  var pizzaSauceIngredient = {};
  pizzaSauceIngredient.AbstractIngredient = pizzaSauce;
  pizzaSauceIngredient.quantity = 16;
  pizzaSauceIngredient.units = "fl oz"
  pizza.IngredientChildren.push(pizzaSauceIngredient);

  var cheese = new AbstractIngredient();
  cheese.name = "Cheese";
  cheese.CompositionParents.push(pizza);

  var jackCheese = new Composition();
  jackCheese.name = "Jack Cheese"

  var vinegar = new PrimitiveIngredient();
  vinegar.name = "Vinegar"
  vinegar.CompositionParents.push(jackCheese);

  var vinegarIngredient = {};
  vinegarIngredient.PrimitiveIngredient = vinegar;
  vinegarIngredient.quantity = 16;
  vinegarIngredient.units = "fl oz";
  jackCheese.IngredientChildren.push(vinegarIngredient);
  
  var milk = new PrimitiveIngredient();
  milk.name = "Milk"

  var milkIngredient = {};
  milkIngredient.PrimitiveIngredient = milk;
  milkIngredient.quantity = 16;
  milkIngredient.units = "fl oz";
  jackCheese.IngredientChildren.push(milkIngredient);

  milk.CompositionParents.push(jackCheese);
  jackCheese.AbstractIngredientParents.push(cheese);
  cheese.CompositionChildren.push(jackCheese);

  var cheeseIngredient = {};
  cheeseIngredient.AbstractIngredient = cheese;
  cheeseIngredient.quantity = 0.5;
  cheeseIngredient.units = "lb"
  pizza.IngredientChildren.push(cheeseIngredient);


  cheese.save();
  pizzaDough.save();
  pizzaSauce.save();
  jackCheese.save();
  vinegar.save();
  milk.save();
  pizza.save(function(err, pizza){
    res.json(pizza);
  });


});


module.exports = router;
