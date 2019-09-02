if(require.main) {
    process.env.__PROJECT_ROOT_PATH__ = require.main.filename.replace(/\/app\/app\.js$/, '');
}

module.exports = require('./core/core');

