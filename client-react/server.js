const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
// const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(cors());
//app.use(bodyParser.json());
//app.use("/api", (req, res) => res.json({ username: "bryan" }));

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use("/static", express.static(__dirname + "/public"));
