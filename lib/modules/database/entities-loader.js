const fs = require('fs');
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    let models = {
        // Entity: sequelize.define('entity',require('./schemas/entity'))
    };

    const schemaDirectory = process.env.__PROJECT_ROOT_PATH__ + '/app/models/schemas';

    let items = fs.readdirSync(schemaDirectory);

    items.map(fileName => {
        let entityName = fileName.replace(/^(.*)\.js$/, '$1');
        models[entityName] = require(`${schemaDirectory}/${entityName}`)(sequelize, Sequelize.DataTypes)
        models[entityName].prototype.getChangeSet = changeSetFn;
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

function changeSetFn() {
    console.log('change set');
    const changedFields = this.changed && this.changed();
    if(changedFields) {
        const changes = {};
        changedFields.map(fieldName => {
            changes[fieldName] = {
                previous: this._previousDataValues && this._previousDataValues[fieldName],
                next: this.get(fieldName)
            }
        });

        return changes;
    } else {
        return false;
    }
}
