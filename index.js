let rootPath = require.main.filename.replace(/\/app\/app\.js$/, '');
process.env.__PROJECT_ROOT_PATH__ = rootPath;
module.exports = require('./dist/core/core');
