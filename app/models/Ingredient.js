var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

// define AbstractIngredient table
var IngredientSchema = new mongoose.Schema({
  // our name field
  //_id: { type:Number, min:200000000, max:299999999 },
  name: { type:String, unique:true },
  parents: [{ type:mongoose.Schema.Types.ObjectId, ref:'AbstractIngredient'}],
  instanceValue: { type:Number, default: 0}
});

// save this as a model so we can access it
mongoose.model('Ingredient', IngredientSchema);

module.exports = IngredientSchema;

