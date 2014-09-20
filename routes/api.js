var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//require our models
require('../models/Composition');
require('../models/AbstractIngredient');
require('../models/PrimitiveIngredient');
require('../models/User');
require('../models/Review');
require('../models/Unit');

// define our objects
var Composition = mongoose.model('Composition');
var AbstractIngredient = mongoose.model('AbstractIngredient');
var PrimitiveIngredient = mongoose.model('PrimitiveIngredient');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Unit = mongoose.model('Unit');

router.use(function(req, res, next) {
  console.log('API Request is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

//this route is for a specific composition. Thus an ID is provided
router.get('/composition/:id', function(req, res, next) {
  // use the Composition object (defined above) to look for our object by ID
  Composition.findById(req.params.id).exec(function(err, composition){
    if(err){ return next(err); }
    // populate the "AbstractIngredient" field in our "IngredientChildren" field in our composition
    // this shit is complicated and I'm not really sure I understand it.
    AbstractIngredient.populate(composition.IngredientChildren, {path: 'AbstractIngredient'}, function(err, abst){
      if(err){ return next(err);}
      res.json(composition);
    });
    
  });
});

//this route is just for testing purposes, it sets up a simple "pizza" recipe for testing
router.post('/composition/omgwtfbbq', function(req, res, next) {
  
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

  // omg wtf bbq not asynchronous but whatevs
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
