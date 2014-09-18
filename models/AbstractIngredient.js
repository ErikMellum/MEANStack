var mongoose = require('mongoose');

// define AbstractIngredient table
var AbstractIngredientSchema = new mongoose.Schema({
	// our name field
	name: String,
	// A list of the AbstractIngredient children of this AbstractIngredient
	// for example, of this was "sauce", aan abstract ingredient child might be "pizza sauce"
	AbstractIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	// A list of the PrimitiveIngredient children
	// for example, of this was "tomato" a primitive ingredient might be "roma tomato"
	PrimitiveIngredientChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrimitiveIngredient'}],
	// A list of the composition children
	// for example, if this was pizza sauce a composition child might be "rosemary pizza sauce"
	CompositionChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}],
	// A list of AbstractIngredient parents of this abstract ingredient
	// for example, if this was "pizza sauce" a parent might be "sauce"
	AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
	// A list of Composition parents, for example if this was "pizza sauce"
	// a composition parent might be "pizza"
	CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}]
});

// save this as a model so we can access it
mongoose.model('AbstractIngredient', AbstractIngredientSchema);