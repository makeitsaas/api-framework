require('dotenv').config();
const YAML = require('yamljs');
const express = require('express');
const bodyParser = require('body-parser');
const framework = require('../framework/core/core');
let app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const config = YAML.load('./app/config/config.yml');

framework.configure();

require('./models/orm')().then(models => {
  app.models = models;

  framework.configureRoutes(app, config);
  require('./config/routes/routes')(app);
  app.get('/', (req, res) => res.send('App is up and running'));
  app.listen(process.env.PORT, () => console.log(`
*************************************************
       Example app listening on port ${process.env.PORT}!
*************************************************
    `));
}).catch((e) => console.log('error', e));
