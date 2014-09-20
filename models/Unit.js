var mongoose = require('mongoose');

//define our composition table
var UnitSchema = new mongoose.Schema({
    //Name(Title) of Review
    name:{ type:String , required: true}, 
    instance: {type:Number}
});
// save this as a model so we can access it
mongoose.model('Unit', UnitSchema);
