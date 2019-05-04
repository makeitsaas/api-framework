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
  var syncs = []; // si pas de table migations => syn

  var hasMigrationTable = false;

  if (!hasMigrationTable) {
    for (var key in models) {
      syncs.push(models[key].sync());
    }
  }

  return Promise.all(syncs).then(function () {
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