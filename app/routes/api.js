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

router.use(function(req, res, next) {
  console.log('API Request is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

router.use('/compositions', compositionRoutes);
router.use('/ingredients', ingredientRoutes);



module.exports = router;