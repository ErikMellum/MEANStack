var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SandwichSchema   = new Schema({
  name: String
});

module.exports = mongoose.model('Sandwich', SandwichSchema);