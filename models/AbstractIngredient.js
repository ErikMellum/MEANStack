var mongoose = require('mongoose');

var AbstractIngredientSchema = new mongoose.Schema({
	name: String,
	AbstractIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	PrimitiveIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrimitiveIngredient'}],
	CompositionChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}],
	AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}]
});

mongoose.model('AbstractIngredient', AbstractIngredientSchema);