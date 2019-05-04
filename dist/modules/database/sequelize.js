"use strict";

var Sequelize = require('sequelize');

module.exports = function (framework) {
  var sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    // dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
    // operatorsAliases: false,
    logging: process.env.DB_DEBUG || false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    hooks: {
      beforeCreate: function beforeCreate(instance, options) {},
      afterCreate: function afterCreate(instance, options) {
        framework.queue.publish('entity-change', instance.getChangeSet());
      },
      afterSave: function afterSave(instance, options) {},
      beforeUpdate: function beforeUpdate(instance, options) {},
      // called even if no need to change any data
      afterUpdate: function afterUpdate(instance, options) {
        // console.log('global afterUpdate', options, instance._previousDataValues);
        // console.log(instance.changed(), instance._change);
        framework.queue.publish('entity-change', instance.getChangeSet());
      },
      afterUpsert: function afterUpsert(values, options) {},
      afterDestroy: function afterDestroy(instance, options) {
        console.log('global afterDestroy', instance);
      }
    }
  }); // test connection

  var testConnection = sequelize.authenticate().then(function () {
    console.log("database connection .......OK");
  })["catch"](function (err) {
    console.error('Unable to connect to the database:', err);
    throw new Error('Unable to connect to the database');
  });
  return testConnection.then(function () {
    return sequelize;
  });
};