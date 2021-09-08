const mongoose = require('mongoose');
require('mongoose-type-email');

const uniqueValidator = require('mongoose-unique-validator');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');


const userSchema = mongoose.Schema({
  email: { type: String, 
    required: [ true, "Please enter your email address"],
    unique: true ,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please enter a correct email address "]
  },
  password: { type: String, 
    required: [true, "Please choose a password"]
  }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitizerPlugin);


module.exports = mongoose.model('User', userSchema);