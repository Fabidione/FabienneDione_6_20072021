const express = require("express");
const app = express();
require("./dbConfig");
app.listen(3000, () => console.log("Server started: 3000"));
