module.exports = function(ctx, resolve) {
  return {
    simpleResolve: function() {
      resolve({
        id: 1,
        title: 'Los titolidos',
        type: 'default',
        date: 'todo'
      }, 200);
      ctx.queue.publish('logs', 'resolved simpleResolve');
    },
    modelResolve: function() {
      ctx.models.character.findAll().then(characters => {
        resolve({
          something: 'else',
          characters
        })
      }).catch(error => {
        resolve({error})
      })
      ctx.queue.publish('logs', 'resolved modelResolve');
    }
  }
}
