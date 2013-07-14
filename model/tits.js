var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TitsSchema = new Schema({
  title: { type: String },
  href: { type: String},
  replys: { type: Number, default: 1  },
  times: { type: String },
  create_at: { type: Date, default: Date.now }
});

mongoose.model('tits', TitsSchema);
