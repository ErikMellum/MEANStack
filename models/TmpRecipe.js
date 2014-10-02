var mongoose = require('mongoose');

var TmpRecipeSchema = new mongoose.Schema({
imageUrlsBySize: {"90": String},
sourceDisplayName: String,
ingredients: [String],
smallImageUrls: [String],
recipeName: { type:String, unique:true },
totalTimeInSeconds: Number,
attributes: {
    course: [String],
    cuisine: [String]
},
flavors: {
    piquant: Number,
    meaty: Number,
    sour: Number,
    bitter: Number,
    salty: Number,
    sweet: Number,
},
rating: Number,
cleansed: Boolean
});

// save this as a model so we can access it
mongoose.model('TmpRecipe', TmpRecipeSchema);
