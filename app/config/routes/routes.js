module.exports = function(app) {
  app.get('/characters', (req, res) => {
    app.models.character.findAll().then(characters => {
      res.send({
        characters
      })
    }).catch(error => {
      res.send({error})
    })
  });

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
      input: req.body
  }));

  app.put('/entities/:id', (req, res) => res.send({
      id: req.params.id,
      input: req.body
  }));

  app.delete('/entities/:id', (req, res) => res.send({
    id: req.params.id,
    message: 'Nothing Done'
  }));
}
