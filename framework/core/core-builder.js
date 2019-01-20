module.exports = function(app, config) {
  return {
    configureQueue: function() {
      return require('../modules/queue/index')();
    },
    configureCache: function() {
      return require('../modules/cache/index')();
    },
    configureRoutes: function() {
      const auth = require('../modules/auth/auth');
      return require('../modules/route/route')(app, config, auth);
    }
  }
}
