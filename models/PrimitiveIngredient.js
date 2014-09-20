var mongoose = require('mongoose');

var PrimitiveIngredientSchema = new mongoose.Schema({
        //_id: { type:Number, min:100000000, max:199999999 },
	name: { type:String, unique:true },
        AbstractIngredientSchema_id: { type:Number , ref:'AbstractIngredient'},
        instanceValue: { type:Number }
});

// save this as a model so we can access it
mongoose.model('PrimitiveIngredient', PrimitiveIngredientSchema);
