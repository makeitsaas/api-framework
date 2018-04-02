require('dotenv').config()
const express = require('express')
const app = express();
// const orm = require('./common/orm/orm')();

// orm.Entity.findAll().then(entities => console.log('entities', entities)).catch(err => console.log('err', err));

require('./common/orm/orm')().then((models) => models.Entity.findAll());


app.get('/entities', (req, res) => res.send({
  id: 1,
  title: 'Los titolidos',
  type: 'default',
  date: 'todo'
}));

app.get('/entities/:id', (req, res) => res.send({
  id: req.params.id,
  title: 'Los titolidos',
  type: 'default',
  date: 'todo'
}));

app.post('/entities', (req, res) => res.send({
  id: 1,
  title: 'Los titolidos',
  type: 'default',
  date: 'todo'
}));

app.put('/entities', (req, res) => res.send({
  id: 1,
  title: 'Los titolidos',
  type: 'default',
  date: 'todo'
}));

app.delete('/entities', (req, res) => res.send({
  id: 1,
  title: 'Los titolidos',
  type: 'default',
  date: 'todo'
}));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
