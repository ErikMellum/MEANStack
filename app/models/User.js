var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//define our composition table
var UserSchema = new mongoose.Schema({
    //_id: { type:Number, min:300000000, max:399999999 },
    local: {
        email: { type:String, required:true, index: { unique:true } },
        password: { type:String, required: true },
        username: { type:String, required: true, index: { unique:true } }
    },
    name:{ 
            firstName:{ type:String },
            lastName: { type:String }
         },
    recipes: [{ type: mongoose.Schema.Types.ObjectId , ref: 'Composition' }],
    date:{ type:Date, default: Date.now },
    report:{ type:Number, default:0 }

});
// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// save this as a model so we can access it
module.exports = mongoose.model('User', UserSchema);
