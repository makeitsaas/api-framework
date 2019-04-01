const fs = require('fs');
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    let models = {
        // Entity: sequelize.define('entity',require('./schemas/entity'))
    };

    const schemaDirectory = __dirname + '/../../../app/models/schemas';

    let items = fs.readdirSync(schemaDirectory);

    items.map(fileName => {
        let entityName = fileName.replace(/^(.*)\.js$/, '$1');
        models[entityName] = require(`${schemaDirectory}/${entityName}`)(sequelize, Sequelize.DataTypes)
    });

    let syncs = [];

    // si pas de table migations => syn
    let hasMigrationTable = false;
    if(!hasMigrationTable) {
        for(let key in models) {
            syncs.push(models[key].sync());
        }
    }

    return Promise.all(syncs).then(() => models);
};
