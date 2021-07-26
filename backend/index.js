const express = require("express");
const app = express();
require("./dbConfig");
const postsRoutes = require ("./routes/postsController");

//creation d'un middleware qui sera à l'ecoute du req et du res//
app.use("/", postsRoutes);


app.listen(3000, () => console.log("Server started: 3000"));
