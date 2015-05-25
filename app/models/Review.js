var mongoose = require('mongoose');

//define our composition table
var ReviewSchema = new mongoose.Schema({
    //_id: { type:Number, min:300000000, max:399999999 },
    //Name(Title) of Review
    name:{ type:String , required: true}, 
    //Id of Recipe being Reviewed
    recipe: { type: mongoose.Schema.Types.ObjectId , ref: 'Composition' }, 
    //Date of Review
    date:{ type:Date, default: Date.now },
    //Rating of Reivew
    rating:{type:Number, min:0, max:5, required:true},
    //the _Id of the user who posted
    user: {type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    //the block of text of review
    review_block: {type:String, required:true },
    //times review reported
    report: {type:Number, default:0}
});
// save this as a model so we can access it
mongoose.model('Review', ReviewSchema);
