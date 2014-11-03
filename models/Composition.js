var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var IngredientSchema = require('./Ingredient');
//define our composition table
var CompositionSchema = IngredientSchema.extend({
    // define the name as a string
    //_id: { type:Number, min:300000000, max:399999999 },
    instanceValue: { type:Number, default:0 },
    recipe: [{ 
        quantity: Number,
        units: String,
        ingredient: {type: mongoose.Schema.Types.ObjectId}
    }],
    instruction: [ {name:String, details:String} ],
    rating: { type:Number, min:0, max:5, default:0},
    ratingInstance: { type:Number, default:0},
    reviewInstance: { type:Number, default:0},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type:Date, default: Date.now },
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
 *  Validates reference ID of our ingredients recursively
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
    mongoose.model('AbstractIngredient').find({_id: value[i].ingredient}, function (err1, abstr) {
        mongoose.model('Composition').find({_id: value[i].ingredient}, function (err2, comp) {
            mongoose.model('PrimitiveIngredient').find({_id: value[i].ingredient}, function (err3, prim) {
                if(!(abstr || comp || prim){           
                    done("Error: ID not found in ingredient database.");
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
