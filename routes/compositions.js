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
 * Fetch recipe from the remote API and tunnel through this route
 * @param  {post}   recipeId  Yummly Recipe ID
 * @return {res.json} yummly object API (at the moment)
 */
router.post('/', function(req, res, next){
  console.log(req.body);
  // TODO: distinguish between yummly fetch and mongodb fetch
  // test array of ingredients for now
  var recipeId = req.body.recipeId;
  
  TmpRecipe.findOne({id: recipeId }, function (err, recipe) {
    if(recipe === null){
      console.log("calling yummly");
      callYummly();
    }
    else{
      console.log("found!");
      // console.log(recipe);
      res.json(recipe);
    }
  });
  function callYummly(){
    // the yummly API key embedded URL
    // suffixed with start of ingredients syntax
    var url = 'http://api.yummly.com/v1/api/recipe/'+recipeId+'?_app_id=af791dca&_app_key=f28b1240c0ab4435b41d6505f0278cfd';

    // uhh, yeah. gotta get rid of those special characters
    url = encodeURI(url);

    // for testing
    //console.log(url);

    // gets remote data
    http.get(url, function(remoteRes) {
      // testing
      // console.log("Got response: " + remoteRes.statusCode);
      var body = ""
      remoteRes.on('data', function(data) {
        // collect the data stream
        body += data;
      });
      remoteRes.on('end', function() {
        var recipe = JSON.parse(body);
        var tmpRecipe = new TmpRecipe();

        for(var key in recipe) {
          if(recipe.hasOwnProperty(key)) {
            // console.log(key);
            tmpRecipe[key] = recipe[key];
          }
        }
        // console.log(recipe);
        tmpRecipe.save();
        // send our response
        res.json(recipe);
      });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
  }
});


/**
 * Fetch Ingredients from the remote API and tunnel through this route
 * @param  {post}   ingredients  list of ingredients to search for
 * @return {res.json} yummly object API (at the moment)
 */
router.post('/withIngredients/', function(req, res, next){
  // console.log(req.body)
  // test array of ingredients for now
  var ingredients = req.body.ingredients;
  var excluded = req.body.excluded;

  // the yummly API key embedded URL
  // suffixed with start of ingredients syntax
  var url = 'http://api.yummly.com/v1/api/recipes?_app_id=af791dca&_app_key=f28b1240c0ab4435b41d6505f0278cfd&allowedIngredient[]='

  // combine url and ingredients
  url += ingredients.join('&allowedIngredient[]=');
    // uhh, yeah. gotta get rid of those special characters
    if (excluded.length){
      url += "&excludedIngredient[]="
      url += excluded.join('&excludedIngredient[]=');
    }

  url = encodeURI(url);

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
            // console.log(ingredient)
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
 */ //Currently two /composition/new/ ??
router.post('/new/', function(req, res, next){
    console.log(req.body);

    var newComposition = new Composition();
 
    var recipeArray = [];
    req.body.ingredients.forEach(function(ingredient){
        if((ingredient.AbstractIngredientSchema_id == undefined) && (ingredient.PrimitiveIngredientSchema_id == undefined)){
          var id = ingredient.CompositionSchema_id;
          recipeArray.push({'quantity':ingredient.quantity, 'units':ingredient.units, 'Composition':id});
        }
        else if((ingredient.CompositionSchema_id == undefined) && (ingredient.PrimitiveIngredientSchema_id == undefined)){
          var id = ingredient.AbstractIngredientSchema_id;
          recipeArray.push({'quantity':ingredient.quantity, 'units':ingredient.units, 'AbstractIngredient':id});
        }
        else if((ingredient.CompositionSchema_id == undefined) && (ingredient.AbstractIngredientSchema_id == undefined)){
          var id = ingredient.PrimativeIngredientSchema_id;
          recipeArray.push({'quantity':ingredient.quantity, 'units':ingredient.units, 'PrimativeIngredient':id});
        }
    });

    console.log(recipeArray);
    newComposition.name = req.body.name;
    newComposition.recipe = recipeArray;
    newComposition.instruction = req.body.instruction;
    newComposition.save(function(err, savedComposition){
      if(err)
        res.send(err);
      var compParentId = find(savedComposition.CompositionSchema_id);
      console.log(compParentID);
    });



    /* MISSING CODE - NEEDS LOOPS TO POPULATE Children Arrays */
    //Search DB for ChildID, push onto ChildID array; via sub query//
    // *** //
    //Search DB for ParentID, push onto ParentID array; via sub query//
    // *** //
    //Save Composition//
    /*
    composition.save(function(err, composition){
      if (err)
        res.send(err);
      res.json(composition); //Return Json Object
    });
    */

});
// https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping

// This route searches for recipes with specific abstract ingredients (can be expanded to composition and primitive)
// Will return a list of recipes
// route example: http://localhost:3000/api/composition/ingredients/Cheese/Pizza Sauce/Pizza Dough
router.get(/^\/ingredients\/(.*)/, function(req, res, next) {
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

router.delete('/:composition_id', function(req, res){
  if(req.params.composition_id > 0)
  {
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
  }
});

router.get('/', function(req,res) {
  Composition.find(function(err, compositions) {
    if (err)
      res.send(err);

    res.json(compositions);
  });
});

module.exports = router;