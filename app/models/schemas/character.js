const Sequelize = require('sequelize');

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('character', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }, {
    tableName: 'character'
  })
}
