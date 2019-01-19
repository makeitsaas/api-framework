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

  let sub = framework.queue.observable('channel-one').subscribe(message => {
    console.log('get this message', message);
    framework.cache.get('holidays').then(value => console.log('holidays :', value)).catch(err => console.log('error', err));
  });

  setTimeout(() => framework.queue.publish('channel-one', {foo: 'bar'}), 1000)
  setTimeout(() => framework.queue.publish('channel-one', {foo2: 'bar2'}), 2000)
  setTimeout(() => (sub.unsubscribe() || framework.queue.publish('channel-one', {foo3: 'bar3'})), 3000)
}).catch((e) => console.log('error', e));
