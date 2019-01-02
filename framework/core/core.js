module.exports = function(app, config){
  let framework = {};
  const builder = require('./core-builder')(app, config);


  builder.configureRoutes();
  framework.queue = builder.configureQueue();
  framework.cache = builder.configureCache();

  return framework;
}
