"use strict";

require("./config/config");
const express = require("express");
const colors = require("colors/safe");
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");

// Use express's APIs:
const app = express();

// Require PATH:
const path = require("path");

// Use busboy for file uploading:
app.use(busboy());
// Add busboy body parser:
app.use(busboyBodyParser());
// Enable public folder:
app.use(express.static(path.resolve(__dirname, "./public")));
// Global route configuration:
app.use(require("./routes/index"));

// Set up Express to start listening:
app.listen(process.env.PORT, () => {
  console.log("Server listening to port: " + colors.green(process.env.PORT));
});
