var mongoose = require('mongoose');

var TmpIngredientSchema = new mongoose.Schema({
    name: { type:String, unique:true },
    unique: Boolean,
    processed: Boolean,
    abstract: Boolean,
    primitive: Boolean,
    brand: String,
    parent: String,
    cleansed: Boolean
});

// save this as a model so we can access it
mongoose.model('TmpIngredient', TmpIngredientSchema);
