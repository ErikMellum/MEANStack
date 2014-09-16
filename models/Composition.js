var mongoose = require('mongoose');

var CompositionSchema = new mongoose.Schema({
	name: String,
	AbstractIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	PrimitiveIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrimitiveIngredient'}],

	IngredientChildren: [{
		quantity: Number,
		units: String,
		AbstractIngredient: {type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'},
		PrimitiveIngredient: {type: mongoose.Schema.Types.ObjectId, ref: 'PrimitiveIngredient'},
		Composition: {type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}
	}],

	AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}]
});

CompositionSchema.virtual('simpleIngredients').get(function() {
	var cleansedChildren = [];
	for(var i =0; i < this.IngredientChildren.length; i++)
	{
		cleansedChildren.push(this.IngredientChildren[i].AbstractIngredient.name);
	};
	return {
		name: this.name,
		ingredients: cleansedChildren
	}
});
mongoose.model('Composition', CompositionSchema);