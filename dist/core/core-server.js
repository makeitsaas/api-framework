"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({
  // to support URL-encoded bodies
  extended: true
}));
app.use(function (req, res, next) {
  // CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.listen(process.env.PORT, function () {
  return console.log("\n*************************************************\n       App listening on port ".concat(process.env.PORT, "!\n*************************************************\n    "));
});
module.exports = app;