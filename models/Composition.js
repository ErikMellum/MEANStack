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
    instruction: [ {name:String, details:String} ],
    rating: { type:Number, min:0, max:5, default:0},
    ratingInstance: { type:Number, default:0},
    reviewInstance: { type:Number, default:0},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type:Date, default: Date.now },
    AbstractIngredientParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbstractIngredient'}],
    CompositionParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Composition'}],
    images:[{ type:String, default:''}]
});

//Increment Rating instance; Call Every time this recipe is rated!//
CompositionSchema.methods.incInstanceValueRating = function(AI){
    this.ratingInstance += 1;
    this.save(AI);
}

//Increment Review instance; Call Every time this recipe is rated!//
CompositionSchema.methods.incInstanceValueReview = function(AI){
    this.reviewInstance += 1;
    this.save(AI);
}

//Rate Composition Algo
CompositionSchema.methods.incInstanceValueReview = function(AI, rating){
    if(this.ratingInstance === 0){
        this.rating = rating;
    } else {
        //If alread has a rating recalc emergence and remerge with new rating. (Running Average)//RatRa
        this.rating = ((this.rating*this.ratingInstance) + this.rating)/(this.ratingInstance+1);
    }
    CompositionSchema.methods.incInstanceValueRating(this);
}

/**
 *  Validates reference ID of our ingredients
 * @param  {ingredient array}   value 
 * @param  {int}   i
 * @param  {Function} next
 * @param  {Function} done
 * Author: Jayd
 */
function validateIngredients(value, i, next, done){
    // base case, end of array
    if(!value[i]){
        next();
        return;
    }
    mongoose.model('Composition').findOne({_id: value[i].Composition}, function (err1, comp) {
        mongoose.model('AbstractIngredient').findOne({_id: value[i].AbstractIngredient}, function (err2, abst) {
            mongoose.model('PrimitiveIngredient').findOne({_id: value[i].PrimitiveIngredient}, function (err3, prim) {
                if(!(comp || abst || prim)){
                    done("fuck cakes");
                    return;
                }
                validateIngredients(value, i+1, next, done);
            });
        });
    });
}
/**
 * Executes before composition is saved
 * @param  {Function} next
 * @param  {Function} done
 * Author: Jayd
 */
CompositionSchema.pre("save", function(next, done) {
    var self = this;
    console.log("pre save!");
    validateIngredients(self.recipe, 0, next, done);
});
// save this as a model so we can access it
mongoose.model('Composition', CompositionSchema);
