const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, maxlength: [50, 'Le nom de la sauce ne doit pas dépasser s50 caractéres'] },
  manufacturer: { type: String, required: true, maxlength: [40, 'Le nom du frabricant ne doit pas dépasser 40 caractéres'] },
  description: { type: String, required: true,  maxlength: [1000, 'La description ne doit pas dépasser 100 caractéres'] },
  mainPepper: { type: String, required: true, maxlength: [500, 'Les ingrédients ne doivent pas dépasser 100 caractéres'] },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});
sauceSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('Sauce', sauceSchema);