var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var IngredientSchema = require('./Ingredient');

// define AbstractIngredient table
var AbstractIngredientSchema = IngredientSchema.extend({
  // our name field
  //_id: { type:Number, min:200000000, max:299999999 },
  instanceValue: { type:Number, default: 0}
});

AbstractIngredientSchema.methods.incInstanceValue = function(AI){
    this.instanceValue += 1;
    this.save(AI);
}

// save this as a model so we can access it
mongoose.model('AbstractIngredient', AbstractIngredientSchema);
