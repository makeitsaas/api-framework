module.exports = function(app, config, framework) {
  const redisSettings = {
    host: process.env.REDIS_HOST || 'localhost'
  };
  return {
    configureQueue: function() {
      const queueAPI = require('../modules/queue/index')(redisSettings);

      return Promise.resolve(queueAPI);
    },
    configureCache: function() {
      const cacheAPI = require('../modules/cache/index')(redisSettings);

      return Promise.resolve(cacheAPI);
    },
    configureRoutes: function() {
      const auth = require('../modules/auth/auth');
      const routes = require('../modules/route/route')(app, config, auth, framework);

      // default root path
      app.get('/', (req, res) => res.send('App is up and running'));

      return Promise.resolve(routes);
    },
    configureModels: async function() {
      const models = await require('../../app/models/orm')();

      return models;
    }
  }
};
