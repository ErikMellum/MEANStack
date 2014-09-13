var mongoose = require('mongoose');

var PrimitiveIngredientSchema = new mongoose.Schema({
	name: String,
	AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}]
});

mongoose.model('PrimitiveIngredient', PrimitiveIngredientSchema);