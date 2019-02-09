module.exports = function(app, config) {
  const redisSettings = {};
  return {
    configureQueue: function() {
      return require('../modules/queue/index')(redisSettings);
    },
    configureCache: function() {
      return require('../modules/cache/index')(redisSettings);
    },
    configureRoutes: function() {
      const auth = require('../modules/auth/auth');
      return require('../modules/route/route')(app, config, auth);
    }
  }
}
