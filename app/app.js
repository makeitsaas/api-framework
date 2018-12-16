require('dotenv').config();
const YAML = require('yamljs');
const express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const config = YAML.load('./app/config/config.yml');

console.log('project config', config);

require('./models/orm')().then(models => {
  app.models = models;

  require('./src/routes/routes')(app);
  app.get('/', (req, res) => res.send('App is up and running'));
  app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
}).catch((e) => console.log('error', e));
