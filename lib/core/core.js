const config = require('./core-config');
const app = require('./core-server');
const framework = {};

const builder = require('./core-builder')(app, config, framework);

const load = async function() {
  framework.routes = await builder.configureRoutes();
  framework.queue = await builder.configureQueue();
  framework.cache = await builder.configureCache();
  const {sequelize, models} = await builder.configureDatabase();
  framework.database = {
    query: sequelize.query
  };
  framework.models = models;
};

module.exports = load().then(() => framework);
