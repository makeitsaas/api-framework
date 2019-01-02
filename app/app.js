require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

require('./models/orm')().then(models => {
  app.models = models;

  const framework = require('../framework/core/core')(app);

  require('./config/routes/routes')(app);
  app.get('/', (req, res) => res.send('App is up and running'));
  app.listen(process.env.PORT, () => console.log(`
*************************************************
       Example app listening on port ${process.env.PORT}!
*************************************************
    `));

  framework.cache.set('holidays', {beach: 'volley'});

  framework.queue.subscribe('channel-one').then(message => {
    console.log('get this message', message);
    framework.cache.get('holidays').then(value => console.log('holidays :', value));
  });

  setTimeout(() => {
    framework.queue.publish('channel-one', {foo: 'bar'});
  }, 1000)
}).catch((e) => console.log('error', e));
