const mongoose = require('mongoose');
//require('mongoose-type-email');

const uniqueValidator = require('mongoose-unique-validator');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
const validator = require('validator');

const userSchema = mongoose.Schema({
  email: { type: String, 
    required: [ true, "Please enter your email address"],
    unique: true ,
    validate: [validator.isEmail, { error: 'adresse mail non valide' }]  
  },
  password: { type: String, 
    required: [true, "Please choose a password"]
  }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitizerPlugin);


module.exports = mongoose.model('User', userSchema);