"use strict";

var fs = require('fs');

var Sequelize = require('sequelize');

module.exports = function (sequelize) {
  var models = {// Entity: sequelize.define('entity',require('./schemas/entity'))
  };
  var schemaDirectory = process.env.__PROJECT_ROOT_PATH__ + '/app/models/schemas';
  var items = fs.readdirSync(schemaDirectory);
  items.map(function (fileName) {
    var entityName = fileName.replace(/^(.*)\.js$/, '$1');
    models[entityName] = require("".concat(schemaDirectory, "/").concat(entityName))(sequelize, Sequelize.DataTypes);
    models[entityName].prototype.getChangeSet = changeSetFn;
    models[entityName];
  });

  function syncWithRetry(key, retry) {
    return models[key].sync()["catch"](function (error) {
      var err = error.original;

      if (err.errno === 1215) {
        retry--; // console.log('retry sync for', key, retry);

        if (retry > 0) {
          return syncWithRetry(key, retry);
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    });
  }

  return Promise.resolve() // .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }))
  .then(function () {
    var syncs = []; // si pas de table migations => sync

    var hasMigrationTable = false;

    if (!hasMigrationTable) {
      for (var key in models) {
        // syncs.push(models[key].sync({ force: true }));
        syncs.push(syncWithRetry(key, 10));
      }
    }

    return Promise.all(syncs);
  }) // .then(() => Promise.all(syncs))
  // .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true }))
  .then(function () {
    return models;
  });
};

function changeSetFn() {
  var _this = this;

  console.log('change set');
  var changedFields = this.changed && this.changed();

  if (changedFields) {
    var changes = {};
    changedFields.map(function (fieldName) {
      changes[fieldName] = {
        previous: _this._previousDataValues && _this._previousDataValues[fieldName],
        next: _this.get(fieldName)
      };
    });
    return changes;
  } else {
    return false;
  }
}