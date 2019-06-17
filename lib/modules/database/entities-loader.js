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
        models[entityName] = require(`${schemaDirectory}/${entityName}`)(sequelize, Sequelize.DataTypes);
        models[entityName].prototype.getChangeSet = changeSetFn;
        models[entityName]
    });

    function syncWithRetry(key, retry) {
        return models[key].sync().catch(error => {
            const err = error.original;
            if(err.errno === 1215) {
                retry--;
                // console.log('retry sync for', key, retry);
                if(retry > 0) {
                    return syncWithRetry(key, retry);
                } else {
                    throw err;
                }
            } else {
                throw err;
            }
        })
    }

    return Promise.resolve()
        // .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }))
        .then(() => {
            let syncs = [];

            // si pas de table migations => sync
            let hasMigrationTable = false;
            if(!hasMigrationTable) {
                for(let key in models) {
                    // syncs.push(models[key].sync({ force: true }));
                    syncs.push(syncWithRetry(key, 10));
                }
            }

            return Promise.all(syncs);
        })
        // .then(() => Promise.all(syncs))
        // .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true }))
        .then(() => models);
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
