var mongoose = require('mongoose');

//define our composition table
var CompositionSchema = new mongoose.Schema({
    // define the name as a string
    //_id: { type:Number, min:300000000, max:399999999 },
    name: { type:String },
    instanceValue: { type:Number, default:0 },
    recipe: [{ 
        quantity: Number,
        units: String,
        AbstractIngredient: {type: mongoose.Schema.Types.ObjectId , ref: 'AbstractIngredient'},
        PrimitiveIngredient: {type: mongoose.Schema.Types.ObjectId , ref: 'PrimitiveIngredient'},
        Composition: {type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}
    }],
    rating: { type:Number, min:0, max:5 },
    ratingInstance: { type:Number },
    reviewInstance: { type:Number },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: { type:Date, default: Date.now },
    AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
    CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}],
    images:[{ type:String }]
});
// save this as a model so we can access it
mongoose.model('Composition', CompositionSchema);
