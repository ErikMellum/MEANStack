var mongoose = require('mongoose');

var TmpRecipeSchema = new mongoose.Schema({
	id: {type: String, unique:true},
	yield: String,
	images: [{
    	"imageUrlsBySize": {
        	"90": String,
        	"360": String
    	},
    	"hostedSmallUrl": String,
   		"hostedMediumUrl": String, 
    	"hostedLargeUrl": String
	}],
	sourceDisplayName: String,
	source: {
		"sourceRecipeUrl": String,
        "sourceSiteUrl": String,
        "sourceDisplayName": String
    },
	ingredients: [String],
	smallImageUrls: [String],
	recipeName: { type:String },
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
