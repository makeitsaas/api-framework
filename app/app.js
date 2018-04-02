require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

require('./orm/orm')().then((models) => {
  app.models = models;

  require('./routes/routes')(app);
  app.get('/', (req, res) => res.send('App is up and running'));
  app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
}).catch((e) => console.log('error', e));
