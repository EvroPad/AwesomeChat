let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    nickname: {type: String, required: true},
    message: {type: String, required: true},
    name: {type: String, required: true},
});

module.exports = mongoose.model('Messages', schema);