var mongoose = require('mongoose');

//define our composition table
var UserSchema = new mongoose.Schema({
    //_id: { type:Number, min:300000000, max:399999999 },
    email: { type:String, required:true, index: { unique:true } },
    username: { type:String, required: true, inxe: { unique:true } },
    password: { type:String, required: true },
    name:{ 
            firstName:{ type:String },
            lastName: { type:String }
         },
    recipes: [{ type: mongoose.Schema.Types.ObjectId , ref: 'Composition' }],
    date:{ type:Date, default: Date.now },
    report:{ type:Number, default:0 }
});
// save this as a model so we can access it
mongoose.model('User', UserSchema);
