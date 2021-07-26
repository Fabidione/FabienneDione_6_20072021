const mongoose =require("mongoose");
//creation de modele de base de données//
const PostsModel = mongoose.model(
"node-api",
{
    author: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    } 
},
"posts"
);

module.exports = {PostsModel};