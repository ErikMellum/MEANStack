var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var IngredientSchema = require('./Ingredient');

var PrimitiveIngredientSchema = IngredientSchema.extend({
     //   _id: { type:Number, min:100000000, max:199999999 },
    brand: { type:String, unique:true},
    instanceValue: { type:Number, default: 0}
});
//Used to Increment instanceValue (Call every time you input this primative into a recipe!//
PrimitiveIngredientSchema.methods.incInstanceValue = function(AI){
    this.instanceValue += 1;
    this.save(AI);
}

// save this as a model so we can access it
mongoose.model('PrimitiveIngredient', PrimitiveIngredientSchema);
