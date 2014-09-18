var mongoose = require('mongoose');

//define our composition table
var CompositionSchema = new mongoose.Schema({
    // define the name as a string
    name: String,
    // Contains a list of all ingredients contains in this composition
    // the ingredients are objects
    IngredientChildren: [{
        // quantity is defined
        quantity: Number,
        // units are defined
        units: String,
        // an Abstract ingredient can be defined for this ingredient
        AbstractIngredient: {type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'},
        // a primitive ingredient can be defined for this ingredient
        PrimitiveIngredient: {type: mongoose.Schema.Types.ObjectId, ref: 'PrimitiveIngredient'},
        // a composition can be defined for this ingredient
        Composition: {type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}
    }],
    // Contains a list of any Abstract Ingredients this composition might be a
    // child of (like pizza sauce might be a child of the abstract ingredient sauce)
    AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
    // Contains a list of any compositions this composition might be a child of
    // (like pizza sauce might be a child of the pizza composition) 
    CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}]
});
// save this as a model so we can access it
mongoose.model('Composition', CompositionSchema);