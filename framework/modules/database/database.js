const Sequelize = require('sequelize');

module.exports = function() {
    const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || 'mysql', // dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
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

    return testConnection.then(() => sequelize);
};
