var mongoose = require('mongoose');

var CompositionSchema = new mongoose.Schema({
	name: String,
	AbstractIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	PrimitiveIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrimitiveIngredient'}],
	IngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
	AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}]
});

mongoose.model('Composition', CompositionSchema);