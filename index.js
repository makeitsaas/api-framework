let rootPath = require.main.filename.replace(/app\/app\.js$/, '');
console.log("filename from module", rootPath);
process.env.__PROJECT_ROOT_PATH__ = rootPath;
module.exports = require('./lib/core/core');
