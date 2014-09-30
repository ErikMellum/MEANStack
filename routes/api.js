
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var http = require('http');


//require our models
require('../models/Composition');
require('../models/AbstractIngredient');
require('../models/PrimitiveIngredient');
require('../models/TmpIngredient');
require('../models/User');
require('../models/Review');
require('../models/Unit');

// define our objects
var Composition = mongoose.model('Composition');
var AbstractIngredient = mongoose.model('AbstractIngredient');
var PrimitiveIngredient = mongoose.model('PrimitiveIngredient');
var TmpIngredient = mongoose.model('TmpIngredient');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Unit = mongoose.model('Unit');

router.use(function(req, res, next) {
  console.log('API Request is happening.');
  next(); // make sure we go to the next routes and don't stop here
});
/**
 * Fetch ingredients that start with query
 * @param {post} [ingredient] The ingredient to search for, searches match beginning of name
 * @return {matches} All ingredients that matched our query
 */
router.post('/ingredients/', function(req, res, next){
  console.log(req.body.ingredient);
  var needle = req.body.ingredient;
  TmpIngredient.find({ name: { $regex: '[^A-Za-z0-9]'+needle+'.*', $options: 'i' }}).limit(10).exec(function(err, matches){

    res.json(matches);
  });
});


// fetch ingredients from the remote API and tunnel through me
/**
 * Fetch Ingredients from the remote API and tunnel through this route
 * @param  {post}   ingredients  list of ingredients to search for
 * @return {res.json} yummly object API (at the moment)
 */
router.post('/composition/withIngredients/', function(req, res, next){
  console.log(req.body)
  // test array of ingredients for now 
  var ingredients = req.body.ingredients;

  // the yummly API key embedded URL
  // suffixed with start of ingredients syntax
  var url = 'http://api.yummly.com/v1/api/recipes?_app_id=af791dca&_app_key=f28b1240c0ab4435b41d6505f0278cfd&allowedIngredient[]='

  // combine url and ingredients
  url += ingredients.join('&allowedIngredient[]=');
  // for testing
  console.log(url);

  // gets remote data
  http.get(url, function(remoteRes) {
    // testing
    console.log("Got response: " + remoteRes.statusCode);
    var recipesResponse;
    var body = ""
    remoteRes.on('data', function(data) {
      // collect the data stream
      body += data;
    });
    remoteRes.on('end', function() {
      // TODO: maybe this can be made recursive?
      recipesResponse = JSON.parse(body).matches;
      // loop through recipes and extract and create ingredients
      recipesResponse.forEach(function(recipe){
        recipe.ingredients.forEach(function(ingredient){
            console.log(ingredient)
            var tmpIngredient = new TmpIngredient();
            tmpIngredient.name = ingredient;
            tmpIngredient.save();
        });
      })
      
      // send our response
      res.json(recipesResponse); 
    });
  }).on('error', function(e) {
      console.log("Got error: " + e.message);
  });
});

/**
 * Adds a recipe to CompositionSchema -- tunnel through this route
 * @param  {recipeObject}   
 * @return {res.json} yummly object API (at the moment)
 * 
 * Should recieve a json recipe object formulated on the front end using a form 
 */
router.post('/composition/new/', function(req, res, next){
    console.log(req.body);
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
    // catch the null before it causes a null exception on the next line
    if(composition == null || err){ return next(err); }
    // populate the "AbstractIngredient" field in our "IngredientChildren" field in our composition
    // this shit is complicated and I'm not really sure I understand it.
    AbstractIngredient.populate(composition.recipe, {path: 'AbstractIngredient'}, function(err, abst){
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

  var jackCheese =c
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

router.post('/composition/new', function(req, res) {
  
  var composition = new Composition();
  composition.name = req.body.name;
  composition.save(function(err, composition){
    if (err)
      res.send(err);
    console.log("NEWNAME: " + req.body.name);
    res.json(composition);
  });



});

router.get('/compositions', function(req,res) {
  Composition.find(function(err, compositions) {
    if (err)
      res.send(err);

    res.json(compositions);
  });

});

router.get('/tmpIngredients', function(req,res) {
  TmpIngredient.find(function(err, tmpIngredients) {
    if (err)
      res.send(err);

    res.json(tmpIngredients);
  });

});

router.delete('/compositions/:composition_id', function(req, res){
  Composition.remove({
    _id : req.params.composition_id
  }, function(err, composition){
    if(err)
      res.send(err);

    Composition.find(function(err,compositions){
      if(err)
        res.send(err)
      res.json(compositions);
    });
  });
});


module.exports = router;
