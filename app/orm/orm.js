const Q = require('q');

module.exports = function() {
  console.log('sequelize', process.env.DB_HOSTNAME, process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD);
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    // dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  // test connection
  let testConnection = sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    throw new Error('listId does not exist');
  });



  let models = {
    Entity: sequelize.define('entity',require('./models/entity'))
  };

  let syncs = [testConnection];

  for(let key in models) {
    syncs.push(models[key].sync());
  }

  return Q.all(syncs).then(() => models);

}
