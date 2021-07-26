const { Router } = require("express");
const express = require("express");
const router = express.Router();

//afficher le contenu de la base de données
const { PostsModel } = require("../postsModel");

router.get("/", (req, res) => {
    PostsModel.find((err, docs) => {
        if(!err) res.send(docs);
        else console.log("error to get data : " + err);
    })
})

module.exports = router