var mongoose = require('mongoose');

var PrimitiveIngredientSchema = new mongoose.Schema({
        //_id: { type:Number, min:100000000, max:199999999 },
	name: { type:String, unique:true },
    AbstractIngredientSchema_id: { type:mongoose.Schema.Types.ObjectId, ref:'AbstractIngredient'},
    instanceValue: { type:Number, default: 0}
});

// save this as a model so we can access it
mongoose.model('PrimitiveIngredient', PrimitiveIngredientSchema);
