var mongoose = require('mongoose');
var passportlocal = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportlocal);
module.exports = mongoose.model("user",userSchema);