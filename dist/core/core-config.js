"use strict";

require('dotenv').config();

var YAML = require('yamljs');

var config = YAML.load('./app/config/config.yml');
module.exports = config;