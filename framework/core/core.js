const YAML = require('yamljs');

module.exports = function(app){
  let framework = {};

  const config = YAML.load('./app/config/config.yml');
  const builder = require('./core-builder')(app, config);

  app.use(function(req, res, next) {
    // CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  builder.configureRoutes();
  framework.queue = builder.configureQueue();
  framework.cache = builder.configureCache();

  return framework;
}
