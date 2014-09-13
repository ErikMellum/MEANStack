var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
	quantity: Number,
	units: String,
	AbstractIngredient: { type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'},
	PrimitiveIngredient: { type: mongoose.Schema.Types.ObjectId, ref: 'PrimitiveIngredient'},
	Composition: { type: mongoose.Schema.Types.ObjectId, ref: 'Composition'},
	CompositionParents: { type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}
});

mongoose.model('Ingredient', IngredientSchema);