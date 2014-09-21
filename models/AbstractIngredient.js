var mongoose = require('mongoose');

// define AbstractIngredient table
var AbstractIngredientSchema = new mongoose.Schema({
	// our name field
        //_id: { type:Number, min:200000000, max:299999999 },
	name: { type:String, unique:true },
    instanceValue: { type:Number, default: 0}
});

// save this as a model so we can access it
mongoose.model('AbstractIngredient', AbstractIngredientSchema);
