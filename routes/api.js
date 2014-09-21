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

// This route searches for recipes with specific abstract ingredients (can be expanded to composition and primitive)
// Will return a list of recipes
// route example: http://localhost:3000/api/composition/ingredients/Cheese/Pizza Sauce/Pizza Dough
router.get(/^\/composition\/ingredients\/(.*)/, function(req, res, next) {
  // our params regex will capture something like "/Cheese/Pizza Sauce/Pizza Dough", so split it
  var needle = req.params[0].split('/');
  // uncomment for testing purposes
  // console.log("requested params:");
  // console.log(needle);

  // let's make a collection of the IDs we'll need to search for
  // so search our ingredient schema for our list of ingredients
  var ingredientStream = AbstractIngredient.find({name: {$in: needle}}).stream();
  // keep our found ingredient IDs in this array
  var ingredientIds = [];
  ingredientStream.on('data', function (ingredient) {
    ingredientIds.push(ingredient.id)
    // uncomment for testing
    // console.log("Found this with name:" + ingredient.name);
    // console.log(ingredient);
  });

  // when the ingredient search is done, the close event is called
  ingredientStream.on('close', function () {
    // if one of our ingredients wasn't found, return a message
    // this causes a headers already sent error for some reason
    if(needle.length > ingredientIds.length)
    {
      res.json("Not all ingredients found in database!");
      return next();
    }

    // now let's make a collection of recipes that contain those IDs
    var compositionStream = Composition.find({'recipe.AbstractIngredient': {$all: ingredientIds}}).stream();
    // keep those recipes in this array
    var recipes = [];
    compositionStream.on('data', function(composition){
      // uncomment for testing
      // console.log("Pushing this recipe: ");
      // console.log(composition);
      
      // push this composition to our array
      recipes.push(composition);
    });
    // done searching
    compositionStream.on('close', function(){
      // output the recipes json
      res.json(recipes);
    });
  });  
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

  var pizzaDoughIngredient = {};
  pizzaDoughIngredient.AbstractIngredient = pizzaDough;
  pizzaDoughIngredient.quantity = 1;
  pizzaDoughIngredient.units = "lb"
  pizza.recipe.push(pizzaDoughIngredient);

  var pizzaSauce = new AbstractIngredient();
  pizzaSauce.name = "Pizza Sauce";

  var pizzaSauceIngredient = {};
  pizzaSauceIngredient.AbstractIngredient = pizzaSauce;
  pizzaSauceIngredient.quantity = 16;
  pizzaSauceIngredient.units = "fl oz"
  pizza.recipe.push(pizzaSauceIngredient);

  var cheese = new AbstractIngredient();
  cheese.name = "Cheese";

  var jackCheese = new Composition();
  jackCheese.name = "Jack Cheese";

  var vinegar = new AbstractIngredient({name: "Vinegar"})
  var whiteVinegar = new PrimitiveIngredient();
  whiteVinegar.name = "5% Acidic White Vinegar"
  whiteVinegar.AbstractIngredientSchema_id = vinegar;

  var vinegarIngredient = {};
  vinegarIngredient.PrimitiveIngredient = whiteVinegar;
  vinegarIngredient.quantity = 16;
  vinegarIngredient.units = "fl oz";
  jackCheese.recipe.push(vinegarIngredient);
  var milk = new AbstractIngredient({name: "Milk"});
  var wholeMilk = new PrimitiveIngredient();
  wholeMilk.name = "Whole Milk"
  wholeMilk.AbstractIngredientSchema_id = milk;

  var milkIngredient = {};
  milkIngredient.PrimitiveIngredient = wholeMilk;
  milkIngredient.quantity = 16;
  milkIngredient.units = "fl oz";
  jackCheese.recipe.push(milkIngredient);

  jackCheese.AbstractIngredientParents.push(cheese);

  var cheeseIngredient = {};
  cheeseIngredient.AbstractIngredient = cheese;
  cheeseIngredient.quantity = 0.5;
  cheeseIngredient.units = "lb"
  pizza.recipe.push(cheeseIngredient);

  // omg wtf bbq not asynchronous but whatevs
  cheese.save();
  pizzaDough.save();
  pizzaSauce.save();
  jackCheese.save();
  vinegar.save();
  whiteVinegar.save();
  milk.save();
  wholeMilk.save();
  pizza.save(function(err, pizza){
    res.json(pizza);
  });


});


module.exports = router;
