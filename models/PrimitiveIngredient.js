var mongoose = require('mongoose');

var PrimitiveIngredientSchema = new mongoose.Schema({
	name: String,
	AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}]
});

// save this as a model so we can access it
mongoose.model('PrimitiveIngredient', PrimitiveIngredientSchema);