require('dotenv').config();
const YAML = require('yamljs');
const config = YAML.load('./app/config/config.yml');

module.exports = config;
