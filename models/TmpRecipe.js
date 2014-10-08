var mongoose = require('mongoose');

var TmpRecipeSchema = new mongoose.Schema({
	id: {type: String, unique: true},
	yield: Number,
	imageUrlsBySize: {"90": String},
	sourceDisplayName: String,
	ingredients: [String],
	smallImageUrls: [String],
	recipeName: { type:String, unique:true },
	name: String,
	totalTimeInSeconds: Number,
	attributes: {
	    course: [String],
	    cuisine: [String]
	},
	flavors: {
	    Piquant: Number,
	    Meaty: Number,
	    Sour: Number,
	    Bitter: Number,
	    Salty: Number,
	    Sweet: Number,
	},
	rating: Number,
	numberOfServings: Number,
	ingredientLines: [String],
	cleansed: Boolean
});

// save this as a model so we can access it
mongoose.model('TmpRecipe', TmpRecipeSchema);
